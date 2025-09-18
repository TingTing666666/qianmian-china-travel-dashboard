/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\RecentVideos.tsx
 */
"use client"

import { useState, useEffect } from 'react'
import { DashboardCard } from './DashboardCard'
import { Badge } from '@/components/ui/Badge'
import { Play, Eye, ThumbsUp, ExternalLink } from "lucide-react"
import { videoService } from '@/services/clientVideoService'
import { VideoData } from '@/types/video'

export function RecentVideos() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // 获取点赞量最高的视频，限制为1个
        const result = await videoService.getVideoData({
          limit: 1,
          sortBy: 'like_count',
          sortOrder: 'desc'
        })
        setVideos(result.data)
      } catch (error) {
        console.error('获取热门视频失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const formatNumber = (num: number | null) => {
    if (!num) return '0'
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getVideoThumbnail = (videoId: string) => {
    // YouTube缩略图URL格式
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  }

  const getVideoUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  if (loading) {
    return (
      <DashboardCard
        title="最热视频"
        description="点赞量最高的热门视频"
        icon={Play}
        iconColor="text-red-600"
      >
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-20 h-12 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title="最热视频"
      description="点赞量最高的热门视频"
      icon={Play}
      iconColor="text-red-600"
      action={{
        label: "查看更多",
        href: "/videos"
      }}
    >
      <div className="flex-1 flex flex-col">
        {videos.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">暂无视频数据</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="flex-1 flex flex-col space-y-3 group">
              {/* 视频缩略图 */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={getVideoThumbnail(video.id)}
                  alt={video.title || '视频缩略图'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-muted">
                        <svg class="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    `
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* 视频信息 */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {video.title || '无标题'}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {video.channel_title || '未知频道'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        热门
                      </Badge>
                      <span className="text-muted-foreground">
                        {video.duration || '10:30'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(video.view_count)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{formatNumber(video.like_count)}</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <span>{video.comment_count ? `${formatNumber(video.comment_count)} 评论` : '暂无评论'}</span>
                    </div>
                  </div>
                  
                  <a
                    href={getVideoUrl(video.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 w-full h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    观看视频
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  )
}

export default RecentVideos