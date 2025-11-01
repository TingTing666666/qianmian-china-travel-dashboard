"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Share2, TrendingUp, TrendingDown, Users, MapPin, Heart, MessageCircle, Eye, Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import Link from "next/link"

// 模拟数据
const videoPerformanceData = [
  { month: "2023-09", views: 1200000, comments: 8500, likes: 45000 },
  { month: "2023-10", views: 1350000, comments: 9200, likes: 52000 },
  { month: "2023-11", views: 1580000, comments: 11000, likes: 68000 },
  { month: "2023-12", views: 1820000, comments: 13500, likes: 78000 },
  { month: "2024-01", views: 2100000, comments: 15800, likes: 89000 }
]

const sentimentData = [
  { name: "正面", value: 68.5, color: "#10B981" },
  { name: "中性", value: 23.2, color: "#6B7280" },
  { name: "负面", value: 8.3, color: "#EF4444" }
]

const regionalData = [
  { region: "华东", views: 580000, engagement: 8.2 },
  { region: "华南", views: 520000, engagement: 7.8 },
  { region: "华北", views: 480000, engagement: 7.5 },
  { region: "西南", views: 320000, engagement: 9.1 },
  { region: "华中", views: 280000, engagement: 7.2 },
  { region: "东北", views: 180000, engagement: 6.8 },
  { region: "西北", views: 140000, engagement: 8.5 }
]

const contentTypeData = [
  { type: "美食探索", views: 650000, avgDuration: 4.2 },
  { type: "自然风光", views: 580000, avgDuration: 5.8 },
  { type: "历史文化", views: 420000, avgDuration: 6.1 },
  { type: "城市漫游", views: 380000, avgDuration: 3.9 },
  { type: "民俗体验", views: 270000, avgDuration: 5.2 }
]

export default function ComprehensiveAnalysisReport() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 头部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai/reports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回报告列表
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">2024年1月旅游数据综合分析报告</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="default">已完成</Badge>
              <Badge variant="outline">综合分析</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                生成时间: 2024-01-15
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            分享
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出PDF
          </Button>
        </div>
      </div>

      {/* 执行摘要 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📊 执行摘要</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">核心发现</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• 2024年1月总播放量达到210万次，同比增长35.2%，环比增长15.4%</li>
              <li>• 用户评论情感正面率达68.5%，创历史新高，用户满意度显著提升</li>
              <li>• 华东地区用户参与度最高，西南地区虽用户基数较小但互动率领先</li>
              <li>• 美食探索类内容表现突出，成为平台增长的主要驱动力</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">210万</div>
              <div className="text-sm text-green-700">总播放量</div>
              <div className="text-xs text-green-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +15.4%
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15.8K</div>
              <div className="text-sm text-blue-700">用户评论</div>
              <div className="text-xs text-blue-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +17.0%
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">68.5%</div>
              <div className="text-sm text-purple-700">正面情感</div>
              <div className="text-xs text-purple-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +3.2%
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.8分</div>
              <div className="text-sm text-orange-700">平均评分</div>
              <div className="text-xs text-orange-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +0.3
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 视频表现分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📈 视频表现趋势分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={videoPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={3} name="播放量" />
                <Line type="monotone" dataKey="comments" stroke="#10B981" strokeWidth={2} name="评论数" />
                <Line type="monotone" dataKey="likes" stroke="#F59E0B" strokeWidth={2} name="点赞数" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">📋 关键洞察与建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">✅ 积极趋势</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 播放量呈现稳定上升趋势，增长动能强劲</li>
                  <li>• 用户互动率持续提升，社区活跃度高</li>
                  <li>• 内容质量获得用户认可，复播率达到32%</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">⚠️ 优化建议</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• 加强内容更新频率，保持用户粘性</li>
                  <li>• 优化视频标题和封面，提升点击率</li>
                  <li>• 增加互动环节，促进用户参与度</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 用户情感分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">💭 用户情感分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {sentimentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🎯 情感分析洞察</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>用户满意度</span>
                  <span>68.5%</span>
                </div>
                <Progress value={68.5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>内容质量评价</span>
                  <span>72.3%</span>
                </div>
                <Progress value={72.3} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>推荐意愿</span>
                  <span>65.8%</span>
                </div>
                <Progress value={65.8} className="h-2" />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🔍 深度分析</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                用户情感分析显示，68.5%的评论呈现正面情感，这表明我们的内容质量得到了用户的广泛认可。
                特别是在美食探索和自然风光类内容中，正面情感比例更是高达75%以上。
                建议继续加强这两个领域的内容创作，同时关注负面反馈中提到的画质和音效问题。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 地域分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🗺️ 地域分布与参与度分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3B82F6" name="播放量" />
                <Bar dataKey="engagement" fill="#10B981" name="参与度" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">📊 地域表现排名</h3>
              <div className="space-y-2">
                {regionalData.slice(0, 5).map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{(region.views / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-muted-foreground">{region.engagement}%参与度</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">💡 地域策略建议</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm">华东地区 - 重点维护</h4>
                  <p className="text-xs text-green-800 mt-1">
                    作为最大的用户群体，建议增加华东地区特色内容，如江南水乡、上海都市风光等主题。
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">西南地区 - 潜力挖掘</h4>
                  <p className="text-xs text-blue-800 mt-1">
                    虽然用户基数较小，但参与度最高(9.1%)，建议加大推广力度，挖掘增长潜力。
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-900 text-sm">东北/西北 - 待开发</h4>
                  <p className="text-xs text-yellow-800 mt-1">
                    用户基数和参与度都有提升空间，建议制作更多当地特色内容吸引用户。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 内容类型分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🎬 内容类型表现分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="播放量" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">🎯 内容策略建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">🍜 美食探索</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p>• 表现最佳，播放量65万次</p>
                  <p>• 平均观看时长4.2分钟</p>
                  <p>• 建议：增加互动元素，如美食制作教程</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🏔️ 自然风光</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• 观看时长最长，5.8分钟</p>
                  <p>• 用户沉浸度高</p>
                  <p>• 建议：结合季节性内容，提升时效性</p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🏛️ 历史文化</h4>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>• 深度内容，观看时长6.1分钟</p>
                  <p>• 用户忠诚度高</p>
                  <p>• 建议：增加专家解读，提升权威性</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 行动计划 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🚀 下月行动计划</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">短期目标 (2月)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">内容优化</h4>
                    <p className="text-sm text-blue-800">重点制作美食探索类内容，目标增长20%播放量</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">地域拓展</h4>
                    <p className="text-sm text-blue-800">加强西南地区内容推广，提升用户基数</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">用户互动</h4>
                    <p className="text-sm text-blue-800">增加评论回复率，提升用户满意度至70%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-green-600">中期规划 (3-6月)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-green-900">技术升级</h4>
                    <p className="text-sm text-green-800">优化视频画质和音效，解决用户反馈问题</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-green-900">内容多样化</h4>
                    <p className="text-sm text-green-800">开发新的内容类型，如VR体验、直播互动</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-green-900">数据驱动</h4>
                    <p className="text-sm text-green-800">建立更完善的数据分析体系，实现精准推荐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 报告结论 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📝 报告结论</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">总体评估</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              2024年1月的数据表现超出预期，各项核心指标均呈现积极增长态势。用户对内容质量的认可度持续提升，
              特别是在美食探索和自然风光类内容方面表现突出。地域分布呈现明显的集中化特征，华东地区用户占主导地位，
              但西南地区的高参与度显示了巨大的增长潜力。
            </p>
            <p className="text-gray-700 leading-relaxed">
              建议在保持现有优势内容的基础上，加强地域拓展和用户互动，同时关注技术优化和内容多样化发展。
              通过数据驱动的精准运营，预计2024年第一季度整体表现将继续保持强劲增长势头。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}