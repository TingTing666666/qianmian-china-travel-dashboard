"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { ProvinceChart } from "@/components/charts/ProvinceChart"
import { ChinaMap } from "@/components/charts/ChinaMap"
import { MapPin, BarChart3 } from "lucide-react"

export default function RegionalAnalysisPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">地域分析</h2>
          <p className="text-muted-foreground">
            基于视频内容的中国省份地域分布分析
          </p>
        </div>
      </div>

      {/* 地域分析图表 */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* 省份提及统计 - Card格式优化 */}
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xl font-semibold">省份提及统计</span>
              </div>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              各省份在视频内容中的提及次数排行
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ProvinceChart limit={15} />
          </CardContent>
        </Card>

        {/* 中国省份热力图 - Card格式优化 */}
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg mr-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xl font-semibold">中国省份热力图</span>
              </div>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              基于YouTube视频内容的省份提及频次地理分布
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChinaMap />
          </CardContent>
        </Card>
      </div>

      {/* 分析说明 */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">分析说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">省份提及统计</h4>
              <p className="text-sm text-gray-600">
                统计各省份在YouTube视频标题、描述和字幕中的提及次数，反映不同地区在中国旅游内容中的热度和关注度。
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">热力图分析</h4>
              <p className="text-sm text-gray-600">
                通过地理热力图直观展示各省份的提及频次分布，颜色深浅代表提及次数多少，帮助识别热门旅游目的地。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}