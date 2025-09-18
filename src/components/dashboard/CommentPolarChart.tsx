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
        
        // 使用与评论数据页面相同的数据源，读取所有数据
        const response = await commentService.getCommentData({
          limit: 10000, // 增加限制以获取更多数据
          sortBy: 'publishedat',
          sortOrder: 'desc'
        })
        
        console.log('评论数据响应:', response) // 添加调试日志
        
        // 处理数据，按情感分数和年份进行分组统计
        const processedData: PolarData[] = []
        const scoreRanges = [
          { min: -1.0, max: -0.8, label: -1.0 },
          { min: -0.8, max: -0.6, label: -0.8 },
          { min: -0.6, max: -0.4, label: -0.6 },
          { min: -0.4, max: -0.2, label: -0.4 },
          { min: -0.2, max: 0.0, label: -0.2 },
          { min: 0.0, max: 0.2, label: 0.0 },
          { min: 0.2, max: 0.4, label: 0.2 },
          { min: 0.4, max: 0.6, label: 0.4 },
          { min: 0.6, max: 0.8, label: 0.6 },
          { min: 0.8, max: 1.0, label: 0.8 },
          { min: 1.0, max: 1.0, label: 1.0 }
        ]
        
        // 统计每个分数范围和年份的评论数量
        const stats: { [key: string]: { [year: string]: number } } = {}
        
        response.data.forEach(comment => {
          if (comment.compound && comment.publishedat) {
            const compoundScore = parseFloat(comment.compound)
            const publishDate = new Date(comment.publishedat)
            const year = publishDate.getFullYear().toString()
            
            // 找到对应的分数范围
            const scoreRange = scoreRanges.find(range => 
              compoundScore >= range.min && compoundScore <= range.max
            )
            
            if (scoreRange) {
              const scoreKey = scoreRange.label.toString()
              if (!stats[scoreKey]) {
                stats[scoreKey] = {}
              }
              if (!stats[scoreKey][year]) {
                stats[scoreKey][year] = 0
              }
              stats[scoreKey][year]++
            }
          }
        })
        
        // 转换为图表数据格式
        Object.keys(stats).forEach(scoreKey => {
          Object.keys(stats[scoreKey]).forEach(year => {
            processedData.push({
              score: parseFloat(scoreKey),
              year: year,
              count: stats[scoreKey][year]
            })
          })
        })
        
        console.log('处理后的极坐标数据:', processedData) // 添加调试日志
        setData(processedData)
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
          },
          // 使用不规则刻度，更好地展示数据分布
          interval: 'auto',
          splitNumber: 6,
          min: 0,
          max: function(value: any) {
            // 动态计算最大值，并添加一些余量
            const maxValue = Math.max(...data.map(item => item.count))
            if (maxValue <= 50) return 50
            if (maxValue <= 100) return 100
            if (maxValue <= 200) return 200
            if (maxValue <= 500) return 500
            return Math.ceil(maxValue / 100) * 100
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#d1d5db'
            }
          },
          axisTick: {
            show: true,
            length: 3,
            lineStyle: {
              color: '#d1d5db'
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
      title="近期评论数据"
        description="情感分数分布"
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
      title="近期评论数据"
        description="情感分数分布"
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