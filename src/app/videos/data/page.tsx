"use client"

import { VideoDataTable } from "@/components/charts/VideoDataTable"

export default function VideoDataPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-blue-600">视频数据</h2>
        <p className="text-muted-foreground">
          查看和管理所有收集的视频数据，支持搜索、筛选和排序功能
        </p>
      </div>

      <VideoDataTable className="w-full" />
    </div>
  )
}