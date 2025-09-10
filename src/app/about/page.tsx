"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Database, BarChart, Brain, Video } from "lucide-react"

const features = [
  {
    icon: Video,
    title: "视频数据收集",
    description: "自动抓取中国旅游相关YouTube视频数据，包括标题、描述、统计信息等"
  },
  {
    icon: Database,
    title: "内容分析处理",
    description: "提取视频字幕，进行自然语言处理，识别旅游地点、景点、活动等信息"
  },
  {
    icon: Brain,
    title: "AI智能分析",
    description: "运用机器学习算法分析视频内容趋势，预测热门旅游目的地"
  },
  {
    icon: BarChart,
    title: "数据可视化",
    description: "提供直观的图表和报告，帮助理解中国旅游市场动态"
  }
]

export default function AboutPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* 页面头部 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">项目简介</h1>
        <p className="text-muted-foreground">
          了解千面中国游数据库的功能特性和技术架构
        </p>
      </div>

      {/* 项目概述 */}
      <Card>
        <CardHeader>
          <CardTitle>关于千面中国游数据库</CardTitle>
          <CardDescription>
            一个专注于中国旅游内容分析的智能数据平台
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            千面中国游数据库是一个基于YouTube视频内容的中国旅游数据分析平台。
            我们通过自动化数据收集、内容分析和AI技术，为用户提供深入的旅游市场洞察。
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">视频分析</Badge>
            <Badge variant="secondary">内容挖掘</Badge>
            <Badge variant="secondary">趋势预测</Badge>
            <Badge variant="secondary">数据可视化</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 核心功能 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">核心功能</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 技术栈 */}
      <Card>
        <CardHeader>
          <CardTitle>技术架构</CardTitle>
          <CardDescription>
            项目采用现代化的技术栈，确保高性能和可扩展性
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">前端技术</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• React 18 + Next.js 框架</p>
                <p>• TypeScript 类型安全</p>
                <p>• Tailwind CSS 样式系统</p>
                <p>• Recharts 数据可视化</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">后端技术</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Python FastAPI 框架</p>
                <p>• PostgreSQL 数据库</p>
                <p>• Redis 缓存系统</p>
                <p>• WebSocket 实时通信</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}