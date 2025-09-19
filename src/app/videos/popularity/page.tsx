"use client"

import { PopularityAnalysis } from "@/components/charts/PopularityAnalysis"

export default function PopularityAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-blue-600">热度分析</h2>
        <p className="text-muted-foreground">
          基于点赞数、评论数和观看次数的视频热度因素统计分析
        </p>
      </div>

      <PopularityAnalysis className="w-full" />
    </div>
  )
}