/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\RegionalPreview.tsx
 */
"use client"

import React, { useState, useEffect } from 'react'
import { DashboardCard } from './DashboardCard'
import { MapPin, TrendingUp, Award, Users } from "lucide-react"
import { Badge } from "@/components/ui/Badge"

interface ProvinceData {
  name: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  rank: number
}

interface RegionalStats {
  totalProvinces: number
  topProvinces: ProvinceData[]
  totalMentions: number
  growthRate: number
}

export function RegionalPreview() {
  const [stats, setStats] = useState<RegionalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegionalStats = async () => {
      try {
        const response = await fetch('/api/provinces/stats')
        const data = await response.json()
        
        if (data.success && data.data) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('获取地域统计失败:', error)
        // 使用模拟数据作为后备
        setStats({
          totalProvinces: 34,
          topProvinces: [
            { name: '北京', count: 1245, percentage: 15.2, trend: 'up', rank: 1 },
            { name: '上海', count: 1089, percentage: 13.3, trend: 'up', rank: 2 },
            { name: '广东', count: 987, percentage: 12.1, trend: 'stable', rank: 3 },
            { name: '浙江', count: 756, percentage: 9.2, trend: 'up', rank: 4 },
            { name: '江苏', count: 698, percentage: 8.5, trend: 'down', rank: 5 }
          ],
          totalMentions: 8190,
          growthRate: 12.5
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRegionalStats()
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800'
    if (rank === 2) return 'bg-gray-100 text-gray-800'
    if (rank === 3) return 'bg-orange-100 text-orange-800'
    return 'bg-blue-100 text-blue-800'
  }

  if (loading) {
    return (
      <DashboardCard
        title="地域分析"
        description="各省份旅游热度分布"
        icon={MapPin}
        iconColor="text-purple-600"
        actionText="查看详情"
        actionHref="/videos/regional"
      >
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title="地域分析"
      description="各省份旅游热度分布"
      icon={MapPin}
      iconColor="text-purple-600"
      actionText="查看详情"
      actionHref="/videos/regional"
    >
      <div className="space-y-4">
        {/* 总体统计 */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
          <div className="text-center">
            <div className="text-xl font-bold text-purple-700 mb-1">
              {stats?.totalProvinces || 0}
            </div>
            <div className="text-xs text-purple-600 font-medium">覆盖省份</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-700 mb-1">
              {stats?.totalMentions?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-purple-600 font-medium">总提及数</div>
          </div>
        </div>

        {/* 热门省份排行 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">热门省份 TOP 5</h4>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats?.growthRate || 0}%
            </div>
          </div>
          
          {stats?.topProvinces.map((province) => (
            <div key={province.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100">
              <div className="flex items-center space-x-3">
                <Badge className={`text-xs font-semibold ${getRankBadgeColor(province.rank)} border-0 shadow-sm`}>
                  #{province.rank}
                </Badge>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {province.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {province.count.toLocaleString()} 次提及
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {province.percentage}%
                  </div>
                  <div className={`text-xs flex items-center justify-end ${getTrendColor(province.trend)}`}>
                    {getTrendIcon(province.trend)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 快速洞察 */}
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-gray-900">热点洞察</span>
          </div>
          <div className="space-y-2 text-xs text-gray-600">
            <p className="flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
              一线城市持续领跑旅游热度
            </p>
            <p className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
              江浙沪地区增长势头强劲
            </p>
            <p className="flex items-center">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
              西部地区旅游关注度上升
            </p>
          </div>
        </div>

        {stats?.topProvinces.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无地域数据</p>
          </div>
        )}
      </div>
    </DashboardCard>
  )
}