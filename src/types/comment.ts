/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\types\comment.ts
 */

// 评论数据类型
export interface CommentData {
  videoid: string
  author: string | null
  text: string | null
  likecount: string | null
  publishedat: string | null
  compound: string | null
  positive: string | null
  neutral: string | null
  negative: string | null
  score: string | null
  sentiment_category: string | null
}

// 评论数据查询参数
export interface CommentQueryParams {
  page?: number
  limit?: number
  sortBy?: keyof CommentData
  sortOrder?: 'asc' | 'desc'
  search?: string
  videoId?: string
  sentimentCategory?: string
  author?: string
}

// API 响应类型
export interface CommentDataResponse {
  success: boolean
  data: CommentData[]
  total?: number
  page?: number
  limit?: number
  error?: string
}

// 情感分类映射
export const SENTIMENT_CATEGORIES = {
  positive: '积极',
  negative: '消极',
  neutral: '中性'
} as const

// 字段中文映射
export const COMMENT_FIELD_LABELS: Record<keyof CommentData, string> = {
  videoid: '视频ID',
  author: '作者',
  text: '评论内容',
  likecount: '点赞数',
  publishedat: '发布时间',
  compound: '综合情感分数',
  positive: '积极情感分数',
  neutral: '中性情感分数',
  negative: '消极情感分数',
  score: '情感评分',
  sentiment_category: '情感分类'
}

// 情感分类颜色映射
export const SENTIMENT_COLORS = {
  positive: 'text-green-600 bg-green-100',
  negative: 'text-red-600 bg-red-100',
  neutral: 'text-gray-600 bg-gray-100'
} as const