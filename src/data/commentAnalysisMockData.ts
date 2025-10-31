// 评论分析模拟数据
export interface CommentAnalysisData {
  // 基础统计
  totalComments: number
  totalUsers: number
  avgCommentsPerVideo: number
  avgCommentLength: number
  
  // 情感分析数据
  sentimentAnalysis: {
    positive: number
    negative: number
    neutral: number
    mixed: number
  }
  
  // 时间趋势数据
  timeTrends: Array<{
    date: string
    comments: number
    sentiment: number // -1到1之间，负数表示负面，正数表示正面
    engagement: number
  }>
  
  // 热点话题词云数据
  topicWords: Array<{
    text: string
    value: number
    category: string
  }>
  
  // 用户活跃度分析
  userActivity: Array<{
    hour: number
    comments: number
    avgSentiment: number
  }>
  
  // 评论长度分布
  commentLengthDistribution: Array<{
    range: string
    count: number
    percentage: number
  }>
  
  // 地域分析
  regionalAnalysis: Array<{
    region: string
    comments: number
    sentiment: number
    topTopics: string[]
  }>
  
  // 视频类型评论分析
  videoTypeAnalysis: Array<{
    type: string
    comments: number
    avgSentiment: number
    engagementRate: number
  }>
  
  // 评论互动分析
  interactionAnalysis: Array<{
    type: string
    count: number
    trend: number // 相比上期的变化百分比
  }>
  
  // 热门评论
  topComments: Array<{
    id: string
    content: string
    likes: number
    replies: number
    sentiment: 'positive' | 'negative' | 'neutral'
    videoTitle: string
    author: string
    timestamp: string
  }>
  
  // 情感变化趋势
  sentimentTrends: Array<{
    month: string
    positive: number
    negative: number
    neutral: number
  }>
  
  // 关键词情感分析
  keywordSentiment: Array<{
    keyword: string
    mentions: number
    sentiment: number
    trend: number
  }>
}

export const commentAnalysisMockData: CommentAnalysisData = {
  totalComments: 156789,
  totalUsers: 45623,
  avgCommentsPerVideo: 234,
  avgCommentLength: 67,
  
  sentimentAnalysis: {
    positive: 68.5,
    negative: 12.3,
    neutral: 16.8,
    mixed: 2.4
  },
  
  timeTrends: [
    { date: '2024-01', comments: 8234, sentiment: 0.65, engagement: 78 },
    { date: '2024-02', comments: 9156, sentiment: 0.72, engagement: 82 },
    { date: '2024-03', comments: 11234, sentiment: 0.58, engagement: 75 },
    { date: '2024-04', comments: 13567, sentiment: 0.69, engagement: 88 },
    { date: '2024-05', comments: 15234, sentiment: 0.74, engagement: 91 },
    { date: '2024-06', comments: 17890, sentiment: 0.71, engagement: 89 },
    { date: '2024-07', comments: 19456, sentiment: 0.68, engagement: 85 },
    { date: '2024-08', comments: 21234, sentiment: 0.73, engagement: 93 },
    { date: '2024-09', comments: 18967, sentiment: 0.66, engagement: 87 },
    { date: '2024-10', comments: 16789, sentiment: 0.70, engagement: 84 },
    { date: '2024-11', comments: 14567, sentiment: 0.67, engagement: 81 },
    { date: '2024-12', comments: 12345, sentiment: 0.69, engagement: 86 }
  ],
  
  topicWords: [
    { text: '美食', value: 2456, category: '旅游体验' },
    { text: '风景', value: 2234, category: '自然景观' },
    { text: '文化', value: 1987, category: '文化体验' },
    { text: '历史', value: 1876, category: '文化体验' },
    { text: '购物', value: 1654, category: '旅游体验' },
    { text: '交通', value: 1543, category: '基础设施' },
    { text: '住宿', value: 1432, category: '旅游体验' },
    { text: '价格', value: 1321, category: '经济因素' },
    { text: '服务', value: 1234, category: '服务质量' },
    { text: '推荐', value: 1123, category: '推荐建议' },
    { text: '体验', value: 1098, category: '旅游体验' },
    { text: '景点', value: 987, category: '自然景观' },
    { text: '导游', value: 876, category: '服务质量' },
    { text: '安全', value: 765, category: '安全保障' },
    { text: '便民', value: 654, category: '基础设施' },
    { text: '特色', value: 543, category: '地方特色' },
    { text: '传统', value: 432, category: '文化体验' },
    { text: '现代', value: 321, category: '现代化' },
    { text: '环境', value: 298, category: '环境质量' },
    { text: '设施', value: 276, category: '基础设施' }
  ],
  
  userActivity: [
    { hour: 0, comments: 234, avgSentiment: 0.45 },
    { hour: 1, comments: 156, avgSentiment: 0.42 },
    { hour: 2, comments: 98, avgSentiment: 0.38 },
    { hour: 3, comments: 67, avgSentiment: 0.35 },
    { hour: 4, comments: 45, avgSentiment: 0.33 },
    { hour: 5, comments: 78, avgSentiment: 0.41 },
    { hour: 6, comments: 234, avgSentiment: 0.58 },
    { hour: 7, comments: 456, avgSentiment: 0.65 },
    { hour: 8, comments: 678, avgSentiment: 0.72 },
    { hour: 9, comments: 789, avgSentiment: 0.75 },
    { hour: 10, comments: 890, avgSentiment: 0.78 },
    { hour: 11, comments: 934, avgSentiment: 0.76 },
    { hour: 12, comments: 1123, avgSentiment: 0.74 },
    { hour: 13, comments: 1234, avgSentiment: 0.73 },
    { hour: 14, comments: 1345, avgSentiment: 0.71 },
    { hour: 15, comments: 1456, avgSentiment: 0.69 },
    { hour: 16, comments: 1567, avgSentiment: 0.67 },
    { hour: 17, comments: 1678, avgSentiment: 0.65 },
    { hour: 18, comments: 1789, avgSentiment: 0.68 },
    { hour: 19, comments: 1890, avgSentiment: 0.70 },
    { hour: 20, comments: 1987, avgSentiment: 0.72 },
    { hour: 21, comments: 1876, avgSentiment: 0.74 },
    { hour: 22, comments: 1654, avgSentiment: 0.71 },
    { hour: 23, comments: 1234, avgSentiment: 0.68 }
  ],
  
  commentLengthDistribution: [
    { range: '1-10字', count: 23456, percentage: 15.0 },
    { range: '11-30字', count: 45678, percentage: 29.1 },
    { range: '31-50字', count: 34567, percentage: 22.0 },
    { range: '51-100字', count: 28901, percentage: 18.4 },
    { range: '101-200字', count: 15678, percentage: 10.0 },
    { range: '200字以上', count: 8509, percentage: 5.5 }
  ],
  
  regionalAnalysis: [
    { region: '北京', comments: 15678, sentiment: 0.72, topTopics: ['故宫', '长城', '美食'] },
    { region: '上海', comments: 14567, sentiment: 0.68, topTopics: ['外滩', '购物', '现代化'] },
    { region: '广东', comments: 13456, sentiment: 0.70, topTopics: ['粤菜', '商业', '文化'] },
    { region: '浙江', comments: 12345, sentiment: 0.74, topTopics: ['西湖', '江南', '风景'] },
    { region: '江苏', comments: 11234, sentiment: 0.69, topTopics: ['园林', '历史', '文化'] },
    { region: '四川', comments: 10123, sentiment: 0.76, topTopics: ['火锅', '熊猫', '美食'] },
    { region: '云南', comments: 9012, sentiment: 0.78, topTopics: ['风景', '民族', '自然'] },
    { region: '西藏', comments: 7890, sentiment: 0.82, topTopics: ['雪山', '文化', '信仰'] },
    { region: '新疆', comments: 6789, sentiment: 0.75, topTopics: ['风景', '民族', '美食'] },
    { region: '海南', comments: 5678, sentiment: 0.80, topTopics: ['海滩', '度假', '热带'] }
  ],
  
  videoTypeAnalysis: [
    { type: '美食探店', comments: 34567, avgSentiment: 0.78, engagementRate: 8.5 },
    { type: '景点介绍', comments: 28901, avgSentiment: 0.72, engagementRate: 7.2 },
    { type: '文化体验', comments: 23456, avgSentiment: 0.69, engagementRate: 6.8 },
    { type: '住宿推荐', comments: 19876, avgSentiment: 0.65, engagementRate: 6.1 },
    { type: '交通攻略', comments: 15432, avgSentiment: 0.58, engagementRate: 5.4 },
    { type: '购物指南', comments: 12345, avgSentiment: 0.63, engagementRate: 5.8 },
    { type: '历史古迹', comments: 9876, avgSentiment: 0.71, engagementRate: 6.5 },
    { type: '自然风光', comments: 8765, avgSentiment: 0.79, engagementRate: 7.8 }
  ],
  
  interactionAnalysis: [
    { type: '点赞数', count: 234567, trend: 12.5 },
    { type: '回复数', count: 89012, trend: 8.3 },
    { type: '分享数', count: 23456, trend: 15.7 },
    { type: '收藏数', count: 45678, trend: 9.2 },
    { type: '举报数', count: 1234, trend: -5.6 }
  ],
  
  topComments: [
    {
      id: '1',
      content: '这个地方真的太美了！强烈推荐大家去看看，特别是日出的时候，简直美得不像话！',
      likes: 1234,
      replies: 89,
      sentiment: 'positive',
      videoTitle: '张家界天门山日出奇观',
      author: '旅行达人小王',
      timestamp: '2024-12-15 08:30'
    },
    {
      id: '2',
      content: '导游服务很专业，讲解详细，让我们对这里的历史文化有了更深的了解。',
      likes: 987,
      replies: 56,
      sentiment: 'positive',
      videoTitle: '故宫深度游览体验',
      author: '文化爱好者',
      timestamp: '2024-12-14 15:20'
    },
    {
      id: '3',
      content: '价格有点贵，但是体验还是不错的，建议提前预订会有优惠。',
      likes: 756,
      replies: 34,
      sentiment: 'neutral',
      videoTitle: '三亚亚龙湾度假村体验',
      author: '理性消费者',
      timestamp: '2024-12-13 19:45'
    },
    {
      id: '4',
      content: '交通不太方便，建议自驾或者包车，公共交通比较麻烦。',
      likes: 543,
      replies: 23,
      sentiment: 'negative',
      videoTitle: '川西秘境自驾游',
      author: '自驾游爱好者',
      timestamp: '2024-12-12 11:15'
    },
    {
      id: '5',
      content: '当地美食真的太棒了！每一道菜都让人回味无穷，必须打卡！',
      likes: 1456,
      replies: 78,
      sentiment: 'positive',
      videoTitle: '成都美食街探店',
      author: '美食博主',
      timestamp: '2024-12-11 20:30'
    }
  ],
  
  sentimentTrends: [
    { month: '2024-01', positive: 65.2, negative: 14.8, neutral: 20.0 },
    { month: '2024-02', positive: 67.8, negative: 13.2, neutral: 19.0 },
    { month: '2024-03', positive: 63.5, negative: 16.5, neutral: 20.0 },
    { month: '2024-04', positive: 69.2, negative: 12.8, neutral: 18.0 },
    { month: '2024-05', positive: 71.5, negative: 11.5, neutral: 17.0 },
    { month: '2024-06', positive: 68.9, negative: 13.1, neutral: 18.0 },
    { month: '2024-07', positive: 66.7, negative: 14.3, neutral: 19.0 },
    { month: '2024-08', positive: 72.1, negative: 10.9, neutral: 17.0 },
    { month: '2024-09', positive: 64.8, negative: 15.2, neutral: 20.0 },
    { month: '2024-10', positive: 68.3, negative: 12.7, neutral: 19.0 },
    { month: '2024-11', positive: 65.9, negative: 14.1, neutral: 20.0 },
    { month: '2024-12', positive: 67.4, negative: 13.6, neutral: 19.0 }
  ],
  
  keywordSentiment: [
    { keyword: '美食', mentions: 15678, sentiment: 0.82, trend: 12.5 },
    { keyword: '风景', mentions: 14567, sentiment: 0.79, trend: 8.3 },
    { keyword: '服务', mentions: 12345, sentiment: 0.65, trend: -2.1 },
    { keyword: '价格', mentions: 11234, sentiment: 0.45, trend: -5.7 },
    { keyword: '交通', mentions: 9876, sentiment: 0.52, trend: 3.2 },
    { keyword: '住宿', mentions: 8765, sentiment: 0.68, trend: 6.8 },
    { keyword: '文化', mentions: 7654, sentiment: 0.74, trend: 9.1 },
    { keyword: '历史', mentions: 6543, sentiment: 0.71, trend: 4.5 },
    { keyword: '购物', mentions: 5432, sentiment: 0.63, trend: 1.8 },
    { keyword: '安全', mentions: 4321, sentiment: 0.58, trend: -1.2 }
  ]
}