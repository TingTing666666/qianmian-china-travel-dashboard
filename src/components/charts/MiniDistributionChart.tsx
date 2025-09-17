"use client"

import React, { useState, useRef } from 'react'

interface MiniDistributionChartProps {
  data: number[]
  currentValue: number
  color: string
  width?: number
  height?: number
  title?: string
}

interface TooltipData {
  x: number
  y: number
  value: number
  position: number
  visible: boolean
}

export function MiniDistributionChart({ 
  data, 
  currentValue, 
  color, 
  width = 120, 
  height = 32,
  title = "分布图"
}: MiniDistributionChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    value: 0,
    position: 0,
    visible: false
  })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 计算统计信息
  const stats = React.useMemo(() => {
    if (data.length === 0) return { mean: 0, stdDev: 0, min: 0, max: 0, count: 0 }
    
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    const stdDev = Math.sqrt(variance)
    const min = Math.min(...data)
    const max = Math.max(...data)
    
    return { mean, stdDev, min, max, count: data.length }
  }, [data])

  // 生成正态分布曲线数据点
  const generateDistributionCurve = () => {
    if (data.length === 0) return []
    
    const { mean, stdDev, min, max } = stats
    
    // 如果标准差为0，返回一条直线
    if (stdDev === 0) {
      return Array.from({ length: 50 }, (_, i) => ({
        x: (i / 49) * width,
        y: height / 2,
        value: mean
      }))
    }
    
    const range = max - min || 1
    
    // 生成50个点的正态分布曲线
    const points = []
    for (let i = 0; i < 50; i++) {
      const x = min + (i / 49) * range
      const normalizedX = (x - mean) / stdDev
      const y = Math.exp(-0.5 * normalizedX * normalizedX)
      
      points.push({
        x: (i / 49) * width,
        y: height - (y * height * 0.8), // 留出20%的边距
        value: x
      })
    }
    
    return points
  }
  
  // 计算当前值在图表中的位置
  const getCurrentValuePosition = () => {
    if (data.length === 0) return width / 2
    
    const { min, max } = stats
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

  // 处理鼠标移动
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // 计算鼠标位置对应的数值
    const { min, max } = stats
    const range = max - min || 1
    const value = min + (x / width) * range
    const position = (x / width) * 100
    
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      value: Math.round(value * 10) / 10,
      position: Math.round(position),
      visible: true
    })
  }

  // 处理鼠标进入
  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  // 处理鼠标离开
  const handleMouseLeave = () => {
    setIsHovered(false)
    setTooltip(prev => ({ ...prev, visible: false }))
  }
  
  return (
    <>
      <div 
        ref={containerRef}
        className={`relative cursor-pointer transition-all duration-200 ${isHovered ? 'scale-105' : ''}`}
        style={{ width, height }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
              strokeWidth={isHovered ? "2" : "1.5"}
              opacity={isHovered ? "0.8" : "0.6"}
              className="transition-all duration-200"
            />
          )}
          
          {/* 填充区域 */}
          {pathData && (
            <path
              d={`${pathData} L ${width},${height} L 0,${height} Z`}
              fill={color}
              opacity={isHovered ? "0.15" : "0.1"}
              className="transition-all duration-200"
            />
          )}
          
          {/* 当前值标记线 */}
          <line
            x1={currentPosition}
            y1="0"
            x2={currentPosition}
            y2={height}
            stroke={color}
            strokeWidth={isHovered ? "3" : "2"}
            opacity={isHovered ? "1" : "0.8"}
            className="transition-all duration-200"
          />
          
          {/* 当前值标记点 */}
          <circle
            cx={currentPosition}
            cy={curvePoints.length > 0 ? 
              curvePoints[Math.round((currentPosition / width) * (curvePoints.length - 1))]?.y || height / 2 
              : height / 2
            }
            r={isHovered ? "3" : "2"}
            fill={color}
            className="transition-all duration-200"
          />
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-semibold mb-1">{title}</div>
          <div>当前值: <span className="font-bold" style={{ color }}>{currentValue}</span></div>
          <div>鼠标位置值: <span className="font-bold">{tooltip.value}</span></div>
          <div>数据范围: {Math.round(stats.min * 10) / 10} - {Math.round(stats.max * 10) / 10}</div>
          <div>平均值: <span className="font-bold">{Math.round(stats.mean * 10) / 10}</span></div>
          <div>样本数: {stats.count}</div>
        </div>
      )}
    </>
  )
}