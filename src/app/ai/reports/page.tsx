"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart } from "lucide-react"

export default function AIReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI分析报告</h1>
          <p className="text-muted-foreground">查看和管理AI生成的数据分析报告</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          生成新报告
        </Button>
      </div>

      <div className="grid gap-6">
        {/* 报告列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              最新报告
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "2024年1月旅游数据综合分析报告",
                  description: "包含视频播放量、用户评论情感分析、地域分布等多维度数据分析",
                  date: "2024-01-15",
                  status: "已完成",
                  type: "综合分析"
                },
                {
                  title: "热门旅游目的地趋势报告",
                  description: "基于用户行为和内容偏好分析的旅游热点预测",
                  date: "2024-01-10", 
                  status: "已完成",
                  type: "趋势预测"
                },
                {
                  title: "用户画像与偏好分析",
                  description: "深度分析用户群体特征和内容偏好模式",
                  date: "2024-01-05",
                  status: "生成中",
                  type: "用户分析"
                }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{report.title}</h3>
                      <Badge variant={report.status === "已完成" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      查看
                    </Button>
                    {report.status === "已完成" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 报告统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">总报告数</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">本月生成</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <PieChart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-sm text-muted-foreground">准确率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}