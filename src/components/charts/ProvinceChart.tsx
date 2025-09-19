"use client"

import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RefreshCw, BarChart3 } from 'lucide-react'
import { ProvinceMention } from '@/types/province'

interface ProvinceChartProps {
  limit?: number
}

export function ProvinceChart({ limit: initialLimit = 8 }: ProvinceChartProps) {
  const [data, setData] = useState<ProvinceMention[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(initialLimit)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setError(null)
      // 添加时间戳避免缓存
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/provinces?limit=${limit}&t=${timestamp}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || '获取数据失败')
      }
    } catch (err) {
      setError('网络请求失败')
      console.error('获取省份数据失败:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 手动刷新
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
  }

  // 改变显示数量
  const handleLimitChange = async (newLimit: number) => {
    setLimit(newLimit)
  }

  useEffect(() => {
    fetchData()
  }, [limit])

  if (loading && !refreshing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>省份提及统计</CardTitle>
            <CardDescription>各省份在视频内容中的提及次数</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>省份提及统计</CardTitle>
            <CardDescription>各省份在视频内容中的提及次数</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">错误: {error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl font-semibold">省份提及统计</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* 显示数量选择 */}
            <div className="flex items-center gap-1">
              {[5, 10, 15, 500].map((num) => (
                <Button
                  key={num}
                  variant={limit === num ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLimitChange(num)}
                  className="text-xs px-2 py-1 h-7"
                >
                  {num}
                </Button>
              ))}
            </div>
            
            {/* 刷新按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              title="刷新数据"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          各省份在视频内容中的提及次数 (Top {data.length})
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <div className={`w-full transition-opacity duration-300 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="province" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="mentions" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}