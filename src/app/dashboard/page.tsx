"use client"

import { useState, useEffect } from 'react'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { RecentVideos } from '@/components/dashboard/RecentVideos'
import { RecentComments } from '@/components/dashboard/RecentComments'
import { RegionalPreview } from '@/components/dashboard/RegionalPreview'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { VideoGrowthChart } from '@/components/dashboard/VideoGrowthChart'
import { CommentPolarChart } from '@/components/dashboard/CommentPolarChart'
import { Activity, Clock, AlertCircle, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('zh-CN'))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // 每分钟更新一次
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">数据仪表板</h2>
          <p className="text-muted-foreground mt-1">
            中国旅游视频数据分析平台
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>最后更新: {currentTime || '加载中...'}</span>
        </div>
      </div>

      {/* 统计概览 */}
      <StatsOverview />

      {/* 主要内容区域 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左侧2x2区域 */}
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2 auto-rows-fr">
          {/* 上排：最热视频和高赞评论 */}
          <RecentVideos />
          <RecentComments />
          
          {/* 下排：视频增长折线图和评论极坐标图 */}
          <VideoGrowthChart />
          <CommentPolarChart />
        </div>
        
        {/* 右侧：地域分析预览 */}
        <RegionalPreview />
      </div>

      {/* 系统状态和活动 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 系统活动 */}
        <DashboardCard
          title="系统活动"
          description="最新的数据处理和分析活动"
          icon={Activity}
          iconColor="text-blue-600"
          actionText="查看全部"
          actionHref="/system/activities"
        >
          <div className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">新增1,023个视频分析</p>
                <p className="text-xs text-gray-500">5分钟前</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">评论情感分析完成</p>
                <p className="text-xs text-gray-500">12分钟前</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">地域数据更新完成</p>
                <p className="text-xs text-gray-500">25分钟前</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">数据同步任务开始</p>
                <p className="text-xs text-gray-500">1小时前</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* 系统状态 */}
        <DashboardCard
          title="系统状态"
          description="当前系统运行状态监控"
          icon={CheckCircle}
          iconColor="text-green-600"
          actionText="详细监控"
          actionHref="/system/status"
        >
          <div className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-900">数据库连接</span>
              </div>
              <span className="text-sm font-medium text-green-600">正常</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-900">API 服务</span>
              </div>
              <span className="text-sm font-medium text-green-600">运行中</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-900">数据同步</span>
              </div>
              <span className="text-sm font-medium text-green-600">正常</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <span className="text-sm text-gray-900">存储空间</span>
              </div>
              <span className="text-sm font-medium text-yellow-600">75% 使用</span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}