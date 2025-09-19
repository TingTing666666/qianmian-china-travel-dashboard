"use client"

import { ProvinceChart } from "@/components/charts/ProvinceChart"
import { ChinaMap } from "@/components/charts/ChinaMap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

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
        <ProvinceChart limit={15} />
        <ChinaMap />
      </div>

      {/* 分析说明 */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">分析说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            <p>
              地域分析基于YouTube视频标题、描述和字幕中的省份提及数据，通过统计图表和地理热力图展示不同地区在中国旅游内容中的热度和关注度分布，帮助识别热门旅游目的地和地域偏好趋势。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}