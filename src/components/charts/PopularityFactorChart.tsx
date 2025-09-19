"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RefreshCw, TrendingUp, Settings, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { videoService } from '@/services/clientVideoService'

interface PopularityData {
  likes: number
  comments: number
  views: number
  title: string
  id: string
}

interface PopularityFactorChartProps {
  className?: string
}

type ScaleMode = 'linear' | 'log' | 'sqrt'
type FilterMode = 'all' | 'removeOutliers' | 'topPercentile'

export function PopularityFactorChart({ className }: PopularityFactorChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [data, setData] = useState<PopularityData[]>([])
  const [filteredData, setFilteredData] = useState<PopularityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scaleMode, setScaleMode] = useState<ScaleMode>('log')
  const [filterMode, setFilterMode] = useState<FilterMode>('removeOutliers')
  const [showControls, setShowControls] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 获取所有视频数据，设置足够大的limit以获取全部3005条数据
      const response = await videoService.getVideoData({ limit: 5000 })
      
      if (response.data) {
        const popularityData: PopularityData[] = response.data.map(video => ({
          likes: video.like_count || 0,
          comments: video.comment_count || 0,
          views: video.view_count || 0,
          title: video.title || '未知标题',
          id: video.id || ''
        }))
        
        setData(popularityData)
      } else {
        throw new Error('获取数据失败')
      }
    } catch (err) {
      console.error('获取热度数据失败:', err)
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 数据过滤函数
  const filterData = (data: PopularityData[], mode: FilterMode): PopularityData[] => {
    if (mode === 'all') return data

    const sortedByViews = [...data].sort((a, b) => b.views - a.views)
    
    if (mode === 'topPercentile') {
      // 只显示前20%的数据
      const topCount = Math.ceil(data.length * 0.2)
      return sortedByViews.slice(0, topCount)
    }
    
    if (mode === 'removeOutliers') {
      // 移除异常值（使用IQR方法）
      const views = data.map(d => d.views).sort((a, b) => a - b)
      const q1 = views[Math.floor(views.length * 0.25)]
      const q3 = views[Math.floor(views.length * 0.75)]
      const iqr = q3 - q1
      const lowerBound = q1 - 1.5 * iqr
      const upperBound = q3 + 1.5 * iqr
      
      return data.filter(d => d.views >= lowerBound && d.views <= upperBound)
    }
    
    return data
  }

  // 数据变换函数
  const transformValue = (value: number, mode: ScaleMode): number => {
    if (value <= 0) return 0
    
    switch (mode) {
      case 'log':
        return Math.log10(value + 1)
      case 'sqrt':
        return Math.sqrt(value)
      default:
        return value
    }
  }

  // 格式化显示值
  const formatValue = (value: number, originalValue: number): string => {
    if (originalValue >= 1000000) {
      return (originalValue / 1000000).toFixed(1) + 'M'
    } else if (originalValue >= 10000) {
      return (originalValue / 10000).toFixed(1) + 'w'
    } else if (originalValue >= 1000) {
      return (originalValue / 1000).toFixed(1) + 'k'
    }
    return originalValue.toString()
  }

  const initChart = () => {
    if (!chartRef.current || !filteredData.length) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    // 准备散点图数据，应用数据变换
    const scatterData = filteredData.map(item => {
      const transformedLikes = transformValue(item.likes, scaleMode)
      const transformedComments = transformValue(item.comments, scaleMode)
      const transformedViews = transformValue(item.views, scaleMode)
      
      return [
        transformedLikes,
        transformedComments,
        transformedViews,
        item.title,
        item.likes,  // 原始值用于tooltip
        item.comments,
        item.views
      ]
    })

    // 计算变换后的观看次数范围，用于设置气泡大小
    const transformedViewsValues = scatterData.map(item => item[2])
    const minTransformedViews = Math.min(...transformedViewsValues)
    const maxTransformedViews = Math.max(...transformedViewsValues)

    const getAxisLabel = (mode: ScaleMode) => {
      switch (mode) {
        case 'log': return '(对数缩放)'
        case 'sqrt': return '(平方根缩放)'
        default: return ''
      }
    }

    const option: echarts.EChartsOption = {
      title: {
        text: '视频热度因素分析',
        subtext: `数据缩放: ${scaleMode === 'log' ? '对数' : scaleMode === 'sqrt' ? '平方根' : '线性'} | 过滤: ${filterMode === 'all' ? '全部数据' : filterMode === 'removeOutliers' ? '移除异常值' : '前20%数据'} | 共${filteredData.length}条记录`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1f2937'
        },
        subtextStyle: {
          fontSize: 11,
          color: '#6b7280'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data
          return `
            <div style="padding: 8px; max-width: 300px;">
              <div style="font-weight: bold; margin-bottom: 4px; word-wrap: break-word;">${data[3]}</div>
              <div>点赞数: ${formatValue(data[0], data[4])}</div>
              <div>评论数: ${formatValue(data[1], data[5])}</div>
              <div>观看次数: ${formatValue(data[2], data[6])}</div>
              ${scaleMode !== 'linear' ? '<div style="margin-top: 4px; font-size: 11px; color: #6b7280;">图表显示为' + (scaleMode === 'log' ? '对数' : '平方根') + '缩放值</div>' : ''}
            </div>
          `
        }
      },
      grid: {
        left: '10%',
        right: '15%',
        bottom: '15%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: `点赞数 ${getAxisLabel(scaleMode)}`,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 12,
          color: '#374151'
        },
        axisLabel: {
          formatter: (value: number) => {
            if (scaleMode === 'linear') {
              return formatValue(value, value)
            }
            return value.toFixed(1)
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
      yAxis: {
        type: 'value',
        name: `评论数 ${getAxisLabel(scaleMode)}`,
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          fontSize: 12,
          color: '#374151'
        },
        axisLabel: {
          formatter: (value: number) => {
            if (scaleMode === 'linear') {
              return formatValue(value, value)
            }
            return value.toFixed(1)
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
      series: [
        {
          name: '热度因素',
          type: 'scatter',
          data: scatterData,
          symbolSize: (data: any) => {
            // 根据变换后的观看次数计算气泡大小，范围在 8-40 之间
            const transformedViews = data[2]
            if (maxTransformedViews === minTransformedViews) return 15
            const normalizedSize = ((transformedViews - minTransformedViews) / (maxTransformedViews - minTransformedViews)) * 32 + 8
            return Math.max(8, Math.min(40, normalizedSize))
          },
          itemStyle: {
            color: (params: any) => {
              // 根据变换后的观看次数设置颜色深浅
              const transformedViews = params.data[2]
              if (maxTransformedViews === minTransformedViews) return 'rgba(59, 130, 246, 0.6)'
              const intensity = (transformedViews - minTransformedViews) / (maxTransformedViews - minTransformedViews)
              const alpha = 0.3 + intensity * 0.5
              return `rgba(59, 130, 246, ${alpha})`
            },
            borderColor: '#3b82f6',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              color: '#1d4ed8',
              borderColor: '#1e40af',
              borderWidth: 2
            }
          }
        }
      ]
    }

    chartInstance.current.setOption(option)

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  // 更新过滤数据
  useEffect(() => {
    if (data.length > 0) {
      const filtered = filterData(data, filterMode)
      setFilteredData(filtered)
    }
  }, [data, filterMode])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!loading && filteredData.length > 0) {
      initChart()
    }
  }, [filteredData, loading, scaleMode])

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
    }
  }, [])

  const handleRefresh = () => {
    fetchData()
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            热度因素统计图
          </CardTitle>
          <CardDescription>
            分析视频点赞数、评论数与观看次数的关联性，气泡大小表示观看次数
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowControls(!showControls)}
            className="h-8 px-3"
          >
            <Settings className="h-4 w-4 mr-1" />
            设置
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      
      {/* 控制面板 */}
      {showControls && (
        <div className="px-6 pb-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">数据缩放模式</label>
              <div className="flex gap-2">
                {[
                  { value: 'linear' as ScaleMode, label: '线性' },
                  { value: 'log' as ScaleMode, label: '对数' },
                  { value: 'sqrt' as ScaleMode, label: '平方根' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={scaleMode === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScaleMode(option.value)}
                    className="h-8 px-3"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">数据过滤</label>
              <div className="flex gap-2">
                {[
                  { value: 'all' as FilterMode, label: '全部', icon: null },
                  { value: 'removeOutliers' as FilterMode, label: '移除异常值', icon: Filter },
                  { value: 'topPercentile' as FilterMode, label: '前20%', icon: TrendingUp }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={filterMode === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterMode(option.value)}
                    className="h-8 px-3 flex items-center gap-1"
                  >
                    {option.icon && <option.icon className="h-3 w-3" />}
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* 数据统计信息 */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">总数据:</span>
                <span className="ml-1 font-medium">{data.length}</span>
              </div>
              <div>
                <span className="text-gray-600">显示:</span>
                <span className="ml-1 font-medium text-blue-600">{filteredData.length}</span>
              </div>
              <div>
                <span className="text-gray-600">缩放:</span>
                <span className="ml-1 font-medium text-green-600">
                  {scaleMode === 'log' ? '对数' : scaleMode === 'sqrt' ? '平方根' : '线性'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">过滤:</span>
                <span className="ml-1 font-medium text-purple-600">
                  {filterMode === 'all' ? '无' : filterMode === 'removeOutliers' ? '异常值' : '前20%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <CardContent>
        {error ? (
          <div className="flex items-center justify-center h-[400px] text-red-500">
            <div className="text-center">
              <p className="text-sm">加载失败: {error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2"
              >
                重试
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">加载中...</span>
                </div>
              </div>
            )}
            <div
              ref={chartRef}
              className="w-full h-[400px]"
              style={{ minHeight: '400px' }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}