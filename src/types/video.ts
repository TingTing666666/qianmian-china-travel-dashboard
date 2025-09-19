/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-19 14:30:25
 * @FilePath: \qianmian-china-travel-dashboard\src\types\video.ts
 */

// 视频数据类型
export interface VideoData {
  id: string
  title: string | null
  description: string | null
  published_at: string | null
  channel_title: string | null
  channel_id: string | null
  tags: string | null
  category_id: number | null
  view_count: number | null
  like_count: number | null
  favorite_count: number | null
  comment_count: number | null
  duration: string | null
  created_at: string | null
  updated_at: string | null
}

// 视频数据查询参数
export interface VideoQueryParams {
  page?: number
  limit?: number
  sortBy?: keyof VideoData
  sortOrder?: 'asc' | 'desc'
  search?: string
  channelTitle?: string
  categoryId?: number
}

// API 响应类型
export interface VideoDataResponse {
  success: boolean
  data: VideoData[]
  total?: number
  page?: number
  limit?: number
  error?: string
}

// 字段中文映射
export const VIDEO_FIELD_LABELS: Record<keyof VideoData, string> = {
  id: 'ID',
  title: '标题',
  description: '描述',
  published_at: '发布时间',
  channel_title: '频道名称',
  channel_id: '频道ID',
  tags: '标签',
  category_id: '分类ID',
  view_count: '观看次数',
  like_count: '点赞数',
  favorite_count: '收藏数',
  comment_count: '评论数',
  duration: '时长',
  created_at: '创建时间',
  updated_at: '更新时间'
}