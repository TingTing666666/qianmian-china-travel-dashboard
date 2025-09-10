/*
 * @Date: 2025-09-09 13:52:01
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-09 14:13:39
 * @FilePath: \qianmian-china-travel-dashboard\src\app\comments\analysis\page.tsx
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

export default function CommentAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">评论分析</h2>
        <p className="text-muted-foreground">
          分析评论情感、挖掘热点话题和用户行为模式
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>情感分析</CardTitle>
            <CardDescription>评论情感倾向分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-muted-foreground">情感分析图表</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>热点话题</CardTitle>
            <CardDescription>讨论最多的话题</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-muted-foreground">话题词云图</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>时间趋势</CardTitle>
          <CardDescription>评论活跃度随时间的变化</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-muted-foreground">时间趋势图表</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}