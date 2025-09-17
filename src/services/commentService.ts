/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\services\commentService.ts
 */
import { query } from '@/lib/db'
import { CommentData, CommentQueryParams } from '@/types/comment'

export class CommentService {
  // 获取评论数据列表
  async getCommentData(params: CommentQueryParams = {}): Promise<{ data: CommentData[], total: number }> {
    try {
      const {
        page = 1,
        limit = 50,
        sortBy = 'publishedat',
        sortOrder = 'desc',
        search,
        videoId,
        sentimentCategory,
        author
      } = params

      const offset = (page - 1) * limit
      let whereConditions: string[] = []
      let queryParams: any[] = []
      let paramIndex = 1

      // 构建WHERE条件
      if (search) {
        whereConditions.push(`(text ILIKE $${paramIndex} OR author ILIKE $${paramIndex})`)
        queryParams.push(`%${search}%`)
        paramIndex++
      }

      if (videoId) {
        whereConditions.push(`videoid = $${paramIndex}`)
        queryParams.push(videoId)
        paramIndex++
      }

      if (sentimentCategory) {
        whereConditions.push(`sentiment_category = $${paramIndex}`)
        queryParams.push(sentimentCategory)
        paramIndex++
      }

      if (author) {
        whereConditions.push(`author ILIKE $${paramIndex}`)
        queryParams.push(`%${author}%`)
        paramIndex++
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

      // 验证排序字段
      const validSortFields = ['videoid', 'author', 'publishedat', 'likecount', 'compound', 'positive', 'negative', 'neutral', 'score', 'sentiment_category']
      const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'publishedat'
      const finalSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC'

      // 获取总数
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM analyzed_comments 
        ${whereClause}
      `
      const countResult = await query(countQuery, queryParams)
      const total = parseInt(countResult.rows[0].total)

      // 获取数据
      const dataQuery = `
        SELECT 
          videoid,
          author,
          text,
          likecount,
          publishedat,
          compound,
          positive,
          neutral,
          negative,
          score,
          sentiment_category
        FROM analyzed_comments 
        ${whereClause}
        ORDER BY ${finalSortBy} ${finalSortOrder}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `
      
      queryParams.push(limit, offset)
      const dataResult = await query(dataQuery, queryParams)

      return {
        data: dataResult.rows,
        total
      }
    } catch (error) {
      console.error('获取评论数据失败:', error)
      throw new Error('获取评论数据失败')
    }
  }

  // 获取评论统计信息
  async getCommentStats(): Promise<{
    totalComments: number,
    positiveComments: number,
    negativeComments: number,
    neutralComments: number,
    avgCompoundScore: number
  }> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_comments,
          COUNT(CASE WHEN sentiment_category = 'positive' THEN 1 END) as positive_comments,
          COUNT(CASE WHEN sentiment_category = 'negative' THEN 1 END) as negative_comments,
          COUNT(CASE WHEN sentiment_category = 'neutral' THEN 1 END) as neutral_comments,
          AVG(CAST(compound AS FLOAT)) as avg_compound_score
        FROM analyzed_comments
      `
      
      const result = await query(statsQuery)
      const row = result.rows[0]
      
      return {
        totalComments: parseInt(row.total_comments) || 0,
        positiveComments: parseInt(row.positive_comments) || 0,
        negativeComments: parseInt(row.negative_comments) || 0,
        neutralComments: parseInt(row.neutral_comments) || 0,
        avgCompoundScore: parseFloat(row.avg_compound_score) || 0
      }
    } catch (error) {
      console.error('获取评论统计失败:', error)
      throw new Error('获取评论统计失败')
    }
  }

  // 获取视频ID列表（用于筛选）
  async getVideoIds(): Promise<{ videoid: string, comment_count: number }[]> {
    try {
      const videosQuery = `
        SELECT 
          videoid,
          COUNT(*) as comment_count
        FROM analyzed_comments 
        GROUP BY videoid 
        ORDER BY comment_count DESC
        LIMIT 100
      `
      
      const result = await query(videosQuery)
      return result.rows.map(row => ({
        videoid: row.videoid,
        comment_count: parseInt(row.comment_count)
      }))
    } catch (error) {
      console.error('获取视频ID列表失败:', error)
      throw new Error('获取视频ID列表失败')
    }
  }

  // 获取作者列表（用于筛选）
  async getAuthors(): Promise<{ author: string, comment_count: number }[]> {
    try {
      const authorsQuery = `
        SELECT 
          author,
          COUNT(*) as comment_count
        FROM analyzed_comments 
        WHERE author IS NOT NULL AND author != ''
        GROUP BY author 
        ORDER BY comment_count DESC
        LIMIT 50
      `
      
      const result = await query(authorsQuery)
      return result.rows.map(row => ({
        author: row.author,
        comment_count: parseInt(row.comment_count)
      }))
    } catch (error) {
      console.error('获取作者列表失败:', error)
      throw new Error('获取作者列表失败')
    }
  }

  // 获取情感分布数据
  async getSentimentDistribution(): Promise<{
    positive: number,
    negative: number,
    neutral: number
  }> {
    try {
      const distributionQuery = `
        SELECT 
          sentiment_category,
          COUNT(*) as count
        FROM analyzed_comments 
        WHERE sentiment_category IS NOT NULL
        GROUP BY sentiment_category
      `
      
      const result = await query(distributionQuery)
      const distribution = { positive: 0, negative: 0, neutral: 0 }
      
      result.rows.forEach(row => {
        if (row.sentiment_category in distribution) {
          distribution[row.sentiment_category as keyof typeof distribution] = parseInt(row.count)
        }
      })
      
      return distribution
    } catch (error) {
      console.error('获取情感分布失败:', error)
      throw new Error('获取情感分布失败')
    }
  }
}