/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\comments\route.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { CommentService } from '@/services/commentService'
import { CommentQueryParams } from '@/types/comment'

const commentService = new CommentService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params: CommentQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: searchParams.get('sortBy') as any || 'publishedat',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      search: searchParams.get('search') || undefined,
      videoId: searchParams.get('videoId') || undefined,
      sentimentCategory: searchParams.get('sentimentCategory') || undefined,
      author: searchParams.get('author') || undefined
    }

    const result = await commentService.getCommentData(params)
    
    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
      page: params.page,
      limit: params.limit
    })
  } catch (error) {
    console.error('获取评论数据失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取评论数据失败' 
      },
      { status: 500 }
    )
  }
}