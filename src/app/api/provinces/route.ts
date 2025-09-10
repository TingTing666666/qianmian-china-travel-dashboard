/*
 * @Date: 2025-09-10 13:47:12
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-10 13:47:23
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\provinces\route.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { ProvinceService } from '@/services/provinceService'
import { ProvinceMentionResponse } from '@/types/province'

const provinceService = new ProvinceService()

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : undefined

    // 获取数据
    const data = limit 
      ? await provinceService.getTopProvinceMentions(limit)
      : await provinceService.getProvinceMentions()

    const response: ProvinceMentionResponse = {
      success: true,
      data
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API错误:', error)
    
    const errorResponse: ProvinceMentionResponse = {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '未知错误'
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}