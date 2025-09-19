/*
 * @Author: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @Date: 2025-09-19 11:31:22
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-19 13:24:27
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\PopularityAnalysis.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client"

import React, { useState } from 'react'
import { PopularityFactorChart } from './PopularityFactorChart'
import { ThreeDimensionalChart } from './ThreeDimensionalChart'
import { cn } from '@/lib/utils'
import { TrendingUp, Box } from 'lucide-react'

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<{ className?: string }>
}

const tabs: TabItem[] = [
  {
    id: '3d-analysis',
    label: '三维热度分析',
    icon: Box,
    component: ThreeDimensionalChart
  },
  {
    id: 'factors',
    label: '热度因素统计',
    icon: TrendingUp,
    component: PopularityFactorChart
  }
]

interface PopularityAnalysisProps {
  className?: string
}

export function PopularityAnalysis({ className }: PopularityAnalysisProps) {
  const [activeTab, setActiveTab] = useState('3d-analysis')

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ThreeDimensionalChart

  return (
    <div className={cn("w-full", className)}>
      {/* 书签式导航栏 */}
      <div className="relative mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 mr-2 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-500"
                )} />
                <span className="whitespace-nowrap">{tab.label}</span>
                
                {/* 书签式底部装饰 */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        
        {/* 底部分割线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
      </div>

      {/* 内容区域 */}
      <div className="transition-all duration-300 ease-in-out">
        <ActiveComponent className="w-full" />
      </div>
    </div>
  )
}