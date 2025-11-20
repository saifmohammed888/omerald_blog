import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || '1' // Default to approved (1)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search') || ''
    const healthTopic = searchParams.get('healthTopic') || ''
    const topic = searchParams.get('topic') || '' // Support topic by slug/name
    
    // Calculate offset from page
    const offset = (page - 1) * limit

    // Validate sortBy to prevent SQL injection
    const allowedSortBy = ['created_at', 'updated_at', 'title', 'approval_date', 'article_ratings']
    const validSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'

    // Build WHERE conditions (use table alias 'a' for articles)
    const conditions: string[] = ['a.status = ?']
    const params: any[] = [status]

    // Add search filter
    if (search) {
      conditions.push(`(a.title LIKE ? OR a.short_description LIKE ? OR a.description LIKE ?)`)
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
    }

    // Handle topic parameter (slug/name) - convert to health topic ID(s)
    let topicIds: string[] = []
    
    // Process healthTopic parameter - can be comma-separated IDs or titles
    if (healthTopic) {
      const healthTopicValues = healthTopic.split(',').map(t => t.trim()).filter(Boolean)
      
      for (const value of healthTopicValues) {
        // Check if it's already a numeric ID
        if (/^\d+$/.test(value)) {
          topicIds.push(value)
        } else {
          // It's a title or slug, look it up
          try {
            const topicSql = `SELECT id FROM health_topics WHERE LOWER(slug) = LOWER(?) OR LOWER(title) = LOWER(?) LIMIT 1`
            const topicResults = await query(topicSql, [value, value]) as any[]
            if (topicResults.length > 0) {
              topicIds.push(topicResults[0].id.toString())
              console.log(`Topic "${value}" mapped to ID: ${topicResults[0].id}`)
            } else {
              console.log(`No health topic found for "${value}"`)
            }
          } catch (error) {
            console.error(`Error looking up topic "${value}":`, error)
          }
        }
      }
    }
    
    // Handle topic parameter (slug/name) - convert to health topic ID(s)
    if (topic && topicIds.length === 0) {
      try {
        // Try to find health topic by slug or title (case-insensitive)
        const topicSql = `SELECT id FROM health_topics WHERE LOWER(slug) = LOWER(?) OR LOWER(title) = LOWER(?) LIMIT 1`
        const topicResults = await query(topicSql, [topic, topic]) as any[]
        console.log(`Topic lookup for "${topic}": found ${topicResults.length} results`)
        if (topicResults.length > 0) {
          topicIds.push(topicResults[0].id.toString())
          console.log(`Topic "${topic}" mapped to ID: ${topicIds[0]}`)
        } else {
          console.log(`No health topic found for "${topic}"`)
        }
      } catch (error) {
        console.error('Error looking up topic:', error)
        // If lookup fails, continue without topic filter
      }
    }
    
    // Add health topic filter - support multiple topic IDs
    // When multiple topics are selected, show articles that match ANY of them (OR logic)
    if (topicIds.length > 0) {
      console.log(`[API] Filtering articles by topic IDs: ${topicIds.join(', ')}`)
      
      const topicConditions: string[] = []
      const topicParams: any[] = []
      
      topicIds.forEach((topicId) => {
        // Use FIND_IN_SET for precise matching of comma-separated values
        // This correctly matches topic IDs in the health_topics column
        // Pattern: FIND_IN_SET('5', '5,10,15') returns 1 (found at position 1)
        // This is more accurate than LIKE patterns which could match "5" in "15" or "25"
        topicConditions.push(`FIND_IN_SET(?, a.health_topics) > 0`)
        topicParams.push(topicId)
      })
      
      // Use OR logic for multiple topics (article matches if it has any of the selected topics)
      const topicFilter = `(${topicConditions.join(' OR ')})`
      conditions.push(topicFilter)
      params.push(...topicParams)
      
      console.log(`[API] Topic filter SQL: ${topicFilter}`)
      console.log(`[API] Topic filter params:`, topicParams)
    }

    const whereClause = conditions.join(' AND ')

    // Fetch articles with filters (JOIN with users table to get writer name)
    const sql = `
      SELECT 
        a.id,
        a.writer_id,
        a.title,
        a.slug,
        a.short_description,
        a.description,
        a.health_topics,
        a.article_ratings,
        a.status,
        a.image,
        a.approval_date,
        a.created_at,
        a.updated_at,
        u.name as writer_name,
        u.profile_photo as writer_profile_photo
      FROM articles a
      LEFT JOIN users u ON a.writer_id = u.id
      WHERE ${whereClause}
      ORDER BY a.${validSortBy} ${validSortOrder}
      LIMIT ? OFFSET ?
    `

    params.push(limit, offset)
    
    let articles: any[] = []
    let total = 0
    let totalPages = 0
    
    try {
      console.log(`[API] Executing SQL: ${sql}`)
      console.log(`[API] SQL params:`, params)
      
      articles = await query(sql, params) as any[]
      
      console.log(`[API] Found ${articles.length} articles matching filters`)
      if (articles.length > 0 && topicIds.length > 0) {
        console.log(`[API] Sample article health_topics values:`, articles.slice(0, 3).map((a: any) => a.health_topics))
      }

      // Get total count for pagination
      const countSql = `SELECT COUNT(*) as total FROM articles a WHERE ${whereClause}`
      const countParams = params.slice(0, -2) // Remove limit and offset
      const [countResult] = await query(countSql, countParams) as any[]
      total = countResult?.total || 0
      totalPages = Math.ceil(total / limit)
      
      console.log(`[API] Total articles: ${total}, Total pages: ${totalPages}`)
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      // Return empty results if database is unavailable
      // This allows the app to still work even if DB is down
      return NextResponse.json(
        {
          success: false,
          data: [],
          pagination: {
            total: 0,
            limit,
            page,
            totalPages: 0,
            offset,
            hasMore: false,
          },
          error: 'Database unavailable',
        },
        { status: 200, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: articles,
        pagination: {
          total,
          limit,
          page,
          totalPages,
          offset,
          hasMore: page < totalPages,
        },
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch articles',
        message: error.message,
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
