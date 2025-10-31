import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST() {
  const actions: string[] = []

  try {
    // 检查表是否存在
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'video_fdata'
      ) as exists
    `)
    const tableExists = tableCheck.rows[0]?.exists === true

    if (!tableExists) {
      return NextResponse.json({
        success: false,
        error: 'video_fdata 表不存在，请先调用 /api/db/init 创建',
      }, { status: 400 })
    }

    // 检查列是否存在
    const columnsRes = await query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'video_fdata'
    `)
    const existingColumns = new Set(columnsRes.rows.map((r: any) => r.column_name))

    // 需要补充的列
    const missing: string[] = []

    if (!existingColumns.has('updated_at')) {
      await query(`ALTER TABLE public.video_fdata ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()`)
      actions.push('添加列 updated_at TIMESTAMP DEFAULT NOW()')
    }

    // 返回结果
    return NextResponse.json({
      success: true,
      actions,
      message: actions.length ? '数据库迁移完成' : '无需迁移，结构已完整'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || '数据库迁移失败'
    }, { status: 500 })
  }
}