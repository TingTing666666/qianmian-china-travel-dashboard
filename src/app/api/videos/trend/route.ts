/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\videos\trend\route.ts
 */

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface TrendData {
  period: string
  count: number
  date: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeUnit = searchParams.get('timeUnit') || 'month'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 构建查询条件
    let whereClause = 'WHERE published_at IS NOT NULL'
    const queryParams: any[] = []
    let paramIndex = 1

    if (startDate) {
      whereClause += ` AND published_at >= $${paramIndex}`
      queryParams.push(startDate)
      paramIndex++
    }

    if (endDate) {
      whereClause += ` AND published_at <= $${paramIndex}`
      queryParams.push(endDate)
      paramIndex++
    }

    // 根据时间单位构建SQL查询
    let dateFormat: string
    let dateGroupBy: string
    
    switch (timeUnit) {
      case 'day':
        dateFormat = 'YYYY-MM-DD'
        dateGroupBy = 'DATE(published_at)'
        break
      case 'week':
        dateFormat = 'YYYY-MM-DD'
        dateGroupBy = 'DATE_TRUNC(\'week\', published_at)'
        break
      case 'month':
        dateFormat = 'YYYY-MM-01'
        dateGroupBy = 'DATE_TRUNC(\'month\', published_at)'
        break
      case 'year':
        dateFormat = 'YYYY-01-01'
        dateGroupBy = 'DATE_TRUNC(\'year\', published_at)'
        break
      default:
        dateFormat = 'YYYY-MM-DD'
        dateGroupBy = 'DATE(published_at)'
    }

    // 执行聚合查询
    const trendQuery = `
      SELECT 
        TO_CHAR(${dateGroupBy}, '${dateFormat}') as period,
        COUNT(*) as count,
        TO_CHAR(${dateGroupBy}, 'YYYY-MM-DD') as date
      FROM video_fdata
      ${whereClause}
      GROUP BY ${dateGroupBy}
      ORDER BY ${dateGroupBy}
    `

    const result = await query(trendQuery, queryParams)
    const trendData: TrendData[] = result.rows.map(row => ({
      period: formatPeriodLabel(new Date(row.date), timeUnit),
      count: parseInt(row.count),
      date: row.date
    }))

    // 获取总数统计
    const totalQuery = `
      SELECT COUNT(*) as total
      FROM video_fdata
      ${whereClause}
    `
    const totalResult = await query(totalQuery, queryParams)
    const totalVideos = parseInt(totalResult.rows[0].total)

    return NextResponse.json({
      success: true,
      data: trendData,
      meta: {
        timeUnit,
        totalPeriods: trendData.length,
        totalVideos,
        dateRange: {
          start: startDate || (trendData.length > 0 ? trendData[0].date : null),
          end: endDate || (trendData.length > 0 ? trendData[trendData.length - 1].date : null)
        }
      }
    })

  } catch (error) {
    console.error('获取趋势数据失败:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 })
  }
}

function formatPeriodLabel(date: Date, timeUnit: string): string {
  switch (timeUnit) {
    case 'day':
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    case 'week':
      return `${date.getFullYear()}年第${Math.ceil(date.getDate() / 7)}周`
    case 'month':
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })
    case 'year':
      return `${date.getFullYear()}年`
    default:
      return date.toISOString().split('T')[0]
  }
}