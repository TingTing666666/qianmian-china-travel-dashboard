/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\comments\stats\route.ts
 */
import { NextResponse } from 'next/server'
import { CommentService } from '@/services/commentService'

const commentService = new CommentService()

export async function GET() {
  try {
    const stats = await commentService.getCommentStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('获取评论统计失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取评论统计失败' 
      },
      { status: 500 }
    )
  }
}