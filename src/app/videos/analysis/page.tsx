"use client"

import { VideoAnalysisTabs } from "@/components/charts/VideoAnalysisTabs"

export default function VideoAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-blue-600">视频分析</h2>
        <p className="text-muted-foreground">
          深入分析视频发布趋势、时间分布和内容表现指标
        </p>
      </div>

      <VideoAnalysisTabs className="w-full" />
    </div>
  )
}