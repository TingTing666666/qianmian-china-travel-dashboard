"use client"

import React from 'react'

interface MiniDistributionChartProps {
  data: number[]
  currentValue: number
  color: string
  width?: number
  height?: number
}

export function MiniDistributionChart({ 
  data, 
  currentValue, 
  color, 
  width = 120, 
  height = 32 
}: MiniDistributionChartProps) {
  // 生成正态分布曲线数据点
  const generateDistributionCurve = () => {
    if (data.length === 0) return []
    
    // 计算统计参数
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    const stdDev = Math.sqrt(variance)
    
    // 如果标准差为0，返回一条直线
    if (stdDev === 0) {
      return Array.from({ length: 50 }, (_, i) => ({
        x: (i / 49) * width,
        y: height / 2
      }))
    }
    
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    
    // 生成50个点的正态分布曲线
    const points = []
    for (let i = 0; i < 50; i++) {
      const x = min + (i / 49) * range
      const normalizedX = (x - mean) / stdDev
      const y = Math.exp(-0.5 * normalizedX * normalizedX)
      
      points.push({
        x: (i / 49) * width,
        y: height - (y * height * 0.8) // 留出20%的边距
      })
    }
    
    return points
  }
  
  // 计算当前值在图表中的位置
  const getCurrentValuePosition = () => {
    if (data.length === 0) return width / 2
    
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    
    const normalizedPosition = (currentValue - min) / range
    return Math.max(0, Math.min(width, normalizedPosition * width))
  }
  
  const curvePoints = generateDistributionCurve()
  const currentPosition = getCurrentValuePosition()
  
  // 生成SVG路径
  const pathData = curvePoints.length > 0 
    ? `M ${curvePoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    : ''
  
  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} className="absolute inset-0">
        {/* 背景区域 */}
        <rect 
          width={width} 
          height={height} 
          fill="transparent"
          className="rounded"
        />
        
        {/* 分布曲线 */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.6"
          />
        )}
        
        {/* 填充区域 */}
        {pathData && (
          <path
            d={`${pathData} L ${width},${height} L 0,${height} Z`}
            fill={color}
            opacity="0.1"
          />
        )}
        
        {/* 当前值标记线 */}
        <line
          x1={currentPosition}
          y1="0"
          x2={currentPosition}
          y2={height}
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
        />
        
        {/* 当前值标记点 */}
        <circle
          cx={currentPosition}
          cy={curvePoints.length > 0 ? 
            curvePoints[Math.round((currentPosition / width) * (curvePoints.length - 1))]?.y || height / 2 
            : height / 2
          }
          r="2"
          fill={color}
        />
      </svg>
    </div>
  )
}