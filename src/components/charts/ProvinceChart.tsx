"use client"

import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'
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
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xl font-semibold">省份提及统计</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-300 text-gray-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xl font-semibold">省份提及统计</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
              重新加载
            </Button>
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
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xl font-semibold">省份提及统计</span>
          </div>
          <div className="flex items-center gap-2">
            <CustomSelect
              value={limit.toString()}
              onValueChange={(value) => handleLimitChange(parseInt(value))}
              options={[
                { value: '10', label: '前10名' },
                { value: '15', label: '前15名' },
                { value: '20', label: '前20名' },
                { value: '30', label: '前30名' }
              ]}
              className="w-24"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className={`transition-opacity duration-300 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
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
                formatter={(value) => [value, '提及次数']}
                labelFormatter={(label) => `省份: ${label}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="mentions" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}