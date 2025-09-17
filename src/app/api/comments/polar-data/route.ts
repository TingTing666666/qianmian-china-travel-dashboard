/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\api\comments\polar-data\route.ts
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
        AND table_name = 'analyzed_comments'
      )
    `
    
    const tableExists = await query(tableCheckQuery)
    
    if (!tableExists.rows[0].exists) {
      // 如果表不存在，返回适合新格式的模拟数据
      const mockData = [
        { score: -1.0, year: '2020', count: 15 },
        { score: -0.8, year: '2020', count: 25 },
        { score: -0.6, year: '2020', count: 30 },
        { score: -0.4, year: '2020', count: 20 },
        { score: -0.2, year: '2020', count: 10 },
        { score: 0.0, year: '2020', count: 35 },
        { score: 0.2, year: '2020', count: 40 },
        { score: 0.4, year: '2020', count: 50 },
        { score: 0.6, year: '2020', count: 45 },
        { score: 0.8, year: '2020', count: 35 },
        { score: 1.0, year: '2020', count: 25 },
        
        { score: -1.0, year: '2021', count: 20 },
        { score: -0.8, year: '2021', count: 30 },
        { score: -0.6, year: '2021', count: 35 },
        { score: -0.4, year: '2021', count: 25 },
        { score: -0.2, year: '2021', count: 15 },
        { score: 0.0, year: '2021', count: 40 },
        { score: 0.2, year: '2021', count: 55 },
        { score: 0.4, year: '2021', count: 65 },
        { score: 0.6, year: '2021', count: 60 },
        { score: 0.8, year: '2021', count: 50 },
        { score: 1.0, year: '2021', count: 40 },
        
        { score: -1.0, year: '2022', count: 25 },
        { score: -0.8, year: '2022', count: 35 },
        { score: -0.6, year: '2022', count: 40 },
        { score: -0.4, year: '2022', count: 30 },
        { score: -0.2, year: '2022', count: 20 },
        { score: 0.0, year: '2022', count: 45 },
        { score: 0.2, year: '2022', count: 70 },
        { score: 0.4, year: '2022', count: 80 },
        { score: 0.6, year: '2022', count: 75 },
        { score: 0.8, year: '2022', count: 65 },
        { score: 1.0, year: '2022', count: 55 },
        
        { score: -1.0, year: '2023', count: 30 },
        { score: -0.8, year: '2023', count: 40 },
        { score: -0.6, year: '2023', count: 45 },
        { score: -0.4, year: '2023', count: 35 },
        { score: -0.2, year: '2023', count: 25 },
        { score: 0.0, year: '2023', count: 50 },
        { score: 0.2, year: '2023', count: 85 },
        { score: 0.4, year: '2023', count: 95 },
        { score: 0.6, year: '2023', count: 90 },
        { score: 0.8, year: '2023', count: 80 },
        { score: 1.0, year: '2023', count: 70 },
        
        { score: -1.0, year: '2024', count: 35 },
        { score: -0.8, year: '2024', count: 45 },
        { score: -0.6, year: '2024', count: 50 },
        { score: -0.4, year: '2024', count: 40 },
        { score: -0.2, year: '2024', count: 30 },
        { score: 0.0, year: '2024', count: 55 },
        { score: 0.2, year: '2024', count: 100 },
        { score: 0.4, year: '2024', count: 110 },
        { score: 0.6, year: '2024', count: 105 },
        { score: 0.8, year: '2024', count: 95 },
        { score: 1.0, year: '2024', count: 85 }
      ]
      
      return NextResponse.json({
        success: true,
        data: mockData,
        message: '使用模拟数据 - analyzed_comments表不存在'
      })
    }

    // 获取评论极坐标数据 - 新格式：分数为环形坐标，年份为堆叠
    const polarQuery = `
      SELECT 
        ROUND(CAST(compound AS NUMERIC), 1) as score,
        EXTRACT(YEAR FROM publishedat) as year,
        COUNT(*) as count
      FROM analyzed_comments 
      WHERE compound IS NOT NULL 
        AND publishedat IS NOT NULL
        AND EXTRACT(YEAR FROM publishedat) >= 2020
      GROUP BY ROUND(CAST(compound AS NUMERIC), 1), EXTRACT(YEAR FROM publishedat)
      ORDER BY score, year
    `
    
    const result = await query(polarQuery)
    
    const polarData = result.rows.map(row => ({
      score: parseFloat(row.score),
      year: row.year.toString(),
      count: parseInt(row.count)
    }))

    return NextResponse.json({
      success: true,
      data: polarData
    })
  } catch (error) {
    console.error('获取评论极坐标数据失败:', error)
    
    // 发生错误时返回适合新格式的模拟数据
    const mockData = [
      { score: -1.0, year: '2020', count: 15 },
      { score: -0.8, year: '2020', count: 25 },
      { score: -0.6, year: '2020', count: 30 },
      { score: -0.4, year: '2020', count: 20 },
      { score: -0.2, year: '2020', count: 10 },
      { score: 0.0, year: '2020', count: 35 },
      { score: 0.2, year: '2020', count: 40 },
      { score: 0.4, year: '2020', count: 50 },
      { score: 0.6, year: '2020', count: 45 },
      { score: 0.8, year: '2020', count: 35 },
      { score: 1.0, year: '2020', count: 25 },
      
      { score: -1.0, year: '2021', count: 20 },
      { score: -0.8, year: '2021', count: 30 },
      { score: -0.6, year: '2021', count: 35 },
      { score: -0.4, year: '2021', count: 25 },
      { score: -0.2, year: '2021', count: 15 },
      { score: 0.0, year: '2021', count: 40 },
      { score: 0.2, year: '2021', count: 55 },
      { score: 0.4, year: '2021', count: 65 },
      { score: 0.6, year: '2021', count: 60 },
      { score: 0.8, year: '2021', count: 50 },
      { score: 1.0, year: '2021', count: 40 },
      
      { score: -1.0, year: '2022', count: 25 },
      { score: -0.8, year: '2022', count: 35 },
      { score: -0.6, year: '2022', count: 40 },
      { score: -0.4, year: '2022', count: 30 },
      { score: -0.2, year: '2022', count: 20 },
      { score: 0.0, year: '2022', count: 45 },
      { score: 0.2, year: '2022', count: 70 },
      { score: 0.4, year: '2022', count: 80 },
      { score: 0.6, year: '2022', count: 75 },
      { score: 0.8, year: '2022', count: 65 },
      { score: 1.0, year: '2022', count: 55 },
      
      { score: -1.0, year: '2023', count: 30 },
      { score: -0.8, year: '2023', count: 40 },
      { score: -0.6, year: '2023', count: 45 },
      { score: -0.4, year: '2023', count: 35 },
      { score: -0.2, year: '2023', count: 25 },
      { score: 0.0, year: '2023', count: 50 },
      { score: 0.2, year: '2023', count: 85 },
      { score: 0.4, year: '2023', count: 95 },
      { score: 0.6, year: '2023', count: 90 },
      { score: 0.8, year: '2023', count: 80 },
      { score: 1.0, year: '2023', count: 70 },
      
      { score: -1.0, year: '2024', count: 35 },
      { score: -0.8, year: '2024', count: 45 },
      { score: -0.6, year: '2024', count: 50 },
      { score: -0.4, year: '2024', count: 40 },
      { score: -0.2, year: '2024', count: 30 },
      { score: 0.0, year: '2024', count: 55 },
      { score: 0.2, year: '2024', count: 100 },
      { score: 0.4, year: '2024', count: 110 },
      { score: 0.6, year: '2024', count: 105 },
      { score: 0.8, year: '2024', count: 95 },
      { score: 1.0, year: '2024', count: 85 }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockData,
      message: '使用模拟数据 - 数据库连接失败'
    })
  }
}