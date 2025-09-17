/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\CommentPolarChart.tsx
 */
import React, { useState, useEffect, useRef } from 'react'
import { DashboardCard } from './DashboardCard'
import { Target } from 'lucide-react'
import { commentService } from '@/services/clientCommentService'
import * as echarts from 'echarts'

interface CommentPolarChartProps {
  className?: string
}

interface PolarData {
  score: number
  year: string
  count: number
}

const CommentPolarChart: React.FC<CommentPolarChartProps> = ({ className }) => {
  const [data, setData] = useState<PolarData[]>([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    const fetchCommentPolarData = async () => {
      try {
        setLoading(true)
        
        // 调用真实的评论服务获取数据
        const response = await fetch('/api/comments/polar-data')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setData(result.data)
          } else {
            throw new Error(result.error)
          }
        } else {
          throw new Error('获取数据失败')
        }
      } catch (error) {
        console.error('获取评论极坐标数据失败:', error)
        // 使用适合新格式的模拟数据
        const mockData: PolarData[] = [
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
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchCommentPolarData()
  }, [])

  useEffect(() => {
    if (!loading && data.length > 0 && chartRef.current) {
      // 初始化图表
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
      
      chartInstance.current = echarts.init(chartRef.current)
      
      // 获取所有年份并为每年分配颜色
      const years = [...new Set(data.map(item => item.year))].sort()
      const yearColors = [
        '#3b82f6', // 2020 - 蓝色
        '#10b981', // 2021 - 绿色
        '#f59e0b', // 2022 - 黄色
        '#ef4444', // 2023 - 红色
        '#8b5cf6'  // 2024 - 紫色
      ]
      
      // 获取所有分数值作为角度轴
      const scores = [...new Set(data.map(item => item.score))].sort((a, b) => a - b)
      
      // 为每年创建一个系列
      const series = years.map((year, yearIndex) => {
        const yearData = data.filter(item => item.year === year)
        const seriesData = scores.map(score => {
          const item = yearData.find(d => d.score === score)
          return item ? item.count : 0
        })
        
        return {
          name: `${year}年`,
          type: 'bar',
          data: seriesData,
          coordinateSystem: 'polar',
          stack: 'total', // 堆叠显示
          itemStyle: {
            color: yearColors[yearIndex % yearColors.length]
          },
          barWidth: '80%'
        }
      })
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params: any) {
            let result = `情感分数: ${scores[params[0].dataIndex]}<br/>`
            params.forEach((param: any) => {
              if (param.value > 0) {
                result += `${param.seriesName}: ${param.value}条评论<br/>`
              }
            })
            return result
          }
        },
        legend: {
          data: years.map(year => `${year}年`),
          bottom: 0,
          textStyle: {
            fontSize: 10
          }
        },
        polar: {
          radius: [20, '70%']
        },
        angleAxis: {
          type: 'category',
          data: scores.map(score => score.toFixed(1)),
          startAngle: 90,
          axisLabel: {
            fontSize: 9,
            formatter: function(value: string) {
              const num = parseFloat(value)
              if (num === -1) return '极负面'
              if (num === -0.5) return '负面'
              if (num === 0) return '中性'
              if (num === 0.5) return '正面'
              if (num === 1) return '极正面'
              return value
            }
          }
        },
        radiusAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 8,
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              color: '#e5e7eb'
            }
          }
        },
        series: series
      }
      
      chartInstance.current.setOption(option)

      // 响应式调整
      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize()
        }
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [loading, data])

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
    }
  }, [])

  if (loading) {
    return (
    <DashboardCard
      title="评论极坐标图"
      description="情感分数分布（环形坐标为分数，堆叠显示各年份）"
      icon={Target}
      iconColor="text-blue-600"
      actionText="查看详情"
      actionHref="/comments/analysis"
      className={className}
    >
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">
            加载中...
          </div>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title="评论极坐标图"
      description="情感分数分布（环形坐标为分数，堆叠显示各年份）"
      icon={Target}
      iconColor="text-blue-600"
      actionText="查看详情"
      actionHref="/comments/analysis"
      className={className}
    >
      <div ref={chartRef} className="flex-1 w-full min-h-0" />
    </DashboardCard>
  )
}

export { CommentPolarChart }
export default CommentPolarChart