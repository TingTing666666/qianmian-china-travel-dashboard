/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\comments\data\page.tsx
 */
"use client"

import { CommentDataTable } from "@/components/charts/CommentDataTable"

export default function CommentDataPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-purple-600">评论数据</h2>
        <p className="text-muted-foreground">
          查看和管理所有收集的评论数据，支持情感分析、搜索、筛选和排序功能
        </p>
      </div>

      <CommentDataTable className="w-full" />
    </div>
  )
}