/*
 * @Date: 2025-09-09 13:43:50
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-09 14:11:36
 * @FilePath: \qianmian-china-travel-dashboard\src\app\videos\page.tsx
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { BarChart, PieChart, TrendingUp } from "lucide-react"

export default function VideosPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">视频看板</h2>
        <div className="flex items-center space-x-2">
          <Button>刷新数据</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              视频分析
            </CardTitle>
            <CardDescription>深入分析视频内容和表现</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              查看详细的视频分析报告和趋势
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              视频数据
            </CardTitle>
            <CardDescription>原始视频数据和统计信息</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              浏览和管理视频数据库
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              趋势报告
            </CardTitle>
            <CardDescription>即将推出</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              视频趋势分析和预测功能正在开发中
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}