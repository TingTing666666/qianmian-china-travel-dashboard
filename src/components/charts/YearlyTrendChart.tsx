"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Calendar, TrendingUp, ChevronRight, ChevronLeft, X, Plus } from 'lucide-react'

interface TrendData {
  period: string
  count: number
  date: string
  isPrediction?: boolean
}

interface YearlyTrendChartProps {
  className?: string
}

export function YearlyTrendChart({ className }: YearlyTrendChartProps) {
  const [data, setData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [unselectedYears, setUnselectedYears] = useState<string[]>([])
  
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  // 获取真实数据
  const fetchTrendData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/videos/trend?timeUnit=day')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        
        // 提取所有可用年份
        const years = [...new Set(result.data.map((item: TrendData) => 
          new Date(item.date).getFullYear().toString()
        ))].sort()
        
        setAvailableYears(years)
        // 默认选择2022-2025年
        const defaultSelected = years.filter(year => 
          parseInt(year) >= 2022 && parseInt(year) <= 2025
        )
        setSelectedYears(defaultSelected)
        setUnselectedYears(years.filter(year => !defaultSelected.includes(year)))
      } else {
        setError(result.error || '获取年度趋势数据失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取年度趋势数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 初始化数据
  useEffect(() => {
    fetchTrendData()
  }, [fetchTrendData])

  // 年份选择处理函数
  const handleYearSelect = (year: string) => {
    setUnselectedYears(prev => prev.filter(y => y !== year))
    setSelectedYears(prev => [...prev, year])
  }

  const handleYearRemove = (year: string) => {
    setSelectedYears(prev => prev.filter(y => y !== year))
    setUnselectedYears(prev => [...prev, year].sort())
  }

  const handleShowAll = () => {
    setSelectedYears([...availableYears])
    setUnselectedYears([])
  }

  const handleReset = () => {
    const defaultSelected = availableYears.filter(year => 
      parseInt(year) >= 2022 && parseInt(year) <= 2025
    )
    setSelectedYears(defaultSelected)
    setUnselectedYears(availableYears.filter(year => !defaultSelected.includes(year)))
  }

  // 配置图表
  const configureChart = useCallback(() => {
    if (!chartInstanceRef.current || data.length === 0 || selectedYears.length === 0) return

    // 按年份分组数据，只显示选中的年份
    const yearGroups = data.reduce((acc, item) => {
      const year = new Date(item.date).getFullYear().toString()
      if (!selectedYears.includes(year)) return acc
      
      if (!acc[year]) {
        acc[year] = []
      }
      // 计算该日期是一年中的第几天
      const date = new Date(item.date)
      const startOfYear = new Date(date.getFullYear(), 0, 1)
      const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
      
      acc[year].push([dayOfYear, item.count])
      return acc
    }, {} as Record<string, [number, number][]>)

    // 生成系列数据
    const series = Object.entries(yearGroups).map(([year, yearData], index) => ({
      name: `${year}年`,
      type: 'line',
      data: yearData,
      smooth: true,
      showSymbol: false, // 取消折线上的点
      lineStyle: {
        width: 1.5, // 折线变细
      },
      itemStyle: {
        color: [
          '#3b82f6', // 蓝色
          '#10b981', // 绿色
          '#f59e0b', // 黄色
          '#ef4444', // 红色
          '#8b5cf6', // 紫色
          '#f97316', // 橙色
          '#06b6d4', // 青色
          '#84cc16', // 绿黄色
        ][index % 8]
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          width: 2.5 // 悬停时稍微加粗
        }
      },
      animationDelay: index * 100
    }))

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function(params: any) {
          if (!Array.isArray(params)) return ''
          
          const dayOfYear = params[0].value[0]
          const date = new Date(2024, 0, dayOfYear) // 使用2024年作为参考
          const month = date.getMonth() + 1
          const day = date.getDate()
          
          let result = `${month}月${day}日<br/>`
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value[1]}个视频<br/>`
          })
          return result
        }
      },
      legend: {
        data: selectedYears.map(year => `${year}年`),
        top: 30,
        type: 'scroll',
        orient: 'horizontal',
        left: 'center',
        itemGap: 15,
        textStyle: {
          fontSize: 12,
          color: '#374151'
        },
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 6,
        padding: [8, 12]
      },
      grid: {
        left: '3%',
        right: '25%', // 为右侧选择器留出空间
        bottom: '8%', // 增加底部空间
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '年份',
        nameLocation: 'middle',
        nameGap: 30, // 增加间距
        nameTextStyle: {
          fontSize: 12,
          color: '#374151'
        },
        min: 1,
        max: 365,
        axisLabel: {
          formatter: function(value: number) {
            // 将天数转换为月份显示
            const date = new Date(2024, 0, value)
            const month = date.getMonth() + 1
            return `${month}月`
          },
          interval: 30 // 大约每月显示一次
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'log', // 使用对数刻度
        name: '视频数量',
        nameLocation: 'middle',
        nameGap: 40,
        min: function(value) {
          // 确保最小值大于0，对数刻度不能包含0
          return Math.max(1, Math.floor(value.min))
        },
        logBase: 10, // 以10为底的对数
        axisLabel: {
          formatter: function(value: number) {
            // 格式化标签，显示实际数值
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'k'
            }
            return value.toString()
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      series: series,
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }

    chartInstanceRef.current.setOption(option, true)
  }, [data, selectedYears])

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current || loading || error || data.length === 0) return

    // 销毁现有图表实例
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose()
    }

    // 创建新的图表实例
    const chart = echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    configureChart()

    // 响应式处理
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
    }
  }, [data, loading, error, configureChart])

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            年度趋势图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl font-semibold">年度趋势图</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex">
            {/* 图表区域 */}
            <div className="flex-1 p-6 pr-0">
              <div 
                ref={chartRef} 
                className="w-full"
                style={{ minHeight: '400px' }}
              />
            </div>
            
            {/* 年份选择器 */}
            <div className="w-72 flex-shrink-0 p-6 pl-4 border-l border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">年份选择</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShowAll}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      全部显示
                    </button>
                    <button
                      onClick={handleReset}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      重置
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {/* 已选择的年份 */}
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-2">已显示 ({selectedYears.length})</div>
                    <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                      {selectedYears.map(year => (
                        <div 
                          key={year}
                          className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-sm"
                        >
                          <span className="text-blue-700">{year}年</span>
                          <button
                            onClick={() => handleYearRemove(year)}
                            className="text-blue-500 hover:text-blue-700 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 可选择的年份 */}
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-2">可添加 ({unselectedYears.length})</div>
                    <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                      {unselectedYears.map(year => (
                        <div 
                          key={year}
                          className="flex items-center justify-between bg-white border border-gray-200 rounded px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleYearSelect(year)}
                        >
                          <span className="text-gray-700">{year}年</span>
                          <Plus className="h-3 w-3 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </Card>
  )
}