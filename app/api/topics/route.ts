import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/mysql';
import type { HealthTopicWithCount } from '@/lib/types/topic';
import { getDummyTopicsWithCounts, getDummyTopics } from '@/lib/db/dummy-data';

/**
 * GET /api/topics
 * Get list of all health topics with article counts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeCount = searchParams.get('includeCount') !== 'false';

    // Try database connection, fallback to dummy data
    let useDummyData = false;
    try {
      await query('SELECT 1');
    } catch (dbError: any) {
      console.warn('Database connection failed, using dummy data:', dbError.message);
      useDummyData = true;
    }

    if (useDummyData) {
      const topics = includeCount ? getDummyTopicsWithCounts() : getDummyTopics().map(t => ({ ...t, articleCount: 0 }));
      return NextResponse.json(topics);
    }

    // Check if article_health_topics table exists
    let hasJunctionTable = true;
    try {
      await query('SELECT 1 FROM article_health_topics LIMIT 1');
    } catch {
      hasJunctionTable = false;
      // Fallback to dummy data if table doesn't exist
      useDummyData = true;
    }

    if (useDummyData) {
      const topics = includeCount ? getDummyTopicsWithCounts() : getDummyTopics().map(t => ({ ...t, articleCount: 0 }));
      return NextResponse.json(topics);
    }

    let topics: HealthTopicWithCount[];

    if (includeCount && hasJunctionTable) {
      // Get topics with article counts
      const topicsWithCount = await query<any>(
        `SELECT 
          ht.*,
          COUNT(DISTINCT aht.article_id) as articleCount
        FROM health_topics ht
        LEFT JOIN article_health_topics aht ON ht.id = aht.health_topic_id
        LEFT JOIN articles a ON aht.article_id = a.id AND a.status = 1
        GROUP BY ht.id
        ORDER BY ht.id ASC`
      );

      topics = topicsWithCount.map((topic: any) => ({
        id: topic.id,
        name: topic.name || topic.title || `Topic ${topic.id}`,
        slug: topic.slug,
        description: topic.description || topic.body || null,
        created_at: new Date(topic.created_at),
        updated_at: new Date(topic.updated_at),
        articleCount: parseInt(topic.articleCount) || 0,
      }));
    } else if (includeCount && !hasJunctionTable) {
      // Get topics without counts (junction table doesn't exist)
      const topicsData = await query<any>(
        `SELECT * FROM health_topics ORDER BY id ASC`
      );

      topics = topicsData.map((topic: any) => ({
        id: topic.id,
        name: topic.name || topic.title || `Topic ${topic.id}`,
        slug: topic.slug,
        description: topic.description || topic.body || null,
        created_at: new Date(topic.created_at),
        updated_at: new Date(topic.updated_at),
        articleCount: 0, // Can't count without junction table
      }));
    } else {
      // Get topics without counts
      const topicsData = await query<any>(
        `SELECT * FROM health_topics ORDER BY id ASC`
      );

      topics = topicsData.map((topic: any) => ({
        id: topic.id,
        name: topic.name || topic.title || `Topic ${topic.id}`,
        slug: topic.slug,
        description: topic.description || topic.body || null,
        created_at: new Date(topic.created_at),
        updated_at: new Date(topic.updated_at),
        articleCount: 0,
      }));
    }

    return NextResponse.json(topics);
  } catch (error: any) {
    console.error('Error fetching topics:', error);
    console.error('Error stack:', error.stack);
    
    let errorMessage = 'Failed to fetch topics';
    if (error.message) {
      errorMessage = error.message;
    }
    
    // Check if it's a database connection error
    if (error.message?.includes('Database configuration missing') || 
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('Access denied')) {
      errorMessage = 'Database connection error. Please check your database configuration.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

