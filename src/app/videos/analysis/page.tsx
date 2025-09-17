"use client"

import { TimeSeriesAnalysis } from "@/components/charts/TimeSeriesAnalysis"

export default function VideoAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-blue-600">时序分析</h2>
        <p className="text-muted-foreground">
          深入分析视频发布的时间序列数据，包括趋势变化和时间分布模式
        </p>
      </div>

      <TimeSeriesAnalysis className="w-full" />
    </div>
  )
}