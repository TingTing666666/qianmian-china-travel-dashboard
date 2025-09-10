"use client"

import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function DebugMap() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      console.log('=== 开始调试地图 ===')
      
      if (!chartRef.current) {
        console.log('❌ chartRef.current 为空')
        return
      }
      console.log('✅ chartRef.current 存在')

      try {
        // 1. 测试 ECharts
        console.log('1. 初始化 ECharts...')
        const myChart = echarts.init(chartRef.current)
        console.log('✅ ECharts 初始化成功')

        // 2. 测试地图文件
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

        // 4. 获取真实省份数据并创建地图
        console.log('4. 获取省份数据...')
        const dataResponse = await fetch('/api/provinces')
        const dataResult = await dataResponse.json()
        
        console.log('省份数据响应:', dataResult)
        
        let realData = []
        if (dataResult.success && dataResult.data) {
          realData = dataResult.data.map((item: any) => ({
            name: item.province,
            value: item.mentions
          }))
          console.log('处理后的地图数据:', realData)
        }

        console.log('5. 创建地图...')
        const option = {
          title: {
            text: '省份提及热力图',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}次'
          },
          visualMap: {
            min: 0,
            max: Math.max(...(realData.map((d: any) => d.value) || [100])),
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            inRange: {
              color: ['#e0f3ff', '#006eff']
            }
          },
          series: [{
            type: 'map',
            map: 'china',
            roam: false,
            itemStyle: {
              borderColor: '#999'
            },
            emphasis: {
              itemStyle: {
                areaColor: '#ff6b6b'
              }
            },
            data: realData
          }]
        }

        myChart.setOption(option)
        console.log('✅ 地图创建成功')

      } catch (error) {
        console.log('❌ 地图加载失败:', error)
      }
    }

    initMap()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>调试地图</CardTitle>
      </CardHeader>
      <CardContent>
        <div>请查看浏览器控制台的调试信息</div>
        <div 
          ref={chartRef} 
          className="w-full h-96 border mt-4"
          style={{ minHeight: '400px', backgroundColor: '#f9fafb' }}
        />
      </CardContent>
    </Card>
  )
}