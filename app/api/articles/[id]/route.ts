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
      ? `SELECT a.*, u.name as writer_name, u.profile_photo as writer_profile_photo 
         FROM articles a 
         LEFT JOIN users u ON a.writer_id = u.id 
         WHERE a.id = ? AND a.status = 1`
      : `SELECT a.*, u.name as writer_name, u.profile_photo as writer_profile_photo 
         FROM articles a 
         LEFT JOIN users u ON a.writer_id = u.id 
         WHERE a.slug = ? AND a.status = 1`

    const results = await query(sql, [id]) as any[]

    if (results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: results[0],
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch article',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
