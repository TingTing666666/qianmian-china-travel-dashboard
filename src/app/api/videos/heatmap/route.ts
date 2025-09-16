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
    const startYear = searchParams.get('startYear') || new Date().getFullYear().toString()
    const yearCount = parseInt(searchParams.get('yearCount') || '1')

    // 计算年份范围
    const startYearInt = parseInt(startYear)
    const endYearInt = startYearInt + yearCount - 1

    // 构建查询条件
    const whereClause = `WHERE EXTRACT(YEAR FROM published_at) BETWEEN $1 AND $2`
    const queryParams = [startYearInt, endYearInt]

    // 执行聚合查询
    const heatmapQuery = `
      SELECT 
        DATE(published_at) as date,
        COUNT(*) as count
      FROM video_fdata
      ${whereClause}
      AND published_at IS NOT NULL
      GROUP BY DATE(published_at)
      ORDER BY DATE(published_at)
    `

    const result = await query(heatmapQuery, queryParams)
    const dataMap = new Map<string, number>()
    
    result.rows.forEach(row => {
      // 确保日期格式正确
      const dateStr = row.date instanceof Date 
        ? row.date.toISOString().split('T')[0]
        : row.date
      dataMap.set(dateStr, parseInt(row.count))
    })

    // 生成完整年份范围的日期序列
    const heatmapData: HeatmapData[] = []
    const startDate = new Date(startYearInt, 0, 1)
    const endDate = new Date(endYearInt, 11, 31)
    
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

    // 计算总天数
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return NextResponse.json({
      success: true,
      data: heatmapData,
      meta: {
        startYear: startYearInt,
        endYear: endYearInt,
        yearCount,
        totalVideos: parseInt(stats.total_videos),
        activeDays: parseInt(stats.active_days),
        maxDailyCount: maxCount,
        averageDailyCount: Math.round(parseInt(stats.total_videos) / totalDays * 100) / 100
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