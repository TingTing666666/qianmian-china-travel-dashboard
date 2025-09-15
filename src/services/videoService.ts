/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\services\videoService.ts
 */
import { query } from '@/lib/db'
import { VideoData, VideoQueryParams } from '@/types/video'

export class VideoService {
  // 获取视频数据列表
  async getVideoData(params: VideoQueryParams = {}): Promise<{ data: VideoData[], total: number }> {
    try {
      const {
        page = 1,
        limit = 50,
        sortBy = 'created_at',
        sortOrder = 'desc',
        search,
        channelTitle,
        categoryId
      } = params

      const offset = (page - 1) * limit
      let whereConditions: string[] = []
      let queryParams: any[] = []
      let paramIndex = 1

      // 构建WHERE条件
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`)
        queryParams.push(`%${search}%`)
        paramIndex++
      }

      if (channelTitle) {
        whereConditions.push(`channel_title ILIKE $${paramIndex}`)
        queryParams.push(`%${channelTitle}%`)
        paramIndex++
      }

      if (categoryId !== undefined) {
        whereConditions.push(`category_id = $${paramIndex}`)
        queryParams.push(categoryId)
        paramIndex++
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

      // 验证排序字段
      const validSortFields = ['id', 'title', 'published_at', 'channel_title', 'view_count', 'like_count', 'comment_count', 'created_at']
      const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at'
      const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC'

      // 获取总数
      const countQuery = `
        SELECT COUNT(*) as total
        FROM video_fdata
        ${whereClause}
      `
      const countResult = await query(countQuery, queryParams)
      const total = parseInt(countResult.rows[0].total)

      // 获取数据
      const dataQuery = `
        SELECT 
          id,
          title,
          description,
          published_at,
          channel_title,
          channel_id,
          tags,
          category_id,
          view_count,
          like_count,
          favorite_count,
          comment_count,
          duration,
          created_at
        FROM video_fdata
        ${whereClause}
        ORDER BY ${safeSortBy} ${safeSortOrder}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `
      
      queryParams.push(limit, offset)
      const dataResult = await query(dataQuery, queryParams)
      
      return {
        data: dataResult.rows,
        total
      }
    } catch (error) {
      console.error('获取视频数据失败:', error)
      throw new Error('获取视频数据失败')
    }
  }

  // 获取视频统计信息
  async getVideoStats(): Promise<{
    totalVideos: number,
    totalViews: number,
    totalLikes: number,
    totalComments: number
  }> {
    try {
      const result = await query(`
        SELECT 
          COUNT(*) as total_videos,
          COALESCE(SUM(view_count), 0) as total_views,
          COALESCE(SUM(like_count), 0) as total_likes,
          COALESCE(SUM(comment_count), 0) as total_comments
        FROM video_fdata
      `)
      
      const row = result.rows[0]
      return {
        totalVideos: parseInt(row.total_videos),
        totalViews: parseInt(row.total_views),
        totalLikes: parseInt(row.total_likes),
        totalComments: parseInt(row.total_comments)
      }
    } catch (error) {
      console.error('获取视频统计失败:', error)
      throw new Error('获取视频统计失败')
    }
  }

  // 获取频道列表
  async getChannels(): Promise<{ channel_title: string, video_count: number }[]> {
    try {
      const result = await query(`
        SELECT 
          channel_title,
          COUNT(*) as video_count
        FROM video_fdata
        WHERE channel_title IS NOT NULL
        GROUP BY channel_title
        ORDER BY video_count DESC
        LIMIT 50
      `)
      
      return result.rows
    } catch (error) {
      console.error('获取频道列表失败:', error)
      throw new Error('获取频道列表失败')
    }
  }
}