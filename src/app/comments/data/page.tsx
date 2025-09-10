/*
 * @Date: 2025-09-09 13:52:01
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-09 14:13:31
 * @FilePath: \qianmian-china-travel-dashboard\src\app\comments\data\page.tsx
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Search, Filter, Download } from "lucide-react"

export default function CommentDataPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">评论数据</h2>
          <p className="text-muted-foreground">
            管理和查看所有收集的评论数据
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            搜索
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>评论列表</CardTitle>
          <CardDescription>
            所有评论的详细信息，支持搜索和筛选
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">评论数据表格</p>
              <p className="text-sm text-muted-foreground">
                包含评论内容、时间、情感评分、关键词等信息
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}