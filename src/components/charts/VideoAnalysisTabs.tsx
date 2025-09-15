/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\VideoAnalysisTabs.tsx
 */
"use client"

import React, { useState } from 'react'
import { BarChart3, Calendar, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendAnalysisChart } from './TrendAnalysisChart'
import { HeatmapChart } from './HeatmapChart'

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface VideoAnalysisTabsProps {
  className?: string
}

export function VideoAnalysisTabs({ className }: VideoAnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState('trend')

  const tabs: TabItem[] = [
    {
      id: 'trend',
      label: '变化视图',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'heatmap',
      label: '热力视图',
      icon: <Calendar className="w-4 h-4" />
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trend':
        return <TrendAnalysisChart className="mt-6" />
      case 'heatmap':
        return <HeatmapChart className="mt-6" />
      default:
        return null
    }
  }

  return (
    <div className={`w-full ${className || ''}`}>
      {/* 标签导航 */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-md -mb-px'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-t-md'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 标签内容 */}
      <div className="bg-gray-50 min-h-screen p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}

// 变化视图组件
function TrendAnalysisView() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl font-bold">
            <BarChart3 className="w-5 h-5 mr-2" />
            视频发布趋势分析
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">变化视图图表正在开发中...</p>
              <p className="text-gray-400 text-sm mt-2">将展示时间-视频数量柱状图，支持日/周/月/年切换</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 热力视图组件
function HeatmapAnalysisView() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl font-bold">
            <Calendar className="w-5 h-5 mr-2" />
            视频发布热力图
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">热力视图图表正在开发中...</p>
              <p className="text-gray-400 text-sm mt-2">将展示GitHub风格的日历热力图</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}