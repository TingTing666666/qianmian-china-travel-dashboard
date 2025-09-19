/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\services\clientVideoService.ts
 */
import { VideoData, VideoQueryParams } from '@/types/video'

export class ClientVideoService {
  // 获取视频数据列表
  async getVideoData(params: VideoQueryParams = {}): Promise<{ data: VideoData[], total: number }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.set('page', params.page.toString())
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.sortBy) searchParams.set('sortBy', params.sortBy)
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
      if (params.search) searchParams.set('search', params.search)
      if (params.channelTitle) searchParams.set('channelTitle', params.channelTitle)
      if (params.categoryId !== undefined) searchParams.set('categoryId', params.categoryId.toString())

      const response = await fetch(`/api/videos?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '获取视频数据失败')
      }
      
      return {
        data: result.data,
        total: result.total
      }
    } catch (error) {
      console.error('获取视频数据失败:', error)
      // 返回模拟数据作为后备
      return {
        data: this.getMockVideoData(),
        total: 12
      }
    }
  }

  // 获取视频统计数据
  async getVideoStats(): Promise<{
    totalVideos: number,
    totalViews: number,
    totalLikes: number,
    totalComments: number
  }> {
    try {
      const response = await fetch('/api/videos/stats')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '获取视频统计数据失败')
      }
      
      return result.data
    } catch (error) {
      console.error('获取视频统计数据失败:', error)
      // 返回模拟数据作为后备
      return {
        totalVideos: 156,
        totalViews: 2500000,
        totalLikes: 125000,
        totalComments: 8500
      }
    }
  }

  // 获取频道列表
  async getChannels(): Promise<string[]> {
    try {
      const response = await fetch('/api/videos/channels')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '获取频道列表失败')
      }
      
      return result.data
    } catch (error) {
      console.error('获取频道列表失败:', error)
      // 返回模拟数据作为后备
      return ['中国旅游频道', '美食探索', '文化之旅', '自然风光', '城市漫步']
    }
  }

  // 模拟视频数据
  private getMockVideoData(): VideoData[] {
    const mockData: VideoData[] = []
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                   '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12']
    
    months.forEach((month, index) => {
      mockData.push({
        id: `video_${index + 1}`,
        title: `${month} 中国旅游精选`,
        description: `${month} 月份的中国旅游景点推荐视频`,
        channel_title: '中国旅游频道',
        published_at: `${month}-15`,
        view_count: Math.floor(Math.random() * 100000) + 50000,
        like_count: Math.floor(Math.random() * 5000) + 1000,
        comment_count: Math.floor(Math.random() * 500) + 100,
        duration: '00:10:30',
        category_id: 19,
        tags: ['旅游', '中国', '景点'],
        thumbnail_url: 'https://example.com/thumbnail.jpg',
        created_at: `${month}-15`,
        updated_at: `${month}-15`
      })
    })
    
    return mockData
  }
}

export const videoService = new ClientVideoService()