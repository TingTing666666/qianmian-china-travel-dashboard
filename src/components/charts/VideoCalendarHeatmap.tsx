/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\VideoCalendarHeatmap.tsx
 */
"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { Calendar, Activity, RefreshCw } from 'lucide-react'
import { MiniDistributionChart } from './MiniDistributionChart'

interface HeatmapData {
  date: string
  count: number
  level: number
}

interface VideoCalendarHeatmapProps {
  className?: string
}

export function VideoCalendarHeatmap({ className }: VideoCalendarHeatmapProps) {
  const [data, setData] = useState<HeatmapData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStartYear, setSelectedStartYear] = useState<string>('2022') // 改为起始年份
  const [stats, setStats] = useState({
    startYear: 0,
    endYear: 0,
    yearCount: 3,
    totalVideos: 0,
    activeDays: 0,
    maxDailyCount: 0,
    averageDailyCount: 0
  })

  // 计算详细统计信息
  const detailedStats = useMemo(() => {
    if (!data.length) return null

    // 按年份分组数据
    const yearlyData: { [year: number]: HeatmapData[] } = {}
    data.forEach(item => {
      const year = new Date(item.date).getFullYear()
      if (!yearlyData[year]) yearlyData[year] = []
      yearlyData[year].push(item)
    })

    // 计算年度统计
    const yearlyStats = Object.entries(yearlyData).map(([year, yearData]) => {
      const totalCount = yearData.reduce((sum, item) => sum + item.count, 0)
      const activeDays = yearData.filter(item => item.count > 0).length
      const maxDaily = Math.max(...yearData.map(item => item.count))
      return {
        year: parseInt(year),
        totalCount,
        activeDays,
        maxDaily,
        avgDaily: activeDays > 0 ? Math.round((totalCount / activeDays) * 10) / 10 : 0
      }
    })

    // 按月份分组数据
    const monthlyData: { [month: string]: HeatmapData[] } = {}
    data.forEach(item => {
      const date = new Date(item.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!monthlyData[monthKey]) monthlyData[monthKey] = []
      monthlyData[monthKey].push(item)
    })

    // 计算月度统计
    const monthlyStats = Object.entries(monthlyData).map(([month, monthData]) => {
      const totalCount = monthData.reduce((sum, item) => sum + item.count, 0)
      const activeDays = monthData.filter(item => item.count > 0).length
      const maxDaily = Math.max(...monthData.map(item => item.count))
      return {
        month,
        totalCount,
        activeDays,
        maxDaily,
        avgDaily: activeDays > 0 ? Math.round((totalCount / activeDays) * 10) / 10 : 0
      }
    })

    // 找出最高值
    const maxYearData = yearlyStats.reduce((max, current) => 
      current.totalCount > max.totalCount ? current : max, yearlyStats[0] || { year: 0, totalCount: 0 })
    
    const maxMonthData = monthlyStats.reduce((max, current) => 
      current.totalCount > max.totalCount ? current : max, monthlyStats[0] || { month: '', totalCount: 0 })

    const maxDayData = data.reduce((max, current) => 
      current.count > max.count ? current : max, { date: '', count: 0 })

    // 计算平均值
    const yearAvg = yearlyStats.length > 0 ? 
      Math.round((yearlyStats.reduce((sum, item) => sum + item.totalCount, 0) / yearlyStats.length) * 10) / 10 : 0
    
    const monthAvg = monthlyStats.length > 0 ? 
      Math.round((monthlyStats.reduce((sum, item) => sum + item.totalCount, 0) / monthlyStats.length) * 10) / 10 : 0
    
    const dayAvg = stats.averageDailyCount

    // 生成分布数据
    const yearDistribution = yearlyStats.map(item => item.totalCount)
    const monthDistribution = monthlyStats.map(item => item.totalCount)
    const dayDistribution = data.map(item => item.count)

    return {
      yearAvg,
      monthAvg,
      dayAvg,
      maxYear: { year: maxYearData.year, count: maxYearData.totalCount },
      maxMonth: { 
        month: maxMonthData.month ? new Date(maxMonthData.month + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) : '', 
        count: maxMonthData.totalCount 
      },
      maxDay: { 
        date: maxDayData.date ? new Date(maxDayData.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) : '', 
        count: maxDayData.count 
      },
      // 分布数据
      distributions: {
        year: yearDistribution,
        month: monthDistribution,
        day: dayDistribution
      }
    }
  }, [data, stats.averageDailyCount])
  
  // ECharts相关状态
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  // 获取热力图数据
  const fetchHeatmapData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        startYear: selectedStartYear,
        yearCount: '3'
      })

      const response = await fetch(`/api/videos/heatmap?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        setStats(result.meta)
      } else {
        setError(result.error || '获取热力图数据失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取热力图数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedStartYear])

  // 初始化数据
  useEffect(() => {
    fetchHeatmapData()
  }, [fetchHeatmapData])

  // 生成年份选项 - 起始年份选择，最晚年份-3
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    // 最晚可选择的起始年份是当前年份-2（这样三年数据最晚到当前年份）
    const latestStartYear = currentYear - 2
    // 从2020年开始到最晚起始年份
    for (let year = latestStartYear; year >= 2020; year--) {
      years.push({ value: year.toString(), label: `${year}年起` })
    }
    return years
  }, [])

  // 处理热力图数据格式
  const chartData = useMemo(() => {
    if (!data.length) return []
    
    return data.map(item => [
      item.date,
      item.count
    ])
  }, [data])

  // 初始化图表
  const initChart = useCallback(() => {
    if (!chartRef.current || !data.length) return

    // 销毁现有图表实例
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose()
    }

    const chart = echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    // 计算颜色等级
    const maxCount = Math.max(...data.map(d => d.count), 1)
    
    // 计算年份范围
    const startYear = stats.startYear || parseInt(selectedStartYear)
    const endYear = stats.endYear || (parseInt(selectedStartYear) + 2)
    const years = []
    for (let year = startYear; year <= endYear; year++) {
      years.push(year)
    }
    
    // 为每年创建独立的日历配置
    const calendars = years.map((year, index) => ({
      top: 120 + index * 200, // 每年间隔200px
      left: 50,
      right: 50,
      cellSize: ['auto', 13],
      range: year.toString(),
      orient: 'horizontal', // 横向排列
      itemStyle: {
        borderWidth: 1,
        borderColor: '#fff'
      },
      yearLabel: {
        show: true,
        fontSize: 16,
        color: '#374151',
        fontWeight: 'bold',
        position: 'left',
        margin: 20
      },
      monthLabel: {
        nameMap: 'cn',
        fontSize: 11,
        color: '#64748b',
        margin: 10,
        position: 'start'
      },
      dayLabel: {
        nameMap: 'cn',
        fontSize: 10,
        color: '#64748b',
        margin: 8,
        position: 'start'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f3f4f6',
          width: 1,
          type: 'solid'
        }
      }
    }))
    
    const option = {
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: 'transparent',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        textStyle: {
          color: '#374151',
          fontSize: 12
        },
        formatter: function(params: any) {
          const date = new Date(params.data[0])
          const count = params.data[1]
          const dateStr = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${dateStr}</div>
              <div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${count > 0 ? '#3b82f6' : '#e5e7eb'}; border-radius: 2px; margin-right: 8px;"></span>
                <span>${count} 个视频</span>
              </div>
            </div>
          `
        }
      },
      visualMap: {
        min: 0,
        max: 50,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 'top',
        pieces: [
          { min: 0, max: 0, color: '#ebedf0', label: '0' },
          { min: 1, max: 5, color: '#c6e48b', label: '1-5' },
          { min: 6, max: 20, color: '#7bc96f', label: '6-20' },
          { min: 21, max: 50, color: '#239a3b', label: '21-50' },
          { min: 51, max: 999, color: '#196127', label: '50+' }
        ],
        textStyle: {
          color: '#64748b',
          fontSize: 11
        },
        itemGap: 4,
        itemWidth: 12,
        itemHeight: 12
      },
      // 横向布局：为每一年创建一个独立的calendar
      calendar: [
        {
          top: 80,
          left: 30,
          right: 30,
          cellSize: ['auto', 16],
          range: stats.startYear || parseInt(selectedStartYear),
          itemStyle: {
            borderWidth: 1.5,
            borderColor: '#fff'
          },
          yearLabel: {
            show: true,
            fontSize: 14,
            color: '#374151',
            fontWeight: 'bold'
          },
          monthLabel: {
            nameMap: 'cn',
            fontSize: 12,
            color: '#64748b',
            margin: 8
          },
          dayLabel: {
            nameMap: 'cn',
            fontSize: 11,
            color: '#64748b',
            margin: 6
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#e5e7eb',
              width: 1,
              type: 'solid'
            }
          }
        },
        {
          top: 260,
          left: 30,
          right: 30,
          cellSize: ['auto', 16],
          range: (stats.startYear || parseInt(selectedStartYear)) + 1,
          itemStyle: {
            borderWidth: 1.5,
            borderColor: '#fff'
          },
          yearLabel: {
            show: true,
            fontSize: 14,
            color: '#374151',
            fontWeight: 'bold'
          },
          monthLabel: {
            nameMap: 'cn',
            fontSize: 12,
            color: '#64748b',
            margin: 8
          },
          dayLabel: {
            nameMap: 'cn',
            fontSize: 11,
            color: '#64748b',
            margin: 6
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#e5e7eb',
              width: 1,
              type: 'solid'
            }
          }
        },
        {
          top: 440,
          left: 30,
          right: 30,
          cellSize: ['auto', 16],
          range: (stats.startYear || parseInt(selectedStartYear)) + 2,
          itemStyle: {
            borderWidth: 1.5,
            borderColor: '#fff'
          },
          yearLabel: {
            show: true,
            fontSize: 14,
            color: '#374151',
            fontWeight: 'bold'
          },
          monthLabel: {
            nameMap: 'cn',
            fontSize: 12,
            color: '#64748b',
            margin: 8
          },
          dayLabel: {
            nameMap: 'cn',
            fontSize: 11,
            color: '#64748b',
            margin: 6
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#e5e7eb',
              width: 1,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 0,
          data: chartData.filter(item => {
            const year = new Date(item[0]).getFullYear()
            return year === (stats.startYear || parseInt(selectedStartYear))
          }),
          itemStyle: {
            borderRadius: 2
          }
        },
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 1,
          data: chartData.filter(item => {
            const year = new Date(item[0]).getFullYear()
            return year === (stats.startYear || parseInt(selectedStartYear)) + 1
          }),
          itemStyle: {
            borderRadius: 2
          }
        },
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 2,
          data: chartData.filter(item => {
            const year = new Date(item[0]).getFullYear()
            return year === (stats.startYear || parseInt(selectedStartYear)) + 2
          }),
          itemStyle: {
            borderRadius: 2
          }
        }
      ]
    }

    chart.setOption(option)

    // 响应式处理
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [chartData, selectedStartYear, data, stats])

  // 当数据或配置变化时更新图表
  useEffect(() => {
    initChart()
  }, [initChart])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
      }
    }
  }, [])

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchHeatmapData} className="bg-blue-600 hover:bg-blue-700">
              重新加载
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">视频发布日历热力图</span>
                {stats.startYear && stats.endYear && (
                  <span className="text-sm text-gray-600 mt-1">
                    {stats.startYear}年 - {stats.endYear}年 ({stats.yearCount}年数据)
                  </span>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* 控制面板 */}
          <div className="mb-8 flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* 起始年份选择 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">起始年份：</span>
                  <CustomSelect
                    value={selectedStartYear}
                    onValueChange={setSelectedStartYear}
                    options={yearOptions}
                    className="w-36"
                  />
                </div>
                
                {/* 刷新数据按钮 */}
                <Button 
                  onClick={fetchHeatmapData} 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? '加载中...' : '刷新数据'}
                </Button>
              </div>
              
              {/* 统计信息 */}
              {!loading && data.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">总视频：</span>
                    <span className="text-blue-600 font-semibold">{stats.totalVideos}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">活跃天数：</span>
                    <span className="text-green-600 font-semibold">{stats.activeDays}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">日均发布：</span>
                    <span className="text-purple-600 font-semibold">{stats.averageDailyCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 图表区域 */}
          <div className="h-[650px] relative">
            <div 
              ref={chartRef}
              className={`w-full h-full transition-opacity duration-300 ${loading ? 'opacity-30' : 'opacity-100'}`}
              style={{ width: '100%', height: '100%' }}
            />
            {data.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">暂无热力图数据</p>
                  <p className="text-gray-400 text-sm">请检查数据源或选择其他起始年份</p>
                </div>
              </div>
            )}
          </div>

          {/* 简约统计信息显示区 */}
          {!loading && data.length > 0 && detailedStats && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-6 gap-6">
                {/* 年平均 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{detailedStats.yearAvg}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">年平均</div>
                  <div className="text-xs text-gray-400">个/年</div>
                  <div className="mt-2 flex justify-center">
                    <MiniDistributionChart
                      data={detailedStats.distributions.year}
                      currentValue={detailedStats.yearAvg}
                      color="#2563eb"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>
                
                {/* 月平均 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{detailedStats.monthAvg}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">月平均</div>
                  <div className="text-xs text-gray-400">个/月</div>
                  <div className="mt-2 flex justify-center">
                    <MiniDistributionChart
                      data={detailedStats.distributions.month}
                      currentValue={detailedStats.monthAvg}
                      color="#16a34a"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>
                
                {/* 日平均 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{detailedStats.dayAvg}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">日平均</div>
                  <div className="text-xs text-gray-400">个/日</div>
                  <div className="mt-2 flex justify-center">
                    <MiniDistributionChart
                      data={detailedStats.distributions.day}
                      currentValue={detailedStats.dayAvg}
                      color="#9333ea"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>
                
                {/* 最高年 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{detailedStats.maxYear.count}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">最高年</div>
                  <div className="text-xs text-gray-400">{detailedStats.maxYear.year}年</div>
                  <div className="mt-2 flex justify-center">
                    <MiniDistributionChart
                      data={detailedStats.distributions.year}
                      currentValue={detailedStats.maxYear.count}
                      color="#ea580c"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>
                
                {/* 最高月 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">{detailedStats.maxMonth.count}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">最高月</div>
                  <div className="text-xs text-gray-400">{detailedStats.maxMonth.month}</div>
                  <div className="mt-2 flex justify-center">
                    <MiniDistributionChart
                      data={detailedStats.distributions.month}
                      currentValue={detailedStats.maxMonth.count}
                      color="#dc2626"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>
                
                {/* 最高日 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">{detailedStats.maxDay.count}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">最高日</div>
                  <div className="text-xs text-gray-400">{detailedStats.maxDay.date}</div>
                  <div className="mt-2 flex justify-center">
                    <MiniDistributionChart
                      data={detailedStats.distributions.day}
                      currentValue={detailedStats.maxDay.count}
                      color="#4f46e5"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}