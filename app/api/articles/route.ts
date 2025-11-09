import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

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
    
    // Calculate offset from page
    const offset = (page - 1) * limit

    // Validate sortBy to prevent SQL injection
    const allowedSortBy = ['created_at', 'updated_at', 'title', 'approval_date', 'article_ratings']
    const validSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'

    // Build WHERE conditions
    const conditions: string[] = ['status = ?']
    const params: any[] = [status]

    // Add search filter
    if (search) {
      conditions.push(`(title LIKE ? OR short_description LIKE ? OR description LIKE ?)`)
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
    }

    // Add health topic filter
    if (healthTopic) {
      conditions.push(`(health_topics LIKE ? OR health_topics LIKE ? OR health_topics = ?)`)
      params.push(`%${healthTopic}%`, `${healthTopic},%`, healthTopic)
    }

    const whereClause = conditions.join(' AND ')

    // Fetch articles with filters
    const sql = `
      SELECT 
        id,
        writer_id,
        title,
        slug,
        short_description,
        description,
        health_topics,
        article_ratings,
        status,
        image,
        approval_date,
        created_at,
        updated_at
      FROM articles
      WHERE ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ? OFFSET ?
    `

    params.push(limit, offset)
    const articles = await query(sql, params)

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM articles WHERE ${whereClause}`
    const countParams = params.slice(0, -2) // Remove limit and offset
    const [countResult] = await query(countSql, countParams) as any[]
    const total = countResult?.total || 0
    const totalPages = Math.ceil(total / limit)

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
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch articles',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
