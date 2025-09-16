/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-16 14:33:54
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\videos\stats\route.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { VideoService } from '@/services/videoService'

const videoService = new VideoService()

export async function GET(request: NextRequest) {
  try {
    const stats = await videoService.getVideoStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('视频统计API错误:', error)
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}