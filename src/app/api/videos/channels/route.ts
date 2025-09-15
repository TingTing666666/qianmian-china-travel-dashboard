/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\videos\channels\route.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { VideoService } from '@/services/videoService'

const videoService = new VideoService()

export async function GET(request: NextRequest) {
  try {
    const channels = await videoService.getChannels()

    return NextResponse.json({
      success: true,
      data: channels
    })
  } catch (error) {
    console.error('频道列表API错误:', error)
    
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}