/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-16 15:31:28
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\TrendAnalysisChart.tsx
 */
"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { Calendar, TrendingUp, BarChart3, Activity, Zap, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { YearlyTrendChart } from './YearlyTrendChart'

interface TrendData {
  period: string
  count: number
  date: string
  isPrediction?: boolean
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
  
  // ECharts相关状态
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

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

  // 初始化和更新ECharts图表
  const initChart = useCallback(() => {
    if (!chartRef.current || !chartData.length) return

    // 销毁现有图表实例
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose()
    }

    // 创建新的图表实例
    const chart = echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    // 准备数据
    const xAxisData = chartData.map(item => item.date)
    const actualData = chartData.filter(item => !item.isPrediction).map(item => [item.date, item.count])
    const predictionData = chartData.filter(item => item.isPrediction).map(item => [item.date, item.count])

    // 配置图表选项
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: 'transparent',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        textStyle: {
          color: '#374151',
          fontSize: 12
        },
        formatter: function(params: any) {
          const point = params[0]
          const isPrediction = point.seriesName === '预测数据'
          const date = new Date(point.axisValue).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${date}</div>
              <div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${point.color}; border-radius: 50%; margin-right: 8px;"></span>
                <span>${point.value[1]} 个视频${isPrediction ? ' (预测)' : ''}</span>
              </div>
            </div>
          `
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 12,
          formatter: function(value: any) {
            const date = new Date(value)
            switch(timeUnit) {
              case 'day':
                return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
              case 'week':
                return `第${Math.ceil(date.getDate() / 7)}周`
              case 'month':
                return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })
              case 'year':
                return date.getFullYear().toString()
              default:
                return value
            }
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f1f5f9',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '实际数据',
          type: 'bar' as const,
          data: actualData,
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#1d4ed8' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#2563eb' },
                  { offset: 1, color: '#1e40af' }
                ]
              }
            }
          }
        },
        ...(showPrediction && predictionData.length > 0 ? [{
          name: '预测数据',
          type: 'bar' as const,
          data: predictionData,
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(168, 85, 247, 0.8)' },
                { offset: 1, color: 'rgba(147, 51, 234, 0.8)' }
              ]
            },
            borderRadius: [4, 4, 0, 0],
            borderColor: '#a855f7',
            borderWidth: 2,
            borderType: 'dashed' as const
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(168, 85, 247, 0.9)' },
                  { offset: 1, color: 'rgba(147, 51, 234, 0.9)' }
                ]
              }
            }
          }
        }] : [])
      ],
      // 启用数据缩放功能
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          filterMode: 'none'
        },
        {
          type: 'slider',
          start: 0,
          end: 100,
          height: 30,
          bottom: 20,
          borderColor: 'transparent',
          fillerColor: 'rgba(59, 130, 246, 0.2)',
          handleStyle: {
            color: '#3b82f6',
            borderColor: '#ffffff',
            borderWidth: 2,
            shadowColor: 'rgba(59, 130, 246, 0.3)',
            shadowBlur: 8
          },
          moveHandleStyle: {
            color: '#a855f7',
            borderColor: '#ffffff',
            borderWidth: 2
          },
          selectedDataBackground: {
            lineStyle: {
              color: '#3b82f6',
              width: 1
            },
            areaStyle: {
              color: 'rgba(59, 130, 246, 0.1)'
            }
          },
          dataBackground: {
            lineStyle: {
              color: '#e5e7eb',
              width: 1
            },
            areaStyle: {
              color: 'rgba(229, 231, 235, 0.3)'
            }
          },
          textStyle: {
            color: '#64748b',
            fontSize: 12
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
  }, [chartData, timeUnit, showPrediction])

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
              <span className="text-xl font-semibold">总时序图</span>
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
                  <CustomSelect
                    value={timeUnit}
                    onValueChange={(value) => setTimeUnit(value as TimeUnit)}
                    options={timeUnitOptions}
                    className="w-32"
                  />
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
                  <CustomSelect
                    value={predictionModel}
                    onValueChange={(value) => setPredictionModel(value as 'linear' | 'polynomial' | 'exponential')}
                    options={[
                      { value: 'linear', label: '线性回归' },
                      { value: 'polynomial', label: '多项式' },
                      { value: 'exponential', label: '指数增长' }
                    ]}
                    className="w-32"
                  />
                </div>
                
                {/* 刷新数据按钮 */}
                <Button 
                  onClick={fetchTrendData} 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                  disabled={loading}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {loading ? '加载中...' : '刷新数据'}
                </Button>
              </div>
            </div>
            
            {/* 图表控制按钮组 - 移除旧的缩放控制 */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700 mr-2">图表说明：</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">实际数据</span>
                </div>
                {showPrediction && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">预测数据</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="h-96 relative">
            <div 
              ref={chartRef}
              className={`w-full h-full transition-opacity duration-300 ${loading ? 'opacity-30' : 'opacity-100'}`}
              style={{ width: '100%', height: '100%' }}
            />
            {data.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">暂无趋势数据</p>
                  <p className="text-gray-400 text-sm">请检查数据源或调整时间范围</p>
                </div>
              </div>
            )}
          </div>

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

      {/* 年度趋势图 */}
      <div className="mt-6">
        <YearlyTrendChart />
      </div>
    </div>
  )
}