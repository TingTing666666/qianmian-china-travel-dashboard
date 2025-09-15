"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RefreshCw, MapPin } from 'lucide-react'
import { ProvinceMention } from '@/types/province'

interface ChinaMapProps {
  data?: ProvinceMention[]
}

export function ChinaMap({ data = [] }: ChinaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [mapStats, setMapStats] = useState({ total: 0, max: 0, provinces: 0 })

  const initMap = async () => {
    if (!chartRef.current) return

    try {
      // 如果已经有实例，先清理
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }

      const myChart = echarts.init(chartRef.current)
      chartInstanceRef.current = myChart

      const response = await fetch('/maps/china.json')
      if (!response.ok) throw new Error(`地图文件加载失败: ${response.status}`)

      const geoJson = await response.json()
      echarts.registerMap('china', geoJson)

      let realData: { name: string; value: number }[] = []
      
      if (data.length > 0) {
        realData = data.map((item: ProvinceMention) => ({
          name: item.province,
          value: item.mentions
        }))
      } else {
        const dataResponse = await fetch('/api/provinces')
        const dataResult = await dataResponse.json()
        
        if (dataResult.success && dataResult.data) {
          realData = dataResult.data.map((item: ProvinceMention) => ({
            name: item.province,
            value: item.mentions
          }))
        }
      }

      // 计算统计信息
      const total = realData.reduce((sum, item) => sum + item.value, 0)
      const max = Math.max(...(realData.map(d => d.value) || [0]))
      setMapStats({ total, max, provinces: realData.length })

      const option = {
        title: {
          text: '中国省份热力图',
          left: 'center',
          top: 10,
          textStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1f2937',
            fontFamily: 'Inter, system-ui, sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params: any) {
            if (params.data && params.data.value !== undefined) {
              const percentage = total > 0 ? ((params.data.value / total) * 100).toFixed(1) : '0'
              return `<div style="
                padding: 12px 16px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.98);
                border: 1px solid #e5e7eb;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                min-width: 180px;
              ">
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #1f2937;">${params.data.name}</div>
                <div style="margin-bottom: 4px;">
                  <span style="color: #6b7280;">提及次数: </span>
                  <span style="color: #3b82f6; font-weight: 600;">${params.data.value.toLocaleString()}</span>
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="color: #6b7280;">占比: </span>
                  <span style="color: #059669; font-weight: 600;">${percentage}%</span>
                </div>
                <div style="font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 6px; margin-top: 6px;">
                  点击选中此省份
                </div>
              </div>`
            }
            return `<div style="
              padding: 12px 16px;
              border-radius: 8px;
              background: rgba(255, 255, 255, 0.98);
              border: 1px solid #e5e7eb;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            ">
              <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${params.name}</div>
              <div style="color: #9ca3af; font-size: 13px;">暂无数据</div>
            </div>`
          }
        },
        visualMap: {
          min: 0,
          max: Math.max(...(realData.map(d => d.value) || [100])),
          left: 20,
          bottom: 60,
          text: ['高', '低'],
          textStyle: {
            color: '#6b7280',
            fontSize: 12,
            fontWeight: '500'
          },
          inRange: {
            color: ['#f0f9ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']
          },
          outOfRange: {
            color: '#f3f4f6'
          },
          calculable: true,
          orient: 'horizontal',
          itemWidth: 20,
          itemHeight: 140
        },
        series: [{
          type: 'map',
          map: 'china',
          roam: 'move',
          scaleLimit: {
            min: 0.5,
            max: 3
          },
          aspectScale: 0.85,
          zoom: 1.1,
          itemStyle: {
            borderColor: '#e5e7eb',
            borderWidth: 0.5,
            shadowColor: 'transparent'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#fbbf24',
              borderColor: '#f59e0b',
              borderWidth: 1,
              shadowBlur: 4,
              shadowColor: 'rgba(251, 191, 36, 0.2)'
            },
            label: {
              show: true,
              fontSize: 13,
              color: '#ffffff',
              fontWeight: '600',
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadowColor: 'rgba(0, 0, 0, 0.7)',
              textShadowBlur: 2
            }
          },
          select: {
            itemStyle: {
              areaColor: '#ef4444',
              borderColor: '#dc2626',
              borderWidth: 1
            },
            label: {
              show: true,
              fontSize: 13,
              color: '#ffffff',
              fontWeight: '600'
            }
          },
          data: realData
        }]
      }

      myChart.setOption(option)

      // 添加交互事件
      myChart.on('click', function(params: echarts.ECElementEvent) {
        if (params.data && typeof params.data === 'object' && 'name' in params.data && 'value' in params.data) {
          setSelectedProvince(params.name)
        }
      })

      // 双击重置视图
      myChart.on('dblclick', function() {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.dispatchAction({
            type: 'restore'
          })
          setSelectedProvince(null)
        }
      })

    } catch (error) {
      console.error('地图初始化失败:', error)
    }
  }

  // 手动刷新
  const handleRefresh = async () => {
    setRefreshing(true)
    await initMap()
    setTimeout(() => setRefreshing(false), 500)
  }

  useEffect(() => {
    // 只在组件挂载时初始化一次
    let mounted = true
    
    const initialize = async () => {
      if (mounted) {
        await initMap()
      }
    }
    
    initialize()
    
    return () => {
      mounted = false
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
    }
  }, [])

  // 单独处理 data 变化
  useEffect(() => {
    if (chartInstanceRef.current && data.length > 0) {
      // 只更新数据，不重新初始化整个地图
      const processedData = data.map((item: ProvinceMention) => ({
        name: item.province,
        value: item.mentions
      }))
      
      const total = processedData.reduce((sum, item) => sum + item.value, 0)
      const max = Math.max(...processedData.map(d => d.value))
      setMapStats({ total, max, provinces: processedData.length })
      
      chartInstanceRef.current.setOption({
        series: [{
          data: processedData
        }],
        visualMap: {
          max: max
        }
      }, false)
    }
  }, [data])

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            中国省份热力图
            {selectedProvince && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                已选中: {selectedProvince}
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            基于YouTube视频内容的省份提及频次分析
            {mapStats.provinces > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                • 共{mapStats.provinces}个省份 • 总计{mapStats.total.toLocaleString()}次提及
              </span>
            )}
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-9 px-3"
            title="刷新数据"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-0 pb-6">
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{mapStats.provinces}</div>
              <div className="text-sm text-blue-700">省份数量</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{mapStats.total.toLocaleString()}</div>
              <div className="text-sm text-green-700">总提及次数</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-600">{mapStats.max.toLocaleString()}</div>
              <div className="text-sm text-amber-700">最高提及次数</div>
            </div>
          </div>
        </div>
        
        <div className="px-6">
          <div 
            ref={chartRef} 
            className="w-full h-[500px] rounded-lg"
            style={{ 
              minHeight: '500px'
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}