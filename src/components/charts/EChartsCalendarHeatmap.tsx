/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\EChartsCalendarHeatmap.tsx
 */
"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'
import { Calendar, RefreshCw, Activity, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'

interface HeatmapData {
  date: string
  count: number
}

interface EchartsCalendarHeatmapProps {
  className?: string
}

const EchartsCalendarHeatmap: React.FC<EchartsCalendarHeatmapProps> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [data, setData] = useState<HeatmapData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // 生成模拟数据
  const generateMockData = useCallback((year: number): HeatmapData[] => {
    const data: HeatmapData[] = []
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      const count = Math.floor(Math.random() * 20) // 0-19 的随机数
      data.push({ date: dateStr, count })
    }
    
    return data
  }, [])

  // 获取数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockData = generateMockData(selectedYear)
      setData(mockData)
    } catch (err) {
      setError('获取数据失败')
      console.error('Error fetching heatmap data:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedYear, generateMockData])

  // 初始化图表
  const initChart = useCallback(() => {
    if (!chartRef.current || !data.length) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    // 转换数据格式为 ECharts 需要的格式
    const chartData = data.map(item => [item.date, item.count])
    
    // 计算最大值用于颜色映射
    const maxValue = Math.max(...data.map(item => item.count))

    const option: echarts.EChartsOption = {
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const date = params.data[0]
          const count = params.data[1]
          return `${date}<br/>发布数量: ${count}`
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      },
      visualMap: {
        min: 0,
        max: maxValue,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 30,
        pieces: [
          { min: 0, max: 0, color: '#ebedf0', label: '无' },
          { min: 1, max: 3, color: '#c6e48b', label: '少' },
          { min: 4, max: 6, color: '#7bc96f', label: '中' },
          { min: 7, max: 9, color: '#239a3b', label: '多' },
          { min: 10, color: '#196127', label: '很多' }
        ],
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        itemWidth: 15,
        itemHeight: 15,
        itemGap: 8
      },
      calendar: {
        top: 80,
        left: 40,
        right: 40,
        bottom: 20,
        cellSize: ['auto', 16],
        range: selectedYear.toString(),
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 4
        },
        yearLabel: { 
          show: false 
        },
        dayLabel: {
          firstDay: 1,
          nameMap: ['日', '一', '二', '三', '四', '五', '六'],
          color: '#666',
          fontSize: 12
        },
        monthLabel: {
          nameMap: [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
          ],
          color: '#666',
          fontSize: 12
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f0f0f0',
            width: 1,
            type: 'solid'
          }
        }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: chartData
      }
    }

    chart.setOption(option)

    // 响应式处理
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data, selectedYear])

  // 组件挂载时获取数据
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 数据变化时重新初始化图表
  useEffect(() => {
    if (!loading && !error) {
      initChart()
    }
  }, [data, loading, error, initChart])

  // 组件卸载时清理图表
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
    }
  }, [])

  // 计算统计数据
  const calculateStats = useCallback(() => {
    if (!data.length) return null

    const totalCount = data.reduce((sum, item) => sum + item.count, 0)
    const activeDays = data.filter(item => item.count > 0).length
    const dailyAverage = totalCount / 365
    const monthlyAverage = totalCount / 12

    // 按月统计
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const monthData = data.filter(item => {
        const date = new Date(item.date)
        return date.getMonth() + 1 === month
      })
      return {
        month,
        count: monthData.reduce((sum, item) => sum + item.count, 0)
      }
    })

    const peakMonth = monthlyData.reduce((max, current) => 
      current.count > max.count ? current : max
    )
    const lowestMonth = monthlyData.reduce((min, current) => 
      current.count < min.count ? current : min
    )

    // 按日统计
    const peakDay = data.reduce((max, current) => 
      current.count > max.count ? current : max
    )
    const lowestDay = data.filter(item => item.count > 0).reduce((min, current) => 
      current.count < min.count ? current : min
    )

    return {
      activeDays,
      dailyAverage,
      monthlyAverage,
      peakMonth,
      lowestMonth,
      peakDay,
      lowestDay
    }
  }, [data])

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year))
  }

  const handleRefresh = () => {
    fetchData()
  }

  // 计算统计数据
  const stats = calculateStats()

  // 生成年份选项
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: `${currentYear - i}年`
  }))

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
              重新加载
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} shadow-sm border border-gray-200 overflow-hidden`}>
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl font-semibold">视频发布日历热力图</span>
          </div>
          <div className="flex items-center space-x-3">
            <CustomSelect
              value={selectedYear.toString()}
              onValueChange={handleYearChange}
              options={yearOptions}
              className="w-32"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4 mx-auto"></div>
              <p className="text-gray-500">正在加载日历数据...</p>
            </div>
          </div>
        ) : (
          <div>
            {/* 统计信息面板 - 移到上方 */}
            {stats && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {/* 活跃天数 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">活跃天数</span>
                      <Calendar className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-xl font-bold text-green-700">{stats.activeDays}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(stats.activeDays / 365) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 日均发布 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">日均发布</span>
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-xl font-bold text-blue-700">{stats.dailyAverage.toFixed(1)}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((stats.dailyAverage / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 月均发布 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">月均发布</span>
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-xl font-bold text-purple-700">{stats.monthlyAverage.toFixed(0)}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((stats.monthlyAverage / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 峰值月 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">峰值月</span>
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="text-xl font-bold text-orange-700">{stats.peakMonth.month}月</div>
                    <div className="text-xs text-gray-500">{stats.peakMonth.count} 次发布</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* 峰值日 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">峰值日</span>
                      <Activity className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-lg font-bold text-red-700">{stats.peakDay.count}</div>
                    <div className="text-xs text-gray-500">{new Date(stats.peakDay.date).toLocaleDateString()}</div>
                  </div>

                  {/* 最低月 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">最低月</span>
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-700">{stats.lowestMonth.month}月</div>
                    <div className="text-xs text-gray-500">{stats.lowestMonth.count} 次发布</div>
                  </div>

                  {/* 最低日 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">最低日</span>
                      <Activity className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-700">{stats.lowestDay.count}</div>
                    <div className="text-xs text-gray-500">{new Date(stats.lowestDay.date).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 图表区域 */}
            <div ref={chartRef} className="w-full h-80" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { EchartsCalendarHeatmap as EChartsCalendarHeatmap }