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
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  isActive
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="transition-all duration-300 ease-in-out">
        <ActiveComponent className="w-full" />
      </div>
    </div>
  )
}