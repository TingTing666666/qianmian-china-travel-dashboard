/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-15 16:32:52
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\HeatmapChart.tsx
 */
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Calendar, TrendingUp, Activity, RefreshCw, Flame, BarChart3, Clock, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface HeatmapData {
  date: string
  count: number
  level: number // 0-4 热力等级
}

interface HeatmapChartProps {
  className?: string
}

interface CycleAnalysis {
  weekdayPattern: { [key: number]: number }
  monthlyPattern: { [key: number]: number }
  seasonalTrend: string
  peakDays: string[]
}

export function HeatmapChart({ className }: HeatmapChartProps) {
  const [data, setData] = useState<HeatmapData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showCycleAnalysis, setShowCycleAnalysis] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // 获取热力图数据
  const fetchHeatmapData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/videos/heatmap?year=${selectedYear}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || '获取热力图数据失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取热力图数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedYear])

  // 初始化数据
  useEffect(() => {
    fetchHeatmapData()
  }, [fetchHeatmapData])

  // 生成完整年份的日期网格
  const yearGrid = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)
    const weeks: Date[][] = []
    
    // 找到第一周的开始日期（周日）
    const firstSunday = new Date(startDate)
    firstSunday.setDate(startDate.getDate() - startDate.getDay())
    
    let currentDate = new Date(firstSunday)
    
    while (currentDate <= endDate || weeks[weeks.length - 1]?.length < 7) {
      const week: Date[] = []
      
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      weeks.push(week)
      
      // 如果已经超过年底且当前周都是下一年的日期，则停止
      if (currentDate.getFullYear() > selectedYear && 
          week.every(date => date.getFullYear() > selectedYear)) {
        break
      }
    }
    
    return weeks
  }, [selectedYear])

  // 获取日期对应的数据
  const getDateData = useCallback((date: Date): HeatmapData => {
    const dateStr = date.toISOString().split('T')[0]
    return data.find(item => item.date === dateStr) || { date: dateStr, count: 0, level: 0 }
  }, [data])

  // 获取热力等级对应的颜色
  const getLevelColor = useCallback((level: number, isCurrentYear: boolean): string => {
    if (!isCurrentYear) return '#f3f4f6' // 灰色表示非当前年份
    
    const colors = [
      '#f3f4f6', // level 0 - 无数据
      '#c6e48b', // level 1 - 低活跃度
      '#7bc96f', // level 2 - 中等活跃度
      '#239a3b', // level 3 - 高活跃度
      '#196127'  // level 4 - 极高活跃度
    ]
    return colors[Math.min(level, 4)]
  }, [])

  // 周期分析
  const cycleAnalysis = useMemo((): CycleAnalysis => {
    const weekdayPattern: { [key: number]: number } = {}
    const monthlyPattern: { [key: number]: number } = {}
    
    // 初始化
    for (let i = 0; i < 7; i++) weekdayPattern[i] = 0
    for (let i = 1; i <= 12; i++) monthlyPattern[i] = 0
    
    data.forEach(item => {
      const date = new Date(item.date)
      const weekday = date.getDay()
      const month = date.getMonth() + 1
      
      weekdayPattern[weekday] += item.count
      monthlyPattern[month] += item.count
    })
    
    // 找出峰值日期
    const sortedData = [...data].sort((a, b) => b.count - a.count)
    const peakDays = sortedData.slice(0, 5).map(item => item.date)
    
    // 季节性趋势分析
    const seasons = {
      spring: monthlyPattern[3] + monthlyPattern[4] + monthlyPattern[5],
      summer: monthlyPattern[6] + monthlyPattern[7] + monthlyPattern[8],
      autumn: monthlyPattern[9] + monthlyPattern[10] + monthlyPattern[11],
      winter: monthlyPattern[12] + monthlyPattern[1] + monthlyPattern[2]
    }
    
    const maxSeason = Object.entries(seasons).reduce((max, [season, count]) => 
      count > max.count ? { season, count } : max, { season: 'spring', count: 0 }
    )
    
    const seasonNames = {
      spring: '春季',
      summer: '夏季', 
      autumn: '秋季',
      winter: '冬季'
    }
    
    return {
      weekdayPattern,
      monthlyPattern,
      seasonalTrend: seasonNames[maxSeason.season as keyof typeof seasonNames],
      peakDays
    }
  }, [data])

  // 统计数据
  const stats = useMemo(() => {
    const totalDays = data.filter(item => item.count > 0).length
    const totalVideos = data.reduce((sum, item) => sum + item.count, 0)
    const maxDay = data.reduce((max, item) => item.count > max.count ? item : max, { count: 0, date: '' })
    const avgPerActiveDay = totalDays > 0 ? Math.round(totalVideos / totalDays) : 0
    
    return { totalDays, totalVideos, maxDay, avgPerActiveDay }
  }, [data])

  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

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
      {/* 主热力图卡片 */}
      <Card className="shadow-sm border border-gray-200 mb-6">
        <CardHeader className="bg-white border-b border-gray-200 rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-2">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              视频发布热力图 - {selectedYear}年
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={showCycleAnalysis ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowCycleAnalysis(!showCycleAnalysis)}
                className={showCycleAnalysis ? "bg-green-600 text-white hover:bg-green-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
              >
                <Clock className="w-4 h-4 mr-1" />
                {showCycleAnalysis ? '隐藏分析' : '周期分析'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* 控制面板 */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">年份：</span>
              <Select
                value={selectedYear.toString()}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(parseInt(e.target.value))}
                className="w-32 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </Select>
            </div>
            <Button 
              onClick={fetchHeatmapData} 
              className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-md"
              disabled={loading}
            >
              <Activity className="w-4 h-4 mr-2" />
              {loading ? '加载中...' : '刷新数据'}
            </Button>
          </div>

          {/* 热力图 */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4 mx-auto"></div>
                <p className="text-gray-500">正在加载热力图数据...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              {/* 月份标签 */}
              <div className="flex mb-2">
                <div className="w-8"></div>
                <div className="flex-1 flex justify-between text-xs text-gray-500 px-1">
                  {months.map((month, index) => (
                    <span key={index} className="text-center">{month}</span>
                  ))}
                </div>
              </div>
              
              {/* 热力图网格 */}
              <div className="flex">
                {/* 星期标签 */}
                <div className="flex flex-col justify-between w-8 text-xs text-gray-500 pr-2">
                  {weekdays.map((day, index) => (
                    <div key={index} className="h-3 flex items-center">
                      {index % 2 === 1 && <span>{day}</span>}
                    </div>
                  ))}
                </div>
                
                {/* 日期网格 */}
                <div className="flex-1 overflow-x-auto">
                  <div className="flex space-x-1" style={{ minWidth: '800px' }}>
                    {yearGrid.map((week: Date[], weekIndex: number) => (
                      <div key={weekIndex} className="flex flex-col space-y-1">
                        {week.map((date: Date, dayIndex: number) => {
                          const dateData = getDateData(date)
                          const isCurrentYear = date.getFullYear() === selectedYear
                          const isToday = date.toDateString() === new Date().toDateString()
                          
                          return (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${
                                isToday ? 'ring-2 ring-blue-500' : ''
                              } ${hoveredDate === dateData.date ? 'ring-2 ring-gray-400' : ''}`}
                              style={{ 
                                backgroundColor: getLevelColor(dateData.level, isCurrentYear),
                                opacity: isCurrentYear ? 1 : 0.3
                              }}
                              onMouseEnter={() => setHoveredDate(dateData.date)}
                              onMouseLeave={() => setHoveredDate(null)}
                              title={`${dateData.date}: ${dateData.count} 个视频`}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 图例 */}
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>较少</span>
                <div className="flex items-center space-x-1">
                  {[0, 1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getLevelColor(level, true) }}
                    />
                  ))}
                </div>
                <span>较多</span>
              </div>
              
              {/* 悬浮信息 */}
              {hoveredDate && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>{hoveredDate}</strong>: {getDateData(new Date(hoveredDate)).count} 个视频
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 周期分析 */}
      {showCycleAnalysis && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              周期性分析
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 星期模式 */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">星期发布模式</h4>
                <div className="space-y-2">
                  {weekdays.map((day, index) => {
                    const count = cycleAnalysis.weekdayPattern[index] || 0
                    const maxCount = Math.max(...Object.values(cycleAnalysis.weekdayPattern).map(v => Number(v)))
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                    
                    return (
                      <div key={index} className="flex items-center">
                        <span className="w-8 text-sm text-gray-600">周{day}</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-sm text-gray-900 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* 月份模式 */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">月份发布模式</h4>
                <div className="space-y-2">
                  {months.map((month, index) => {
                    const count = cycleAnalysis.monthlyPattern[index + 1] || 0
                    const maxCount = Math.max(...Object.values(cycleAnalysis.monthlyPattern).map(v => Number(v)))
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                    
                    return (
                      <div key={index} className="flex items-center">
                        <span className="w-8 text-sm text-gray-600">{month}</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-sm text-gray-900 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* 分析结论 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">分析结论</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-600">季节性趋势：</span>
                  <span className="text-gray-700">{cycleAnalysis.seasonalTrend}活跃度最高</span>
                </div>
                <div>
                  <span className="font-medium text-purple-600">峰值日期：</span>
                  <span className="text-gray-700">{cycleAnalysis.peakDays.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}