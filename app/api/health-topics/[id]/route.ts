import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Check if id is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(id)
    const sql = isNumeric
      ? `SELECT * FROM health_topics WHERE id = ?`
      : `SELECT * FROM health_topics WHERE slug = ?`

    const results = await query(sql, [id]) as any[]

    if (results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Health topic not found',
        },
        { status: 404 }
      )
    }

    const topic = results[0]

    // Count articles related to this health topic
    // Get all approved articles and check if they contain this topic ID in their health_topics field
    // health_topics in articles table stores IDs (e.g., "105" or "105,112")
    const articlesSql = `SELECT health_topics FROM articles WHERE status = 1`
    const articles = await query(articlesSql, []) as any[]
    
    let article_count = 0
    const topicId = topic.id
    
    articles.forEach((article: any) => {
      if (article.health_topics) {
        const articleTopicIds = article.health_topics.split(',').map((t: string) => {
          const trimmed = t.trim()
          const parsed = parseInt(trimmed, 10)
          return isNaN(parsed) ? null : parsed
        }).filter((id: number | null) => id !== null) as number[]
        
        if (articleTopicIds.includes(topicId)) {
          article_count++
        }
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          ...topic,
          article_count
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching health topic:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch health topic',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

