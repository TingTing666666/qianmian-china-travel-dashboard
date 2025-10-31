import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // 以 title + channel_id 作为重复判定，保留观看数高且发布时间新的那条
    const sql = `
      WITH ranked AS (
        SELECT 
          id,
          title,
          channel_id,
          published_at,
          COALESCE(view_count, 0) AS vc,
          ROW_NUMBER() OVER (
            PARTITION BY title, channel_id 
            ORDER BY COALESCE(view_count,0) DESC, COALESCE(published_at, '1970-01-01') DESC, COALESCE(created_at, '1970-01-01') DESC
          ) AS rn
        FROM video_fdata
        WHERE title IS NOT NULL AND channel_id IS NOT NULL
      ),
      to_delete AS (
        SELECT id, title, channel_id FROM ranked WHERE rn > 1
      )
      DELETE FROM video_fdata vf
      USING to_delete td
      WHERE vf.id = td.id
      RETURNING td.title, td.channel_id, vf.id AS deleted_id;
    `

    const result = await query(sql)
    const deleted = result.rows || []

    // 统计重复的分组数量和删除数量
    const groups = new Set<string>()
    deleted.forEach((row: any) => {
      groups.add(`${row.title}__${row.channel_id}`)
    })

    return NextResponse.json({
      success: true,
      deletedCount: deleted.length,
      duplicateGroups: groups.size,
      details: deleted
    })
  } catch (error: any) {
    console.error('查重删除失败:', error)
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = `
      SELECT title, channel_id, COUNT(*) AS cnt
      FROM video_fdata
      WHERE title IS NOT NULL AND channel_id IS NOT NULL
      GROUP BY title, channel_id
      HAVING COUNT(*) > 1
      ORDER BY cnt DESC
      LIMIT 50;
    `
    const res = await query(sql)
    return NextResponse.json({ success: true, data: res.rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 })
  }
}