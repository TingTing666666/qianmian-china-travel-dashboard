"use client"

import React, { useState } from 'react'
import { TrendAnalysisChart } from './TrendAnalysisChart'
import { VideoCalendarHeatmap } from './VideoCalendarHeatmap'
import { cn } from '@/lib/utils'
import { BarChart3, Calendar } from 'lucide-react'

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<{ className?: string }>
}

const tabs: TabItem[] = [
  {
    id: 'trend',
    label: '趋势分析',
    icon: BarChart3,
    component: TrendAnalysisChart
  },
  {
    id: 'heatmap',
    label: '视频发布日历热力图',
    icon: Calendar,
    component: VideoCalendarHeatmap
  }
]

interface TimeSeriesAnalysisProps {
  className?: string
}

export function TimeSeriesAnalysis({ className }: TimeSeriesAnalysisProps) {
  const [activeTab, setActiveTab] = useState('trend')

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || TrendAnalysisChart

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
                    ? "border-blue-500 text-blue-600"
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