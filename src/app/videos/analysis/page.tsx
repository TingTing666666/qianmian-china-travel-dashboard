"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

export default function VideoAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">视频分析</h2>
        <p className="text-muted-foreground">
          分析视频内容、表现指标和观众互动数据
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>分析功能</CardTitle>
          <CardDescription>
            这里将展示视频分析的各种图表和洞察
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-muted-foreground">分析图表将在这里显示</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}