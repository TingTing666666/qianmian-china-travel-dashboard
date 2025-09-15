/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\videos\heatmap\route.ts
 */

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface HeatmapData {
  date: string
  count: number
  level: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // 构建查询条件
    const whereClause = `WHERE EXTRACT(YEAR FROM published_at) = $1`
    const queryParams = [parseInt(year)]

    // 执行聚合查询
    const heatmapQuery = `
      SELECT 
        DATE(published_at) as date,
        COUNT(*) as count
      FROM video_fdata
      ${whereClause}
      GROUP BY DATE(published_at)
      ORDER BY DATE(published_at)
    `

    const result = await query(heatmapQuery, queryParams)
    const dataMap = new Map<string, number>()
    
    result.rows.forEach(row => {
      dataMap.set(row.date, parseInt(row.count))
    })

    // 生成完整年份的日期序列
    const heatmapData: HeatmapData[] = []
    const startDate = new Date(parseInt(year), 0, 1)
    const endDate = new Date(parseInt(year), 11, 31)
    
    let currentDate = new Date(startDate)
    const counts = Array.from(dataMap.values())
    const maxCount = Math.max(...counts, 1)
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const count = dataMap.get(dateStr) || 0
      const level = count === 0 ? 0 : Math.ceil((count / maxCount) * 4)
      
      heatmapData.push({
        date: dateStr,
        count,
        level: Math.min(level, 4)
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // 获取统计信息
    const totalQuery = `
      SELECT 
        COUNT(*) as total_videos,
        COUNT(DISTINCT DATE(published_at)) as active_days
      FROM video_fdata
      ${whereClause}
    `
    const statsResult = await query(totalQuery, queryParams)
    const stats = statsResult.rows[0]

    return NextResponse.json({
      success: true,
      data: heatmapData,
      meta: {
        year: parseInt(year),
        totalVideos: parseInt(stats.total_videos),
        activeDays: parseInt(stats.active_days),
        maxDailyCount: maxCount,
        averageDailyCount: Math.round(parseInt(stats.total_videos) / 365 * 100) / 100
      }
    })

  } catch (error) {
    console.error('获取热力图数据失败:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 })
  }
}