/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-19 09:38:29
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\VideoGrowthChart.tsx
 */
import React, { useState, useEffect, useRef } from 'react'
import { DashboardCard } from './DashboardCard'
import { TrendingUp, Calendar } from 'lucide-react'
import * as echarts from 'echarts'

interface VideoGrowthChartProps {
  className?: string
}

interface DailyData {
  date: string
  count: number
}

interface YearlyData {
  year: number
  count: number
}

const VideoGrowthChart: React.FC<VideoGrowthChartProps> = ({ className }) => {
  const [loading, setLoading] = useState(true)
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([])
  
  const dailyChartRef = useRef<HTMLDivElement>(null)
  const yearlyChartRef = useRef<HTMLDivElement>(null)
  const dailyChartInstance = useRef<echarts.ECharts | null>(null)
  const yearlyChartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    const fetchVideoGrowthData = async () => {
      try {
        setLoading(true)
        
        // 获取2025年的日度数据
        const dailyStartDate = '2025-01-01'
        const dailyEndDate = '2025-12-31'
        
        console.log('请求视频趋势数据:', { dailyStartDate, dailyEndDate })
        
        // 调用真实API获取日度数据
        const dailyResponse = await fetch(`/api/videos/trend?timeUnit=day&startDate=${dailyStartDate}&endDate=${dailyEndDate}`)
        
        if (!dailyResponse.ok) {
          throw new Error(`HTTP error! status: ${dailyResponse.status}`)
        }
        
        const dailyResult = await dailyResponse.json()
        console.log('日度视频趋势API响应:', dailyResult)
        
        // 获取年度数据
        const yearlyResponse = await fetch(`/api/videos/trend?timeUnit=year`)
        let yearlyResult = { success: false, data: [] }
        
        if (yearlyResponse.ok) {
          yearlyResult = await yearlyResponse.json()
          console.log('年度视频趋势API响应:', yearlyResult)
        }
        
        // 处理日度数据
        if (dailyResult.success && dailyResult.data && Array.isArray(dailyResult.data) && dailyResult.data.length > 0) {
          const processedDailyData: DailyData[] = dailyResult.data
            .filter((item: any) => item.count > 0)
            .map((item: any) => ({
              date: item.date || item.period,
              count: parseInt(item.count) || 0
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          
          setDailyData(processedDailyData)
        } else {
          // 生成2025年模拟日度数据
          const mockDailyData: DailyData[] = []
          const startDate = new Date('2025-01-01')
          const endDate = new Date('2025-04-07')
          
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (Math.random() > 0.3) {
              mockDailyData.push({
                date: d.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 15) + 1
              })
            }
          }
          setDailyData(mockDailyData)
        }
        
        // 处理年度数据
        if (yearlyResult.success && yearlyResult.data && Array.isArray(yearlyResult.data) && yearlyResult.data.length > 0) {
          const processedYearlyData: YearlyData[] = yearlyResult.data
            .map((item: any) => ({
              year: parseInt(item.year || item.period),
              count: parseInt(item.count) || 0
            }))
            .sort((a, b) => a.year - b.year)
          
          setYearlyData(processedYearlyData)
        } else {
          // 生成模拟年度数据
          const mockYearlyData: YearlyData[] = [
            { year: 2020, count: 45 },
            { year: 2021, count: 78 },
            { year: 2022, count: 156 },
            { year: 2023, count: 234 },
            { year: 2024, count: 312 },
            { year: 2025, count: 89 } // 当前年份部分数据
          ]
          setYearlyData(mockYearlyData)
        }
      } catch (error) {
        console.error('获取视频增长数据失败:', error)
        
        // 错误时使用模拟数据
        const mockDailyData: DailyData[] = []
        const startDate = new Date('2025-01-01')
        const endDate = new Date('2025-04-07')
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          if (Math.random() > 0.3) {
            mockDailyData.push({
              date: d.toISOString().split('T')[0],
              count: Math.floor(Math.random() * 15) + 1
            })
          }
        }
        setDailyData(mockDailyData)
        
        const mockYearlyData: YearlyData[] = [
          { year: 2020, count: 45 },
          { year: 2021, count: 78 },
          { year: 2022, count: 156 },
          { year: 2023, count: 234 },
          { year: 2024, count: 312 },
          { year: 2025, count: 89 }
        ]
        setYearlyData(mockYearlyData)
      } finally {
        setLoading(false)
      }
    }

    fetchVideoGrowthData()
  }, [])

  // 初始化日度图表
  useEffect(() => {
    if (!loading && dailyData.length > 0 && dailyChartRef.current) {
      console.log('初始化日度图表，数据长度:', dailyData.length)
      
      if (dailyChartInstance.current) {
        dailyChartInstance.current.dispose()
      }
      
      dailyChartInstance.current = echarts.init(dailyChartRef.current)
      
      const dailyOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: 'transparent',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textStyle: {
            color: '#374151',
            fontSize: 11
          },
          formatter: function(params: any) {
            const point = params[0]
            const date = new Date(point.axisValue).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric'
            })
            return `
              <div style="padding: 6px;">
                <div style="font-weight: 600; margin-bottom: 2px;">${date}</div>
                <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: ${point.color}; border-radius: 50%; margin-right: 6px;"></span>
                  <span>${point.value[1]} 个视频</span>
                </div>
              </div>
            `
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
            color: '#64748b',
            interval: 'auto', // 自动计算间隔避免重叠
            rotate: 45, // 旋转45度避免标签挤在一起
            formatter: function(value: any) {
              const date = new Date(value)
              return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          splitLine: {
            show: false
          },
          maxInterval: 24 * 3600 * 1000 * 7
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            color: '#64748b',
            formatter: function(value: any) {
              if (value === 0) return '0'
              if (value === 1) return '1'
              if (value === 100) return '100'
              return ''
            }
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f1f5f9',
              type: 'dashed'
            }
          },
          min: 0,
          max: 100,
          interval: 99,
          splitNumber: 3
        },
        series: [
          {
            name: '视频数量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: dailyData.map(item => [item.date, item.count]),
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
            emphasis: {
              focus: 'series',
              lineStyle: {
                width: 3
              }
            }
          }
        ]
      }

      dailyChartInstance.current.setOption(dailyOption)
    }
  }, [loading, dailyData])

  // 初始化年度图表
  useEffect(() => {
    if (!loading && yearlyData.length > 0 && yearlyChartRef.current) {
      console.log('初始化年度图表，数据长度:', yearlyData.length)
      
      if (yearlyChartInstance.current) {
        yearlyChartInstance.current.dispose()
      }
      
      yearlyChartInstance.current = echarts.init(yearlyChartRef.current)
      
      const yearlyOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: 'transparent',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textStyle: {
            color: '#374151',
            fontSize: 11
          },
          formatter: function(params: any) {
            const point = params[0]
            return `
              <div style="padding: 6px;">
                <div style="font-weight: 600; margin-bottom: 2px;">${point.axisValue}年</div>
                <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: ${point.color}; border-radius: 50%; margin-right: 6px;"></span>
                  <span>${point.value} 个视频</span>
                </div>
              </div>
            `
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: yearlyData.map(item => item.year),
          axisLabel: {
            fontSize: 10,
            color: '#64748b'
          },
          axisLine: {
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            color: '#64748b',
            formatter: function(value: any) {
              if (value === 0) return '0'
              const maxValue = Math.max(...yearlyData.map(item => item.count))
              if (value === maxValue) return maxValue.toString()
              return ''
            }
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          min: 0,
          max: function(value: any) {
            return Math.max(...yearlyData.map(item => item.count))
          },
          interval: function(value: any) {
            return Math.max(...yearlyData.map(item => item.count))
          }
        },
        series: [
          {
            name: '年度视频数量',
            type: 'line',
            smooth: true,
            showSymbol: true,
            symbolSize: 6,
            data: yearlyData.map(item => item.count),
            lineStyle: {
              width: 3,
              color: '#10b981'
            },
            itemStyle: {
              color: '#10b981'
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
                    color: 'rgba(16, 185, 129, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(16, 185, 129, 0.05)'
                  }
                ]
              }
            },
            emphasis: {
              focus: 'series',
              lineStyle: {
                width: 4
              }
            }
          }
        ]
      }

      yearlyChartInstance.current.setOption(yearlyOption)
    }
  }, [loading, yearlyData])

  // 响应式调整
  useEffect(() => {
    const handleResize = () => {
      if (dailyChartInstance.current) {
        dailyChartInstance.current.resize()
      }
      if (yearlyChartInstance.current) {
        yearlyChartInstance.current.resize()
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (dailyChartInstance.current) {
        dailyChartInstance.current.dispose()
      }
      if (yearlyChartInstance.current) {
        yearlyChartInstance.current.dispose()
      }
    }
  }, [])

  if (loading) {
    return (
      <DashboardCard
        title="近期视频数据"
        description="2025年日度趋势和历年总览"
        icon={TrendingUp}
        iconColor="text-green-600"
        actionText="查看详情"
        actionHref="/videos/analysis"
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
      title="近期视频数据"
      description="2025年日度趋势和历年总览"
      icon={TrendingUp}
      iconColor="text-green-600"
      actionText="查看详情"
      actionHref="/videos/analysis"
      className={className}
    >
      <div className="flex-1 flex flex-col space-y-4">
        {/* 2025年日度趋势 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-700">2025年日度趋势</h3>
          </div>
          <div ref={dailyChartRef} className="w-full h-40" />
        </div>

        {/* 历年总览 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-700">历年总览</h3>
          </div>
          <div ref={yearlyChartRef} className="w-full h-40" />
        </div>
      </div>
    </DashboardCard>
  )
}

export { VideoGrowthChart }
export default VideoGrowthChart