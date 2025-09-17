/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\RecentComments.tsx
 */
import React, { useState, useEffect } from 'react'
import { DashboardCard } from './DashboardCard'
import { Badge } from '@/components/ui/Badge'
import { MessageCircle, ThumbsUp, User, Calendar } from 'lucide-react'
import { commentService } from '@/services/clientCommentService'
import { CommentData } from '@/types/comment'

interface RecentCommentsProps {
  className?: string
}

const RecentComments: React.FC<RecentCommentsProps> = ({ className }) => {
  const [comments, setComments] = useState<CommentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopComments = async () => {
      try {
        setLoading(true)
        const response = await commentService.getCommentData({
          limit: 1,
          sortBy: 'likecount',
          sortOrder: 'desc'
        })
        setComments(response.data)
      } catch (error) {
        console.error('获取高赞评论失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopComments()
  }, [])

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentText = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive':
        return '积极'
      case 'negative':
        return '消极'
      default:
        return '中性'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未知时间'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return '未知时间'
    }
  }

  if (loading) {
    return (
      <DashboardCard
        title="高赞评论"
        description="点赞量最高的用户评论和反馈"
        icon={MessageCircle}
        iconColor="text-blue-600"
        actionText="查看详情"
        actionHref="/comments/data"
      >
        <div className="flex-1 flex flex-col space-y-4">
          {[...Array(1)].map((_, i) => (
            <div key={i} className="animate-pulse flex-1 flex flex-col space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-3 bg-muted rounded w-12"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title="高赞评论"
      description="点赞量最高的用户评论和反馈"
      icon={MessageCircle}
      iconColor="text-blue-600"
      actionText="查看详情"
      actionHref="/comments/data"
    >
      <div className="flex-1 flex flex-col">
        {comments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">暂无评论数据</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={`${comment.videoid}-${index}`} className="flex-1 flex flex-col space-y-3">
              {/* 用户头像和基本信息 */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {comment.author || '匿名用户'}
                    </h4>
                    <Badge className={`text-xs ${getSentimentColor(comment.sentiment_category)}`}>
                      {getSentimentText(comment.sentiment_category)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    视频ID：{comment.videoid}
                  </p>
                </div>
              </div>

              {/* 评论内容 */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="bg-muted/50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                    {comment.text || '暂无评论内容'}
                  </p>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{(comment.likecount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{comment.publishedat ? new Date(comment.publishedat).toLocaleDateString('zh-CN') : '未知时间'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  )
}

export { RecentComments }
export default RecentComments