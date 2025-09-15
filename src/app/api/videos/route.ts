/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-15 16:16:53
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\videos\route.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { VideoService } from '@/services/videoService'
import { VideoDataResponse } from '@/types/video'

const videoService = new VideoService()

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const sortBy = searchParams.get('sortBy') as any
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc'
    const search = searchParams.get('search') || undefined
    const channelTitle = searchParams.get('channelTitle') || undefined
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined

    // 获取数据
    const result = await videoService.getVideoData({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      channelTitle,
      categoryId
    })

    const response: VideoDataResponse = {
      success: true,
      data: result.data,
      total: result.total,
      page,
      limit
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('视频数据API错误:', error)
    
    const errorResponse: VideoDataResponse = {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '未知错误'
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}