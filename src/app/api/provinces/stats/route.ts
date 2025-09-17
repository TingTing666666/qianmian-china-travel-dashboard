/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\provinces\stats\route.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // 首先检查表是否存在
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'province_mentions'
      )
    `
    
    const tableExists = await query(tableCheckQuery)
    
    if (!tableExists.rows[0].exists) {
      // 如果表不存在，返回模拟数据
      const mockData = {
        totalProvinces: 35,
        topProvinces: [
          { name: "上海市", count: 1050, percentage: 17.9, trend: "up", rank: 1 },
          { name: "北京市", count: 631, percentage: 10.8, trend: "up", rank: 2 },
          { name: "广东省", count: 589, percentage: 10.1, trend: "stable", rank: 3 },
          { name: "浙江省", count: 456, percentage: 7.8, trend: "up", rank: 4 },
          { name: "江苏省", count: 398, percentage: 6.8, trend: "down", rank: 5 }
        ],
        totalMentions: 5860,
        growthRate: 12.5
      }
      
      return NextResponse.json({
        success: true,
        data: mockData,
        message: '使用模拟数据 - province_mentions表不存在'
      })
    }

    // 获取总省份数和总提及数
    const totalQuery = `
      SELECT 
        COUNT(DISTINCT province) as total_provinces,
        SUM(mentions) as total_mentions
      FROM province_mentions
    `
    const totalResult = await query(totalQuery)
    const totalProvinces = totalResult.rows[0].total_provinces
    const totalMentions = totalResult.rows[0].total_mentions

    // 获取Top 5省份数据
    const topQuery = `
      SELECT 
        province as name,
        mentions as count,
        ROUND((mentions * 100.0 / (SELECT SUM(mentions) FROM province_mentions)), 1) as percentage
      FROM province_mentions
      ORDER BY mentions DESC
      LIMIT 5
    `
    
    const topResult = await query(topQuery)
    
    const topProvinces = topResult.rows.map((row, index) => ({
      name: row.name,
      count: parseInt(row.count),
      percentage: parseFloat(row.percentage),
      trend: index % 3 === 0 ? "up" : index % 3 === 1 ? "stable" : "down", // 模拟趋势
      rank: index + 1
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalProvinces: parseInt(totalProvinces),
        topProvinces,
        totalMentions: parseInt(totalMentions),
        growthRate: 12.5 // 模拟增长率
      }
    })
  } catch (error) {
    console.error('获取地域统计失败:', error)
    
    // 发生错误时返回模拟数据
    const mockData = {
      totalProvinces: 35,
      topProvinces: [
        { name: "上海市", count: 1050, percentage: 17.9, trend: "up", rank: 1 },
        { name: "北京市", count: 631, percentage: 10.8, trend: "up", rank: 2 },
        { name: "广东省", count: 589, percentage: 10.1, trend: "stable", rank: 3 },
        { name: "浙江省", count: 456, percentage: 7.8, trend: "up", rank: 4 },
        { name: "江苏省", count: 398, percentage: 6.8, trend: "down", rank: 5 }
      ],
      totalMentions: 5860,
      growthRate: 12.5
    }
    
    return NextResponse.json({
      success: true,
      data: mockData,
      message: '使用模拟数据 - 数据库连接失败'
    })
  }
}