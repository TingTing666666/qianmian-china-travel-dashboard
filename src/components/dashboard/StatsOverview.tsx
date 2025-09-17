/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\StatsOverview.tsx
 */
"use client"

import { useState, useEffect } from 'react'
import { MetricCard } from './MetricCard'
import { Video, MessageCircle, Activity, TrendingUp } from "lucide-react"
import { videoService } from '@/services/clientVideoService'
import { commentService } from '@/services/clientCommentService'

interface StatsData {
  totalVideos: number
  totalComments: number
  activeChannels: number
  totalViews: number
}

export function StatsOverview() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 并行获取数据
        const [videoStats, commentStats, channels] = await Promise.all([
          videoService.getVideoStats(),
          commentService.getCommentStats(),
          videoService.getChannels()
        ])
        
        setStats({
          totalVideos: videoStats.totalVideos,
          totalComments: commentStats.totalComments,
          activeChannels: channels.length,
          totalViews: videoStats.totalViews
        })
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-muted-foreground">
        无法加载统计数据
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="总视频数"
        value={stats.totalVideos.toLocaleString()}
        change="+12%"
        changeType="increase"
        icon={Video}
        description="相比上月"
      />
      <MetricCard
        title="总评论数"
        value={stats.totalComments.toLocaleString()}
        change="+8%"
        changeType="increase"
        icon={MessageCircle}
        description="相比上月"
      />
      <MetricCard
        title="活跃频道"
        value={stats.activeChannels.toLocaleString()}
        change="+3%"
        changeType="increase"
        icon={Activity}
        description="相比上月"
      />
      <MetricCard
        title="总观看量"
        value={stats.totalViews.toLocaleString()}
        change="+15%"
        changeType="increase"
        icon={TrendingUp}
        description="相比上月"
      />
    </div>
  )
}