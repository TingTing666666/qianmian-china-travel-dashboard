"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
// 动态导入echarts-gl以避免构建时错误
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { RefreshCw, RotateCcw, Box, Filter, Zap, BarChart3 } from 'lucide-react'
import { videoService } from '@/services/clientVideoService'
import { VideoData } from '@/types/video'
import { cn } from '@/lib/utils'

type ScaleMode = 'linear' | 'log' | 'sqrt'
type FilterMode = 'all' | 'removeOutliers' | 'topPercentile'
type ChartType = '3d' | '2d'

interface ThreeDimensionalChartProps {
  className?: string
}

export function ThreeDimensionalChart({ className }: ThreeDimensionalChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [data, setData] = useState<VideoData[]>([])
  const [filteredData, setFilteredData] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scaleMode, setScaleMode] = useState<ScaleMode>('log')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [chartType, setChartType] = useState<ChartType>('3d')
  const [autoRotate, setAutoRotate] = useState(true)

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 获取所有视频数据
      const response = await videoService.getVideoData({ limit: 5000 })
      
      if (response.data) {
        setData(response.data)
      } else {
        setError('未能获取到数据')
      }
    } catch (err) {
      console.error('获取数据失败:', err)
      setError('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 数据过滤函数
  const filterData = (data: VideoData[], mode: FilterMode): VideoData[] => {
    if (mode === 'all') return data

    // 过滤掉所有数值都为0的数据
    const validData = data.filter(item => 
      (item.view_count || 0) > 0 || (item.like_count || 0) > 0 || (item.comment_count || 0) > 0
    )

    if (mode === 'topPercentile') {
      // 返回前20%的数据（按观看次数排序）
      const sortedData = [...validData].sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      return sortedData.slice(0, Math.ceil(sortedData.length * 0.2))
    }

    if (mode === 'removeOutliers') {
      // 使用IQR方法移除异常值
      const viewCounts = validData.map(item => item.view_count || 0).sort((a, b) => a - b)
      const likeCounts = validData.map(item => item.like_count || 0).sort((a, b) => a - b)
      const commentCounts = validData.map(item => item.comment_count || 0).sort((a, b) => a - b)

      const getIQRBounds = (values: number[]) => {
        const q1 = values[Math.floor(values.length * 0.25)]
        const q3 = values[Math.floor(values.length * 0.75)]
        const iqr = q3 - q1
        return { lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr }
      }

      const viewBounds = getIQRBounds(viewCounts)
      const likeBounds = getIQRBounds(likeCounts)
      const commentBounds = getIQRBounds(commentCounts)

      return validData.filter(item =>
        (item.view_count || 0) >= viewBounds.lower && (item.view_count || 0) <= viewBounds.upper &&
        (item.like_count || 0) >= likeBounds.lower && (item.like_count || 0) <= likeBounds.upper &&
        (item.comment_count || 0) >= commentBounds.lower && (item.comment_count || 0) <= commentBounds.upper
      )
    }

    return validData
  }

  // 数据变换函数
  const transformValue = (value: number, mode: ScaleMode): number => {
    if (value <= 0) return 0
    
    switch (mode) {
      case 'log':
        return Math.log10(value + 1)
      case 'sqrt':
        return Math.sqrt(value)
      case 'linear':
      default:
        return value
    }
  }

  // 格式化显示值
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toString()
  }

  // 获取坐标轴名称
  const getAxisName = (axis: 'x' | 'y' | 'z', mode: ScaleMode): string => {
    const baseNames = {
      x: '点赞数',
      y: '评论数', 
      z: '播放量'
    }
    
    const scaleNames = {
      linear: '',
      log: '(对数)',
      sqrt: '(平方根)'
    }
    
    return `${baseNames[axis]}${scaleNames[mode]}`
  }

  // 初始化图表
  const initChart = async () => {
    if (!chartRef.current || filteredData.length === 0) return

    console.log('开始初始化图表，数据量:', filteredData.length)

    // 动态导入echarts-gl
    let supports3D = false
    try {
      const echartsGL = await import('echarts-gl')
      supports3D = true
      console.log('echarts-gl 加载成功:', echartsGL)
    } catch (error) {
      console.error('echarts-gl 加载失败:', error)
      supports3D = false
    }

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    console.log('3D支持状态:', supports3D)

    if (supports3D) {
      // 3D散点图配置
      const chartData = filteredData.map((item, index) => {
        const x = transformValue(item.like_count || 0, scaleMode)
        const y = transformValue(item.comment_count || 0, scaleMode)
        const z = transformValue(item.view_count || 0, scaleMode)
        
        return {
          value: [x, y, z],
          name: item.title,
          itemStyle: {
            color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`
          },
          symbolSize: Math.max(8, Math.min(25, Math.sqrt(item.view_count || 0) / 200))
        }
      })

      const option: echarts.EChartsOption = {
        title: {
          text: '视频热度三维分析',
          subtext: `数据: ${filteredData.length}条 | 缩放: ${scaleMode} | 过滤: ${filterMode}`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const dataIndex = params.dataIndex
            const item = filteredData[dataIndex]
            if (!item) return ''
            
            return `
              <div style="max-width: 300px;">
                <strong>${item.title && item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title || '未知标题'}</strong><br/>
                播放量: ${formatValue(item.view_count || 0)}<br/>
                点赞数: ${formatValue(item.like_count || 0)}<br/>
                评论数: ${formatValue(item.comment_count || 0)}<br/>
                频道: ${item.channel_title || '未知频道'}
              </div>
            `
          }
        },
        xAxis3D: {
          name: getAxisName('x', scaleMode),
          type: 'value',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        yAxis3D: {
          name: getAxisName('y', scaleMode),
          type: 'value',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        zAxis3D: {
          name: getAxisName('z', scaleMode),
          type: 'value',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        grid3D: {
          boxWidth: 200,
          boxHeight: 200,
          boxDepth: 200,
          viewControl: {
            projection: 'perspective',
            autoRotate: autoRotate,
            rotateSensitivity: 1,
            zoomSensitivity: 1,
            panSensitivity: 1,
            alpha: 20,
            beta: 40,
            distance: 300,
            minDistance: 100,
            maxDistance: 1000
          },
          light: {
            main: {
              intensity: 1.2,
              shadow: true,
              shadowQuality: 'high'
            },
            ambient: {
              intensity: 0.3
            }
          },
          environment: 'auto'
        },
        series: [{
          type: 'scatter3D',
          data: chartData,
          symbolSize: (data: any, params: any) => {
            const item = filteredData[params.dataIndex]
            return Math.max(8, Math.min(25, Math.sqrt(item.view_count || 0) / 200))
          },
          itemStyle: {
            opacity: 0.8
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              borderColor: '#333',
              borderWidth: 2
            }
          }
        }]
      }

      console.log('设置3D图表选项:', option)
      chart.setOption(option)
      console.log('3D图表初始化完成')
    } else {
      // 降级到2D散点图
      const chartData = filteredData.map((item, index) => ({
        value: [
          transformValue(item.like_count || 0, scaleMode),
          transformValue(item.comment_count || 0, scaleMode),
          transformValue(item.view_count || 0, scaleMode)
        ],
        name: item.title,
        itemStyle: {
          color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
        },
        symbolSize: Math.max(8, Math.min(25, Math.sqrt(item.view_count || 0) / 200))
      }))

      const option: echarts.EChartsOption = {
        title: {
          text: '视频热度分析 (2D视图)',
          subtext: `数据: ${filteredData.length}条 | 缩放: ${scaleMode} | 过滤: ${filterMode}`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const dataIndex = params.dataIndex
            const item = filteredData[dataIndex]
            if (!item) return ''
            
            return `
              <div style="max-width: 300px;">
                <strong>${item.title && item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title || '未知标题'}</strong><br/>
                播放量: ${formatValue(item.view_count || 0)}<br/>
                点赞数: ${formatValue(item.like_count || 0)}<br/>
                评论数: ${formatValue(item.comment_count || 0)}<br/>
                频道: ${item.channel_title || '未知频道'}
              </div>
            `
          }
        },
        xAxis: {
          name: getAxisName('x', scaleMode),
          type: 'value',
          nameTextStyle: {
            fontSize: 12,
            fontWeight: 'bold'
          },
          axisLabel: {
            formatter: (value: number) => formatValue(value)
          }
        },
        yAxis: {
          name: getAxisName('y', scaleMode),
          type: 'value',
          nameTextStyle: {
            fontSize: 12,
            fontWeight: 'bold'
          },
          axisLabel: {
            formatter: (value: number) => formatValue(value)
          }
        },
        series: [{
          type: 'scatter',
          data: chartData,
          symbolSize: (data: any, params: any) => {
            const item = filteredData[params.dataIndex]
            return Math.max(8, Math.min(25, Math.sqrt(item.viewCount) / 200))
          },
          itemStyle: {
            opacity: 0.8
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              borderColor: '#333',
              borderWidth: 2
            }
          }
        }]
      }

      chart.setOption(option)
    }

    // 响应式处理
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  // 重置视角
  const resetView = () => {
    if (chartInstance.current) {
      // 检查是否为3D图表
      const option = chartInstance.current.getOption() as any
      if (option.grid3D && option.grid3D.length > 0) {
        // 3D图表重置
        chartInstance.current.dispatchAction({
          type: 'grid3DResetView'
        })
      } else {
        // 2D图表重置缩放和平移
        chartInstance.current.dispatchAction({
          type: 'dataZoom',
          start: 0,
          end: 100
        })
      }
    }
  }

  // 重置所有设置到默认值
  const resetSettings = () => {
    setScaleMode('log')
    setFilterMode('all')
    setChartType('3d')
    setAutoRotate(true)
    
    // 重置图表视角
    if (chartInstance.current) {
      const option = chartInstance.current.getOption() as any
      if (option.grid3D && option.grid3D.length > 0) {
        chartInstance.current.dispatchAction({
          type: 'grid3DResetView'
        })
        
        // 开启自动旋转
        chartInstance.current.setOption({
          grid3D: {
            viewControl: {
              autoRotate: true
            }
          }
        })
      }
    }
  }

  // 自动旋转切换
  const toggleAutoRotate = () => {
    if (chartInstance.current) {
      const option = chartInstance.current.getOption() as any
      if (option.grid3D && option.grid3D.length > 0) {
        // 3D图表支持自动旋转
        const currentAutoRotate = option.grid3D[0].viewControl.autoRotate
        setAutoRotate(!currentAutoRotate)
        
        chartInstance.current.setOption({
          grid3D: {
            viewControl: {
              autoRotate: !currentAutoRotate
            }
          }
        })
      } else {
        // 2D图表不支持自动旋转
        console.log('Auto rotate not supported in 2D mode')
      }
    }
  }

  // 数据过滤效果
  useEffect(() => {
    if (data.length > 0) {
      const filtered = filterData(data, filterMode)
      setFilteredData(filtered)
    }
  }, [data, filterMode])

  // 图表初始化效果
  useEffect(() => {
    let cleanup: (() => void) | undefined

    const initializeChart = async () => {
      if (filteredData.length > 0) {
        cleanup = await initChart()
      }
    }

    initializeChart()
    
    return () => {
      if (cleanup) cleanup()
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [filteredData, scaleMode, chartType, autoRotate])

  // 组件挂载时获取数据
  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>加载中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center h-96 space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            重试
          </Button>
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
                <Box className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-semibold">三维热度分析</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* 控制面板 */}
          <div className="mb-8 flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 数据过滤模式 */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">数据过滤：</span>
                  <CustomSelect
                    value={filterMode}
                    onValueChange={(value) => setFilterMode(value as FilterMode)}
                    options={[
                      { value: 'all', label: '全部数据' },
                      { value: 'topPercentile', label: '前20%数据' },
                      { value: 'removeOutliers', label: '移除异常值' }
                    ]}
                    className="w-32"
                  />
                </div>

                {/* 数据缩放模式 */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">缩放模式：</span>
                  <CustomSelect
                    value={scaleMode}
                    onValueChange={(value) => setScaleMode(value as ScaleMode)}
                    options={[
                      { value: 'linear', label: '线性' },
                      { value: 'log', label: '对数' },
                      { value: 'sqrt', label: '平方根' }
                    ]}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* 图表类型 */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">图表类型：</span>
                  <CustomSelect
                    value={chartType}
                    onValueChange={(value) => setChartType(value as ChartType)}
                    options={[
                      { value: '3d', label: '3D散点图' },
                      { value: '2d', label: '2D气泡图' }
                    ]}
                    className="w-32"
                  />
                </div>

                {/* 自动旋转控制 */}
                 <Button
                   variant={autoRotate ? "secondary" : "outline"}
                   size="sm"
                   onClick={toggleAutoRotate}
                   className={autoRotate ? "bg-blue-600 text-white hover:bg-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
                 >
                   <RotateCcw className="w-4 h-4 mr-1" />
                   {autoRotate ? '停止旋转' : '自动旋转'}
                 </Button>

                 {/* 重置设置按钮 */}
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={resetSettings}
                   className="border-red-300 text-red-700 hover:bg-red-50"
                 >
                   重置设置
                 </Button>
               </div>
            </div>

            {/* 图表控制说明 */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700 mr-2">图表说明：</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">观看次数 (X轴)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">点赞数 (Y轴)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">评论数 (Z轴)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 图表容器 */}
          <div 
            ref={chartRef} 
            className="w-full h-96 md:h-[500px] lg:h-[600px] bg-white rounded-lg border border-gray-200"
          />
          
          {/* 操作提示 */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>鼠标拖拽旋转 • 滚轮缩放 • 右键平移 • 悬停查看详情</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}