"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RefreshCw, Info } from 'lucide-react'
import { ProvinceMention } from '@/types/province'

interface ChinaMapProps {
  data?: ProvinceMention[]
}

export function ChinaMap({ data = [] }: ChinaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [refreshing, setRefreshing] = useState(false)

  const initMap = async () => {
    console.log('=== 开始初始化地图 ===')
    
    if (!chartRef.current) {
      console.log('❌ chartRef.current 为空')
      return
    }
    console.log('✅ chartRef.current 存在')

    try {
      // 1. 初始化 ECharts
      console.log('1. 初始化 ECharts...')
      const myChart = echarts.init(chartRef.current)
      console.log('✅ ECharts 初始化成功')

      // 2. 加载地图文件
      console.log('2. 加载地图文件...')
      const response = await fetch('/maps/china.json')
      console.log('地图文件响应状态:', response.status, response.ok)
      
      if (!response.ok) {
        throw new Error(`地图文件加载失败: ${response.status}`)
      }

      const geoJson = await response.json()
      console.log('✅ 地图文件加载成功')
      console.log('地图数据结构:', {
        type: geoJson.type,
        featuresCount: geoJson.features?.length,
        firstFeature: geoJson.features?.[0]?.properties
      })

      // 3. 注册地图
      console.log('3. 注册地图...')
      echarts.registerMap('china', geoJson)
      console.log('✅ 地图注册成功')

      // 4. 获取省份数据
      console.log('4. 获取省份数据...')
      let realData = []
      
      // 如果有传入的 props 数据，优先使用
      if (data.length > 0) {
        realData = data.map((item: any) => ({
          name: item.province,
          value: item.mentions
        }))
        console.log('使用传入的 props 数据:', realData)
      } else {
        // 否则从 API 获取
        const dataResponse = await fetch('/api/provinces')
        const dataResult = await dataResponse.json()
        
        console.log('省份数据响应:', dataResult)
        
        if (dataResult.success && dataResult.data) {
          realData = dataResult.data.map((item: any) => ({
            name: item.province,
            value: item.mentions
          }))
          console.log('处理后的地图数据:', realData)
        }
      }

      // 5. 创建地图 - 使用 DebugMap 的成功配置
      console.log('5. 创建地图...')
      const option = {
        title: {
          text: '省份提及热力图',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1f2937',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params: any) {
            if (params.data && params.data.value !== undefined) {
              return `<div style="
                padding: 8px 12px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid #e5e7eb;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              ">
                <div style="font-weight: 600; margin-bottom: 4px;">${params.data.name}</div>
                <div style="color: #6b7280;">提及次数: <span style="color: #1f2937; font-weight: bold;">${params.data.value}</span></div>
              </div>`
            }
            return `${params.name}: 暂无数据`
          }
        },
        visualMap: {
          min: 0,
          max: Math.max(...(realData.map((d: any) => d.value) || [100])),
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          textStyle: {
            color: '#6b7280',
            fontSize: 12
          },
          inRange: {
            color: ['#f0f9ff', '#3b82f6'] // 浅蓝到深蓝的渐变
          }
        },
        series: [{
          type: 'map',
          map: 'china',
          roam: true, // 启用拖拽和缩放
          itemStyle: {
            borderColor: '#999', // 使用 DebugMap 的边框颜色
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#fbbf24' // 悬停时金黄色
            }
          },
          select: {
            itemStyle: {
              areaColor: '#ef4444' // 选中时红色
            }
          },
          data: realData
        }]
      }

      myChart.setOption(option)
      console.log('✅ 地图创建成功')

      // 添加事件监听
      myChart.on('click', function(params: any) {
        console.log('点击了省份:', params.name)
      })

    } catch (error) {
      console.log('❌ 地图加载失败:', error)
    }
  }

  // 手动刷新
  const handleRefresh = async () => {
    setRefreshing(true)
    console.log('手动刷新地图...')
    await initMap()
    setTimeout(() => setRefreshing(false), 300)
  }

  useEffect(() => {
    initMap()
  }, [data])

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
            中国省份热力图
            <div className="relative group">
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                拖拽移动地图，滚轮缩放，点击省份选中
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            基于YouTube视频内容的省份提及频次分析，颜色越深代表提及次数越多
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-9 px-3 bg-white/80 backdrop-blur-sm border-gray-200/80 hover:bg-gray-50/90 hover:border-gray-300/80 transition-all duration-200"
          title="刷新数据"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} transition-transform duration-200`} />
        </Button>
      </CardHeader>
      
      <CardContent className="relative p-0 pb-6">
        <div className="px-6 pb-2">
          <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
            <span className="font-medium">💡 使用提示：</span>
            鼠标悬停查看数据，拖拽移动视图，滚轮缩放，点击省份选中
          </div>
        </div>
        
        <div className="px-6">
          <div 
            ref={chartRef} 
            className="w-full h-96 border mt-4"
            style={{ 
              minHeight: '400px', 
              backgroundColor: '#f9fafb' 
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}