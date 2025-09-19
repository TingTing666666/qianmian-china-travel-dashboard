"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
// 动态导入echarts-gl以避免构建时错误
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RefreshCw, Settings, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { videoService } from '@/services/clientVideoService'
import { VideoData } from '@/types/video'
import { cn } from '@/lib/utils'

type ScaleMode = 'linear' | 'log' | 'sqrt'
type FilterMode = 'all' | 'removeOutliers' | 'topPercentile'

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
  const [filterMode, setFilterMode] = useState<FilterMode>('removeOutliers')
  const [showControls, setShowControls] = useState(false)
  const [zoomMode, setZoomMode] = useState<'select' | 'dataZoom'>('select')
  const [autoRotate, setAutoRotate] = useState(false)

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
      item.viewCount > 0 || item.likeCount > 0 || item.commentCount > 0
    )

    if (mode === 'topPercentile') {
      // 返回前20%的数据（按观看次数排序）
      const sortedData = [...validData].sort((a, b) => b.viewCount - a.viewCount)
      return sortedData.slice(0, Math.ceil(sortedData.length * 0.2))
    }

    if (mode === 'removeOutliers') {
      // 使用IQR方法移除异常值
      const viewCounts = validData.map(item => item.viewCount).sort((a, b) => a - b)
      const likeCounts = validData.map(item => item.likeCount).sort((a, b) => a - b)
      const commentCounts = validData.map(item => item.commentCount).sort((a, b) => a - b)

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
        item.viewCount >= viewBounds.lower && item.viewCount <= viewBounds.upper &&
        item.likeCount >= likeBounds.lower && item.likeCount <= likeBounds.upper &&
        item.commentCount >= commentBounds.lower && item.commentCount <= commentBounds.upper
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
        const x = transformValue(item.likeCount, scaleMode)
        const y = transformValue(item.commentCount, scaleMode)
        const z = transformValue(item.viewCount, scaleMode)
        
        return {
          value: [x, y, z],
          name: item.title,
          itemStyle: {
            color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`
          },
          symbolSize: Math.max(8, Math.min(25, Math.sqrt(item.viewCount) / 200))
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
                <strong>${item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title}</strong><br/>
                播放量: ${formatValue(item.viewCount)}<br/>
                点赞数: ${formatValue(item.likeCount)}<br/>
                评论数: ${formatValue(item.commentCount)}<br/>
                频道: ${item.channelTitle}
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

      console.log('设置3D图表选项:', option)
      chart.setOption(option)
      console.log('3D图表初始化完成')
    } else {
      // 降级到2D散点图
      const chartData = filteredData.map((item, index) => ({
        value: [
          transformValue(item.likeCount, scaleMode),
          transformValue(item.commentCount, scaleMode),
          transformValue(item.viewCount, scaleMode)
        ],
        name: item.title,
        itemStyle: {
          color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
        },
        symbolSize: Math.max(8, Math.min(25, Math.sqrt(item.viewCount) / 200))
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
                <strong>${item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title}</strong><br/>
                播放量: ${formatValue(item.viewCount)}<br/>
                点赞数: ${formatValue(item.likeCount)}<br/>
                评论数: ${formatValue(item.commentCount)}<br/>
                频道: ${item.channelTitle}
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
  }, [filteredData, scaleMode])

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
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">三维热度分析</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              title="重置视角"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoRotate}
              title="自动旋转"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 控制面板 */}
        {showControls && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 缩放模式 */}
              <div>
                <label className="block text-sm font-medium mb-2">数据缩放模式</label>
                <div className="flex space-x-2">
                  {[
                    { value: 'linear', label: '线性' },
                    { value: 'log', label: '对数' },
                    { value: 'sqrt', label: '平方根' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={scaleMode === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setScaleMode(option.value as ScaleMode)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 过滤模式 */}
              <div>
                <label className="block text-sm font-medium mb-2">数据过滤模式</label>
                <div className="flex space-x-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'removeOutliers', label: '移除异常值' },
                    { value: 'topPercentile', label: '前20%' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={filterMode === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterMode(option.value as FilterMode)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{data.length}</div>
                <div className="text-gray-500">总数据</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{filteredData.length}</div>
                <div className="text-gray-500">显示数据</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">{scaleMode}</div>
                <div className="text-gray-500">缩放模式</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{filterMode}</div>
                <div className="text-gray-500">过滤模式</div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div 
          ref={chartRef} 
          className="w-full h-96 md:h-[500px] lg:h-[600px]"
        />
        
        {/* 操作提示 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>鼠标拖拽旋转 • 滚轮缩放 • 右键平移 • 悬停查看详情</p>
        </div>
      </CardContent>
    </Card>
  )
}