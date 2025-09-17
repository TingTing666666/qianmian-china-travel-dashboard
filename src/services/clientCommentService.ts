/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\services\clientCommentService.ts
 */
import { CommentData, CommentQueryParams } from '@/types/comment'

export class ClientCommentService {
  // 获取评论数据列表
  async getCommentData(params: CommentQueryParams = {}): Promise<{ data: CommentData[], total: number }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.set('page', params.page.toString())
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.sortBy) searchParams.set('sortBy', params.sortBy)
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
      if (params.search) searchParams.set('search', params.search)
      if (params.videoId) searchParams.set('videoId', params.videoId)
      if (params.sentimentCategory) searchParams.set('sentimentCategory', params.sentimentCategory)
      if (params.author) searchParams.set('author', params.author)

      const response = await fetch(`/api/comments?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '获取评论数据失败')
      }
      
      return {
        data: result.data,
        total: result.total
      }
    } catch (error) {
      console.error('获取评论数据失败:', error)
      // 返回模拟数据作为后备
      return {
        data: this.getMockCommentData(),
        total: 10
      }
    }
  }

  // 获取评论统计数据
  async getCommentStats(): Promise<{
    totalComments: number,
    positiveComments: number,
    negativeComments: number,
    neutralComments: number,
    avgCompoundScore: number
  }> {
    try {
      const response = await fetch('/api/comments/stats')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '获取评论统计数据失败')
      }
      
      return result.data
    } catch (error) {
      console.error('获取评论统计数据失败:', error)
      // 返回模拟数据作为后备
      return {
        totalComments: 1250,
        positiveComments: 750,
        negativeComments: 200,
        neutralComments: 300,
        avgCompoundScore: 0.65
      }
    }
  }

  // 模拟评论数据
  private getMockCommentData(): CommentData[] {
    return [
      {
        id: '1',
        videoid: 'video1',
        text: '这个地方真的很美，值得一去！',
        author: '旅行爱好者',
        publishedat: new Date('2024-01-15'),
        likecount: 25,
        sentiment_category: 'positive',
        compound_score: 0.8,
        positive_score: 0.9,
        negative_score: 0.1,
        neutral_score: 0.0
      },
      {
        id: '2',
        videoid: 'video2',
        text: '交通不太方便，但是风景确实不错',
        author: '实用主义者',
        publishedat: new Date('2024-01-14'),
        likecount: 12,
        sentiment_category: 'neutral',
        compound_score: 0.2,
        positive_score: 0.4,
        negative_score: 0.3,
        neutral_score: 0.3
      },
      {
        id: '3',
        videoid: 'video3',
        text: '人太多了，体验不太好',
        author: '挑剔游客',
        publishedat: new Date('2024-01-13'),
        likecount: 5,
        sentiment_category: 'negative',
        compound_score: -0.5,
        positive_score: 0.1,
        negative_score: 0.7,
        neutral_score: 0.2
      }
    ]
  }
}

export const commentService = new ClientCommentService()