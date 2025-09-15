/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\TrendAnalysisChart.tsx
 */
"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { Calendar, TrendingUp, BarChart3, Activity, Zap, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import '@/styles/slider.css'

interface TrendData {
  period: string
  count: number
  date: string
}

interface TrendAnalysisChartProps {
  className?: string
}

type TimeUnit = 'day' | 'week' | 'month' | 'year'

export function TrendAnalysisChart({ className }: TrendAnalysisChartProps) {
  const [data, setData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('month')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [showPrediction, setShowPrediction] = useState(false)
  const [predictionModel, setPredictionModel] = useState<'linear' | 'polynomial' | 'exponential'>('linear')
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 100])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)

  // 获取趋势数据
  const fetchTrendData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        timeUnit,
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end })
      })

      const response = await fetch(`/api/videos/trend?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || '获取趋势数据失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取趋势数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [timeUnit, dateRange])

  // 初始化数据
  useEffect(() => {
    fetchTrendData()
  }, [fetchTrendData])

  // 格式化X轴标签
  const formatXAxisLabel = useCallback((value: string, index: number) => {
    if (!value) return ''
    
    const totalItems = data.length
    let skipInterval = 1
    
    // 根据数据量和时间单位调整显示间隔
    if (timeUnit === 'day') {
      if (totalItems > 30) skipInterval = Math.ceil(totalItems / 15)
      else if (totalItems > 14) skipInterval = 2
    } else if (timeUnit === 'week') {
      if (totalItems > 26) skipInterval = Math.ceil(totalItems / 13)
      else if (totalItems > 12) skipInterval = 2
    } else if (timeUnit === 'month') {
      if (totalItems > 24) skipInterval = Math.ceil(totalItems / 12)
      else if (totalItems > 12) skipInterval = 2
    }
    
    if (index % skipInterval !== 0) return ''
    
    // 根据时间单位格式化显示
    try {
      const date = new Date(value)
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return value // 如果日期无效，返回原始值
      }
      
      switch (timeUnit) {
        case 'day':
          return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
        case 'week':
          // 计算年份中的第几周
          const startOfYear = new Date(date.getFullYear(), 0, 1)
          const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1
          const weekNumber = Math.ceil(dayOfYear / 7)
          return `第${weekNumber}周`
        case 'month':
          return date.toLocaleDateString('zh-CN', { year: '2-digit', month: 'short' })
        case 'year':
          return date.getFullYear().toString()
        default:
          return value
      }
    } catch {
      return value
    }
  }, [data.length, timeUnit])

  // 生成趋势预测数据
  const predictionData = useMemo(() => {
    if (!showPrediction || data.length < 3) return []
    
    const recentData = data.slice(-6) // 取最近6个数据点
    const n = recentData.length
    
    let predictions = []
    
    // 根据选择的模型生成预测
    switch (predictionModel) {
      case 'linear': {
        // 线性回归预测
        const sumX = recentData.reduce((sum, _, i) => sum + i, 0)
        const sumY = recentData.reduce((sum, item) => sum + item.count, 0)
        const sumXY = recentData.reduce((sum, item, i) => sum + i * item.count, 0)
        const sumXX = recentData.reduce((sum, _, i) => sum + i * i, 0)
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
        const intercept = (sumY - slope * sumX) / n
        
        for (let i = 1; i <= 3; i++) {
          const predictedCount = Math.max(0, Math.round(slope * (n + i - 1) + intercept))
          predictions.push(predictedCount)
        }
        break
      }
      
      case 'polynomial': {
        // 二次多项式拟合
        const avgGrowth = recentData.slice(1).reduce((sum, item, i) => {
          return sum + (item.count - recentData[i].count)
        }, 0) / (n - 1)
        
        const lastCount = recentData[n - 1].count
        for (let i = 1; i <= 3; i++) {
          const acceleration = avgGrowth * 0.1 * i // 加速度因子
          const predictedCount = Math.max(0, Math.round(lastCount + avgGrowth * i + acceleration))
          predictions.push(predictedCount)
        }
        break
      }
      
      case 'exponential': {
        // 指数增长模型
        const growthRates = recentData.slice(1).map((item, i) => {
          const prevCount = recentData[i].count
          return prevCount > 0 ? item.count / prevCount : 1
        })
        const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
        
        let lastCount = recentData[n - 1].count
        for (let i = 1; i <= 3; i++) {
          lastCount = Math.max(0, Math.round(lastCount * avgGrowthRate))
          predictions.push(lastCount)
        }
        break
      }
    }
    
    // 生成预测数据点
    return predictions.map((predictedCount, i) => {
      const lastDate = new Date(data[data.length - 1].date)
      
      let nextDate: Date
      switch (timeUnit) {
        case 'day':
          nextDate = new Date(lastDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000)
          break
        case 'week':
          nextDate = new Date(lastDate.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          nextDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + (i + 1), 1)
          break
        case 'year':
          nextDate = new Date(lastDate.getFullYear() + (i + 1), 0, 1)
          break
        default:
          nextDate = lastDate
      }
      
      return {
        period: nextDate.toISOString().split('T')[0],
        count: predictedCount,
        date: nextDate.toISOString().split('T')[0],
        isPrediction: true
      }
    })
  }, [data, showPrediction, timeUnit, predictionModel])

  // 合并实际数据和预测数据
  const chartData = useMemo(() => {
    return [...data, ...predictionData]
  }, [data, predictionData])

  // 根据缩放范围过滤数据
  const filteredChartData = useMemo(() => {
    const startIndex = Math.floor((zoomRange[0] / 100) * chartData.length)
    const endIndex = Math.ceil((zoomRange[1] / 100) * chartData.length)
    return chartData.slice(startIndex, endIndex)
  }, [chartData, zoomRange])

  // 优化性能：防抖处理缩放操作
  const debouncedZoomRange = useMemo(() => {
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout
      return (...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(null, args), wait)
      }
    }
    return debounce(setZoomRange, 100)
  }, [])

  // 处理图表缩放
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const zoomFactor = 0.1
    const currentRange = zoomRange[1] - zoomRange[0]
    
    if (direction === 'in' && currentRange > 10) {
      const center = (zoomRange[0] + zoomRange[1]) / 2
      const newRange = currentRange * (1 - zoomFactor)
      const newStart = Math.max(0, center - newRange / 2)
      const newEnd = Math.min(100, center + newRange / 2)
      setZoomRange([newStart, newEnd])
    } else if (direction === 'out' && currentRange < 100) {
      const center = (zoomRange[0] + zoomRange[1]) / 2
      const newRange = Math.min(100, currentRange * (1 + zoomFactor))
      const newStart = Math.max(0, center - newRange / 2)
      const newEnd = Math.min(100, center + newRange / 2)
      setZoomRange([newStart, newEnd])
    }
  }, [zoomRange])

  // 处理图表平移
  const handlePan = useCallback((direction: 'left' | 'right') => {
    const panFactor = 0.1
    const currentRange = zoomRange[1] - zoomRange[0]
    const panAmount = currentRange * panFactor
    
    if (direction === 'left' && zoomRange[0] > 0) {
      const newStart = Math.max(0, zoomRange[0] - panAmount)
      const newEnd = newStart + currentRange
      setZoomRange([newStart, newEnd])
    } else if (direction === 'right' && zoomRange[1] < 100) {
      const newEnd = Math.min(100, zoomRange[1] + panAmount)
      const newStart = newEnd - currentRange
      setZoomRange([newStart, newEnd])
    }
  }, [zoomRange])

  // 重置缩放
  const handleResetZoom = useCallback(() => {
    setZoomRange([0, 100])
  }, [])

  const timeUnitOptions = [
    { value: 'day', label: '按天' },
    { value: 'week', label: '按周' },
    { value: 'month', label: '按月' },
    { value: 'year', label: '按年' }
  ]

  const totalVideos = data.reduce((sum, item) => sum + item.count, 0)
  const avgPerPeriod = data.length > 0 ? Math.round(totalVideos / data.length) : 0
  const maxPeriod = data.reduce((max, item) => item.count > max.count ? item : max, { count: 0, period: '', date: '' })

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
            <Button onClick={fetchTrendData} className="bg-blue-600 hover:bg-blue-700">
              重新加载
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* 主图表卡片 */}
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-semibold">视频发布趋势分析</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={showPrediction ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowPrediction(!showPrediction)}
                className={showPrediction ? "bg-blue-600 text-white hover:bg-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                {showPrediction ? '隐藏预测' : '显示预测'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* 控制面板 */}
          <div className="mb-8 flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">时间单位：</span>
                  <Select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                    className="w-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  >
                    {timeUnitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* 时间范围选择 */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">时间范围：</span>
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onDateRangeChange={(start, end) => setDateRange({ start, end })}
                    className="w-64"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 预测模型选择 */}
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">预测模型：</span>
                  <Select
                    value={predictionModel}
                    onChange={(e) => setPredictionModel(e.target.value as 'linear' | 'polynomial' | 'exponential')}
                    className="w-32 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm"
                  >
                    <option value="linear">线性回归</option>
                    <option value="polynomial">多项式</option>
                    <option value="exponential">指数增长</option>
                  </Select>
                </div>
                
                {/* 刷新数据按钮 */}
                <Button 
                  onClick={fetchTrendData} 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-md"
                  disabled={loading}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {loading ? '加载中...' : '刷新数据'}
                </Button>
              </div>
            </div>
            
            {/* 图表控制按钮组 */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700 mr-2">图表控制：</span>
              <div className="flex items-center space-x-1">
                <Button
                  onClick={() => handleZoom('in')}
                  size="sm"
                  variant="outline"
                  className="p-2"
                  title="放大"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleZoom('out')}
                  size="sm"
                  variant="outline"
                  className="p-2"
                  title="缩小"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleResetZoom}
                  size="sm"
                  variant="outline"
                  className="p-2"
                  title="重置缩放"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  onClick={() => handlePan('left')}
                  size="sm"
                  variant="outline"
                  className="p-2"
                  title="向左平移"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handlePan('right')}
                  size="sm"
                  variant="outline"
                  className="p-2"
                  title="向右平移"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="h-96 relative">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4 mx-auto"></div>
                  <p className="text-gray-500">正在加载趋势数据...</p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">暂无趋势数据</p>
                  <p className="text-gray-400 text-sm">请检查数据源或调整时间范围</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={filteredChartData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="period"
                      tickFormatter={formatXAxisLabel}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} 个视频${props.payload.isPrediction ? ' (预测)' : ''}`,
                        props.payload.isPrediction ? '预测数量' : '实际数量'
                      ]}
                      labelFormatter={(label: string) => {
                        try {
                          const date = new Date(label)
                          return date.toLocaleDateString('zh-CN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        } catch {
                          return label
                        }
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    {/* 柱状图 */}
                    <Bar 
                      dataKey="count" 
                      radius={[6, 6, 0, 0]}
                      className="drop-shadow-sm"
                    >
                      {filteredChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isPrediction ? '#a855f7' : '#3b82f6'}
                          fillOpacity={entry.isPrediction ? 0.8 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 底部滑轨缩放控制 */}
          {chartData.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center">
                    <span>时间范围缩放</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({Math.floor(zoomRange[0] * 100)}% - {Math.floor(zoomRange[1] * 100)}%)
                    </span>
                  </h4>
                  <div className="text-xs text-gray-500">
                    显示 {filteredChartData.length} / {chartData.length} 个数据点
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={zoomRange[0]}
                      onChange={(e) => {
                        const newStart = parseFloat(e.target.value)
                        if (newStart < zoomRange[1]) {
                          setZoomRange([newStart, zoomRange[1]])
                        }
                      }}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={zoomRange[1]}
                      onChange={(e) => {
                        const newEnd = parseFloat(e.target.value)
                        if (newEnd > zoomRange[0]) {
                          setZoomRange([zoomRange[0], newEnd])
                        }
                      }}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>开始</span>
                    <span>结束</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 预测说明 */}
          {showPrediction && predictionData.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 shadow-sm">
              <div className="flex items-center text-sm text-purple-700">
                <div className="p-1.5 bg-purple-100 rounded-lg mr-3">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-semibold">趋势预测：</span>
                <span className="ml-2 text-purple-600">
                  基于{predictionModel === 'linear' ? '线性回归' : predictionModel === 'polynomial' ? '多项式拟合' : '指数增长'}模型，紫色柱状图表示预测值
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}