"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

export default function VideoDataPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">视频数据</h2>
        <p className="text-muted-foreground">
          查看和管理所有收集的视频数据
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>数据表格</CardTitle>
          <CardDescription>
            视频数据的详细列表和搜索功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-muted-foreground">数据表格将在这里显示</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}