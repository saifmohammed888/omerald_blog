import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const isMajor = searchParams.get('is_major_health_event')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build dynamic query based on filters
    let sql = `
      SELECT 
        id,
        title,
        slug,
        body,
        image,
        status,
        is_major_health_event,
        created_by,
        updated_by,
        created_at,
        updated_at
      FROM health_topics
      WHERE 1=1
    `
    const params: any[] = []

    if (status !== null) {
      sql += ` AND status = ?`
      params.push(status)
    }

    if (isMajor !== null) {
      sql += ` AND is_major_health_event = ?`
      params.push(isMajor === '1' ? 1 : 0)
    }

    if (search) {
      sql += ` AND (title LIKE ? OR body LIKE ?)`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const healthTopics = await query(sql, params) as any[]

    // Get all approved articles to count related articles for each health topic
    const articlesSql = `SELECT health_topics FROM articles WHERE status = 1`
    const articles = await query(articlesSql, []) as any[]

    // Create a mapping of health topic IDs to article counts
    const topicCountMap: { [key: number]: number } = {}
    
    // Initialize all health topics with 0 count
    healthTopics.forEach((topic: any) => {
      topicCountMap[topic.id] = 0
    })

    // Count articles for each health topic
    // health_topics in articles table stores IDs (e.g., "105" or "105,112")
    articles.forEach((article: any) => {
      if (article.health_topics) {
        const articleTopicIds = article.health_topics.split(',').map((t: string) => {
          const trimmed = t.trim()
          // Try to parse as integer, return null if not a number
          const parsed = parseInt(trimmed, 10)
          return isNaN(parsed) ? null : parsed
        }).filter((id: number | null) => id !== null) as number[]
        
        articleTopicIds.forEach((topicId: number) => {
          if (topicCountMap.hasOwnProperty(topicId)) {
            topicCountMap[topicId] = (topicCountMap[topicId] || 0) + 1
          }
        })
      }
    })

    // Add article count to each health topic
    const healthTopicsWithCounts = healthTopics.map((topic: any) => ({
      ...topic,
      article_count: topicCountMap[topic.id] || 0
    }))

    // Get total count for pagination
    let countSql = `SELECT COUNT(*) as total FROM health_topics WHERE 1=1`
    const countParams: any[] = []

    if (status !== null) {
      countSql += ` AND status = ?`
      countParams.push(status)
    }

    if (isMajor !== null) {
      countSql += ` AND is_major_health_event = ?`
      countParams.push(isMajor === '1' ? 1 : 0)
    }

    if (search) {
      countSql += ` AND (title LIKE ? OR body LIKE ?)`
      const searchTerm = `%${search}%`
      countParams.push(searchTerm, searchTerm)
    }

    const [countResult] = await query(countSql, countParams) as any[]
    const total = countResult?.total || 0

    return NextResponse.json(
      {
        success: true,
        data: healthTopicsWithCounts,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching health topics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch health topics',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

