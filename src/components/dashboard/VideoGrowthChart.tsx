/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\VideoGrowthChart.tsx
 */
import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp, ExternalLink } from 'lucide-react'
import { videoService } from '@/services/clientVideoService'
import * as echarts from 'echarts'
import Link from 'next/link'

interface VideoGrowthChartProps {
  className?: string
}

interface MonthlyData {
  month: string
  count: number
}

const VideoGrowthChart: React.FC<VideoGrowthChartProps> = ({ className }) => {
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    const fetchVideoGrowthData = async () => {
      try {
        setLoading(true)
        
        // 调用真实API获取视频增长数据
        const response = await fetch('/api/videos/growth')
        const result = await response.json()
        
        if (result.success && result.data) {
          setData(result.data)
        } else {
          // API返回失败时使用模拟数据
          const mockData: MonthlyData[] = []
          const now = new Date()
          for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            mockData.push({
              month: monthStr,
              count: Math.floor(Math.random() * 50) + 10 + i * 2
            })
          }
          setData(mockData)
        }
      } catch (error) {
        console.error('获取视频增长数据失败:', error)
        // 网络错误时使用模拟数据
        const mockData: MonthlyData[] = []
        const now = new Date()
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
          mockData.push({
            month: monthStr,
            count: Math.floor(Math.random() * 50) + 10 + i * 2
          })
        }
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchVideoGrowthData()
  }, [])

  useEffect(() => {
    if (!loading && data.length > 0 && chartRef.current) {
      // 初始化图表
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
      
      chartInstance.current = echarts.init(chartRef.current)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.map(item => item.month),
          axisLabel: {
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10
          }
        },
        series: [
          {
            name: '视频数量',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#3b82f6'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(59, 130, 246, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(59, 130, 246, 0.05)'
                  }
                ]
              }
            },
            data: data.map(item => item.count)
          }
        ]
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
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            视频增长折线图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">
              加载中...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            视频增长折线图
          </CardTitle>
          <Link 
            href="/videos/analysis" 
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>查看详情</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          最近一年的视频发布趋势
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div ref={chartRef} className="h-40 w-full" />
      </CardContent>
    </Card>
  )
}

export { VideoGrowthChart }
export default VideoGrowthChart