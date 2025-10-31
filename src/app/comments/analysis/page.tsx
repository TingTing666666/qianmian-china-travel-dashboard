/*
 * @Date: 2025-09-09 13:52:01
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-09 14:13:39
 * @FilePath: \qianmian-china-travel-dashboard\src\app\comments\analysis\page.tsx
 */
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/progress"
import { commentAnalysisMockData } from "@/data/commentAnalysisMockData"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts'
import { TrendingUp, TrendingDown, MessageSquare, Users, Heart, Share2, Flag, Clock, MapPin, Star } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function CommentAnalysisPage() {
  const data = commentAnalysisMockData

  // 格式化数字显示
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // 情感分析饼图数据
  const sentimentPieData = [
    { name: '正面', value: data.sentimentAnalysis.positive, color: '#10B981' },
    { name: '负面', value: data.sentimentAnalysis.negative, color: '#EF4444' },
    { name: '中性', value: data.sentimentAnalysis.neutral, color: '#6B7280' },
    { name: '复合', value: data.sentimentAnalysis.mixed, color: '#8B5CF6' }
  ]

  // 用户活跃度雷达图数据
  const radarData = [
    { subject: '早晨(6-12)', A: 85, fullMark: 100 },
    { subject: '下午(12-18)', A: 92, fullMark: 100 },
    { subject: '晚上(18-24)', A: 98, fullMark: 100 },
    { subject: '深夜(0-6)', A: 45, fullMark: 100 },
    { subject: '周末', A: 88, fullMark: 100 },
    { subject: '工作日', A: 75, fullMark: 100 }
  ]

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">评论分析</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">实时数据</Badge>
          <Badge variant="secondary">最近30天</Badge>
        </div>
      </div>
      
      {/* 核心指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总评论数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalComments)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% 相比上月
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8.3% 相比上月
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均情感分数</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.sentimentAnalysis.positive.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% 相比上月
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均评论长度</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgCommentLength}字</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -1.2% 相比上月
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 情感分析和热点话题 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>情感分析趋势</CardTitle>
            <CardDescription>过去12个月的情感变化趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.sentimentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.6} />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>情感分布</CardTitle>
            <CardDescription>当前评论情感占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 时间趋势和用户活跃度 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>评论时间趋势</CardTitle>
            <CardDescription>过去12个月评论数量变化</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.timeTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="comments" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>用户活跃度分析</CardTitle>
            <CardDescription>多维度活跃度评估</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="活跃度" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 24小时活跃度和评论长度分布 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>24小时用户活跃度</CardTitle>
            <CardDescription>每小时评论数量和情感分布</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="comments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>评论长度分布</CardTitle>
            <CardDescription>不同长度评论的占比分析</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.commentLengthDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="range" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 地域分析和视频类型分析 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>地域分析</CardTitle>
            <CardDescription>各地区评论数量和情感分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.regionalAnalysis.slice(0, 6).map((region, index) => (
                <div key={region.region} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{region.region}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{formatNumber(region.comments)}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm">{region.sentiment.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>视频类型分析</CardTitle>
            <CardDescription>不同类型视频的评论表现</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={data.videoTypeAnalysis}>
                <CartesianGrid />
                <XAxis dataKey="comments" name="评论数" />
                <YAxis dataKey="avgSentiment" name="平均情感" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="视频类型" dataKey="engagementRate" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 互动分析和关键词情感 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>互动数据分析</CardTitle>
            <CardDescription>各类互动行为统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.interactionAnalysis.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.type === '点赞数' && <Heart className="h-4 w-4 text-red-500" />}
                    {item.type === '回复数' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                    {item.type === '分享数' && <Share2 className="h-4 w-4 text-green-500" />}
                    {item.type === '举报数' && <Flag className="h-4 w-4 text-orange-500" />}
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{formatNumber(item.count)}</span>
                    <Badge variant={item.trend > 0 ? "default" : "destructive"}>
                      {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>关键词情感分析</CardTitle>
            <CardDescription>热门关键词的情感倾向和趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.keywordSentiment.slice(0, 8).map((keyword, index) => (
                <div key={keyword.keyword} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{keyword.keyword}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{formatNumber(keyword.mentions)}</span>
                      <Badge variant={keyword.trend > 0 ? "default" : "destructive"}>
                        {keyword.trend > 0 ? '+' : ''}{keyword.trend.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={keyword.sentiment * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 热门评论 */}
      <Card>
        <CardHeader>
          <CardTitle>热门评论</CardTitle>
          <CardDescription>最受关注的评论内容</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.topComments.map((comment, index) => (
              <div key={comment.id} className="flex space-x-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>{comment.author}</span>
                      <span>{comment.timestamp}</span>
                      <Badge variant="outline">{comment.videoTitle}</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{comment.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{comment.replies}</span>
                      </div>
                      <Badge 
                        variant={
                          comment.sentiment === 'positive' ? 'default' : 
                          comment.sentiment === 'negative' ? 'destructive' : 'secondary'
                        }
                      >
                        {comment.sentiment === 'positive' ? '正面' : 
                         comment.sentiment === 'negative' ? '负面' : '中性'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}