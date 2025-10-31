import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST() {
  try {
    // 创建表
    await query(`
      CREATE TABLE IF NOT EXISTS public.video_fdata (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        published_at TIMESTAMP WITH TIME ZONE NULL,
        channel_title TEXT,
        channel_id TEXT,
        tags TEXT,
        category_id INTEGER,
        view_count INTEGER,
        like_count INTEGER,
        favorite_count INTEGER,
        comment_count INTEGER,
        duration TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `)

    // 索引
    await query(`
      CREATE INDEX IF NOT EXISTS idx_video_fdata_published_at ON public.video_fdata (published_at);
    `)
    await query(`
      CREATE INDEX IF NOT EXISTS idx_video_fdata_channel_title ON public.video_fdata (channel_title);
    `)

    const check = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'video_fdata'
      ) as exists
    `)

    return NextResponse.json({
      success: true,
      tableExists: check.rows[0]?.exists === true,
      message: 'video_fdata 表已初始化'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || '初始化失败'
    }, { status: 500 })
  }
}