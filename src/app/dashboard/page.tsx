"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Activity, Video, MessageCircle, TrendingUp } from "lucide-react"
import { useState, useEffect } from 'react';

// 模拟数据
const metrics = [
  {
    title: "总视频数",
    value: "1,284",
    change: "+12%",
    changeType: "increase" as const,
    icon: Video,
    description: "相比上月",
  },
  {
    title: "总评论数",
    value: "45,231",
    change: "+8%",
    changeType: "increase" as const,
    icon: MessageCircle,
    description: "相比上月",
  },
  {
    title: "活跃频道",
    value: "156",
    change: "+3%",
    changeType: "increase" as const,
    icon: Activity,
    description: "相比上月",
  },
  {
    title: "热门趋势",
    value: "23",
    change: "+5%",
    changeType: "increase" as const,
    icon: TrendingUp,
    description: "新增话题",
  },
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('zh-CN'));
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">数据概览</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            最后更新: {currentTime || '加载中...'}
          </span>
        </div>
      </div>

      {/* 指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{metric.change}</span> {metric.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 主要内容区域 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">        
        {/* 最近活动 */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>
              系统最新的数据处理和分析活动
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">新增1,023个视频分析</p>
                  <p className="text-xs text-muted-foreground">5分钟前</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">评论情感分析完成</p>
                  <p className="text-xs text-muted-foreground">12分钟前</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">数据同步任务开始</p>
                  <p className="text-xs text-muted-foreground">1小时前</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速统计 */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>今日统计</CardTitle>
            <CardDescription>
              今天的数据处理情况
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">已处理视频</span>
                <span className="text-sm font-medium">128</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">分析评论</span>
                <span className="text-sm font-medium">3,245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">检测趋势</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">异常监控</span>
                <span className="text-sm font-medium text-green-600">正常</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}