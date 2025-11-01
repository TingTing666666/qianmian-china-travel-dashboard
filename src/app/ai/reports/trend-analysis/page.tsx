"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Share2, TrendingUp, TrendingDown, MapPin, Star, Calendar, Thermometer, Users2, Camera } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, AreaChart, Area } from "recharts"
import Link from "next/link"

// 趋势预测数据
const destinationTrends = [
  { destination: "三亚", current: 85, predicted: 92, growth: 8.2, season: "春季热门" },
  { destination: "西安", current: 78, predicted: 88, growth: 12.8, season: "文化旅游" },
  { destination: "成都", current: 82, predicted: 87, growth: 6.1, season: "美食之都" },
  { destination: "杭州", current: 75, predicted: 85, growth: 13.3, season: "江南春色" },
  { destination: "青岛", current: 68, predicted: 82, growth: 20.6, season: "海滨度假" },
  { destination: "桂林", current: 72, predicted: 80, growth: 11.1, season: "山水画廊" },
  { destination: "厦门", current: 70, predicted: 78, growth: 11.4, season: "海岛风情" },
  { destination: "丽江", current: 65, predicted: 75, growth: 15.4, season: "古城文化" }
]

const seasonalTrends = [
  { month: "2月", 春游: 45, 海滨: 25, 文化: 60, 美食: 70 },
  { month: "3月", 春游: 75, 海滨: 30, 文化: 65, 美食: 72 },
  { month: "4月", 春游: 90, 海滨: 40, 文化: 70, 美食: 68 },
  { month: "5月", 春游: 85, 海滨: 60, 文化: 65, 美食: 65 },
  { month: "6月", 春游: 70, 海滨: 85, 文化: 55, 美食: 60 },
  { month: "7月", 春游: 60, 海滨: 95, 文化: 50, 美食: 58 }
]

const userBehaviorData = [
  { behavior: "提前规划", value: 78, trend: "上升" },
  { behavior: "即兴出行", value: 45, trend: "下降" },
  { behavior: "深度游", value: 68, trend: "上升" },
  { behavior: "打卡游", value: 82, trend: "稳定" },
  { behavior: "亲子游", value: 72, trend: "上升" },
  { behavior: "独自旅行", value: 38, trend: "上升" }
]

const contentPreferences = [
  { type: "美食探店", popularity: 92, engagement: 8.5 },
  { type: "自然风光", popularity: 88, engagement: 7.8 },
  { type: "历史文化", popularity: 75, engagement: 9.2 },
  { type: "城市漫游", popularity: 82, engagement: 6.9 },
  { type: "民俗体验", popularity: 68, engagement: 8.1 },
  { type: "极限运动", popularity: 45, engagement: 9.8 }
]

const emergingDestinations = [
  { name: "阿勒泰", score: 85, reason: "冰雪旅游兴起", potential: "极高" },
  { name: "德宏", score: 78, reason: "边境风情", potential: "高" },
  { name: "伊犁", score: 82, reason: "草原花海", potential: "极高" },
  { name: "甘南", score: 75, reason: "藏族文化", potential: "高" },
  { name: "恩施", score: 80, reason: "地质奇观", potential: "极高" }
]

export default function TrendAnalysisReport() {
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
            <h1 className="text-3xl font-bold">热门旅游目的地趋势报告</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="default">已完成</Badge>
              <Badge variant="outline">趋势预测</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                生成时间: 2024-01-10
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

      {/* 趋势概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🔮 趋势预测概览</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">核心预测</h3>
            <ul className="space-y-2 text-purple-800">
              <li>• 2024年春季旅游市场将迎来强劲复苏，预计整体增长15-20%</li>
              <li>• 青岛、杭州等目的地增长潜力巨大，预测增长率超过20%</li>
              <li>• 深度游和文化体验成为新趋势，用户偏好明显转变</li>
              <li>• 新兴目的地崛起，阿勒泰、伊犁等地成为热门选择</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">🔥</div>
              <div className="text-lg font-bold text-red-600">热门上升</div>
              <div className="text-sm text-red-700">青岛 +20.6%</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">⭐</div>
              <div className="text-lg font-bold text-blue-600">稳定热门</div>
              <div className="text-sm text-blue-700">三亚 92分</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">🌟</div>
              <div className="text-lg font-bold text-green-600">新兴目的地</div>
              <div className="text-sm text-green-700">阿勒泰 85分</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">📈</div>
              <div className="text-lg font-bold text-purple-600">增长预期</div>
              <div className="text-sm text-purple-700">整体 +17%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 目的地热度排行 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🏆 目的地热度与增长预测</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={destinationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="destination" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#94A3B8" name="当前热度" />
                <Bar dataKey="predicted" fill="#3B82F6" name="预测热度" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">📊 热度排行榜</h3>
              <div className="space-y-2">
                {destinationTrends.slice(0, 5).map((dest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-medium">{dest.destination}</div>
                        <div className="text-xs text-muted-foreground">{dest.season}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{dest.predicted}分</div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{dest.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">🎯 增长潜力分析</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🚀 高增长潜力</h4>
                  <p className="text-sm text-green-800 mb-2">青岛(+20.6%)、丽江(+15.4%)、杭州(+13.3%)</p>
                  <p className="text-xs text-green-700">
                    这些目的地受益于季节性因素和政策支持，预计将迎来显著增长。
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">⭐ 稳定热门</h4>
                  <p className="text-sm text-blue-800 mb-2">三亚(92分)、成都(87分)、西安(88分)</p>
                  <p className="text-xs text-blue-700">
                    传统热门目的地保持稳定增长，基础设施完善，用户认知度高。
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">💡 营销建议</h4>
                  <p className="text-xs text-yellow-800">
                    重点推广高增长潜力目的地，结合季节性营销策略，提升用户关注度。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 季节性趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🌸 季节性旅游趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="春游" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="海滨" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="文化" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" dataKey="美食" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">📅 季节性洞察</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Thermometer className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">春季旅游(3-5月)</h4>
                    <p className="text-sm text-green-800">赏花踏青成为主流，4月达到峰值</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">海滨度假(6-8月)</h4>
                    <p className="text-sm text-blue-800">夏季海滨旅游需求激增，7月最热</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-900">文化旅游</h4>
                    <p className="text-sm text-yellow-800">全年稳定，春季略有上升</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">🎯 营销时机建议</h3>
              <div className="space-y-2">
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium text-green-900">2-3月</h4>
                  <p className="text-sm text-green-800">春游预热期，重点推广赏花目的地</p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium text-blue-900">4-5月</h4>
                  <p className="text-sm text-blue-800">春游高峰期，全面推广各类目的地</p>
                </div>
                <div className="p-3 border-l-4 border-red-500 bg-red-50">
                  <h4 className="font-medium text-red-900">5-6月</h4>
                  <p className="text-sm text-red-800">夏季预热，开始推广海滨度假</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 用户行为趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">👥 用户行为趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBehaviorData.map((behavior, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{behavior.behavior}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold">{behavior.value}%</div>
                      <div className={`text-xs flex items-center gap-1 ${
                        behavior.trend === '上升' ? 'text-green-600' : 
                        behavior.trend === '下降' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {behavior.trend === '上升' ? <TrendingUp className="h-3 w-3" /> : 
                         behavior.trend === '下降' ? <TrendingDown className="h-3 w-3" /> : null}
                        {behavior.trend}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🔍 行为洞察</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                用户旅游行为呈现明显变化：提前规划和深度游趋势上升，反映出用户对旅游品质的更高要求。
                亲子游和独自旅行的增长显示了市场细分化趋势。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">📱 内容偏好分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={contentPreferences}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="popularity" name="受欢迎度" />
                  <YAxis dataKey="engagement" name="参与度" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="engagement" fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {contentPreferences.map((content, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-gray-500" />
                    <span>{content.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-600">{content.popularity}%</span>
                    <span className="text-green-600">{content.engagement}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 新兴目的地 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🌟 新兴目的地发现</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {emergingDestinations.map((dest, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{dest.name}</h3>
                  <Badge variant={dest.potential === '极高' ? 'default' : 'secondary'}>
                    {dest.potential}潜力
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>热度评分</span>
                    <span className="font-medium">{dest.score}分</span>
                  </div>
                  <Progress value={dest.score} className="h-2" />
                  <p className="text-sm text-muted-foreground">{dest.reason}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">🚀 新兴目的地策略建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-900 mb-2">📈 推广策略</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 重点推广阿勒泰和伊犁的自然风光</li>
                  <li>• 结合季节性特色制作专题内容</li>
                  <li>• 邀请KOL实地探访，增加曝光度</li>
                  <li>• 与当地旅游局合作，获得官方支持</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">🎯 内容重点</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 突出独特的地理和文化特色</li>
                  <li>• 制作高质量的风光摄影内容</li>
                  <li>• 分享当地美食和民俗体验</li>
                  <li>• 提供详细的旅游攻略和建议</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 预测模型与建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🔮 AI预测模型与建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-purple-600">预测准确性</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>短期预测(1-3个月)</span>
                  <span className="font-bold text-green-600">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>中期预测(3-6个月)</span>
                  <span className="font-bold text-blue-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>长期预测(6-12个月)</span>
                  <span className="font-bold text-yellow-600">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-green-600">关键成功因素</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">季节性因素权重: 35%</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">用户行为变化: 28%</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">内容质量影响: 22%</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">外部环境因素: 15%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">📋 执行建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">即时行动</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• 加强青岛、杭州内容制作</li>
                  <li>• 启动春季旅游营销活动</li>
                  <li>• 优化新兴目的地推广</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">中期规划</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 建立目的地合作伙伴关系</li>
                  <li>• 开发深度游产品线</li>
                  <li>• 完善用户画像分析</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">长期战略</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 构建智能推荐系统</li>
                  <li>• 拓展国际旅游市场</li>
                  <li>• 建立行业标准和影响力</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 报告总结 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📝 报告总结</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">🎯 核心结论</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              基于AI模型分析和大数据挖掘，2024年旅游市场将呈现明显的复苏和增长态势。传统热门目的地保持稳定增长的同时，
              新兴目的地正在快速崛起。用户行为向深度游和品质游转变，对内容的要求也越来越高。
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              季节性因素仍然是影响旅游趋势的重要变量，春季旅游和夏季海滨度假将成为主要增长点。
              建议平台重点关注高增长潜力目的地，同时加强新兴目的地的内容建设和推广力度。
            </p>
            <div className="bg-white p-4 rounded-lg mt-4">
              <h4 className="font-medium text-gray-900 mb-2">🚀 预期成果</h4>
              <p className="text-sm text-gray-700">
                通过实施本报告建议，预计2024年第二季度平台整体流量将增长25-30%，
                用户参与度提升15%，新兴目的地内容播放量增长50%以上。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}