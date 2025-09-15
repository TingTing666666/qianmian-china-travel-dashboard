/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\VideoDataTable.tsx
 */
"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { VideoData, VideoQueryParams, VIDEO_FIELD_LABELS } from '@/types/video'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface VideoDataTableProps {
  className?: string
}

interface SortConfig {
  key: keyof VideoData | null
  direction: 'asc' | 'desc'
}

interface Channel {
  channel_title: string
  video_count: number
}

// 排序图标组件
const SortIcon = ({ isActive, direction }: { isActive: boolean, direction: 'asc' | 'desc' }) => {
  if (!isActive) {
    return (
      <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  
  return direction === 'asc' ? (
    <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// 文本展开模态框组件
const TextModal = ({ isOpen, onClose, title, content }: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  content: string 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

export function VideoDataTable({ className }: VideoDataTableProps) {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [channels, setChannels] = useState<Channel[]>([])
  const [modalData, setModalData] = useState<{ isOpen: boolean, title: string, content: string }>({
    isOpen: false,
    title: '',
    content: ''
  })

  // 防抖搜索
  const debouncedSearchTerm = useMemo(() => {
    const handler = setTimeout(() => searchTerm, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // 获取频道列表
  const fetchChannels = useCallback(async () => {
    try {
      const response = await fetch('/api/videos/channels')
      const data = await response.json()
      if (data.success) {
        setChannels(data.data)
      }
    } catch (error) {
      console.error('获取频道列表失败:', error)
    }
  }, [])

  // 获取视频数据 - 优化防止页面跳动
  const fetchVideos = useCallback(async () => {
    // 不显示loading状态，避免页面跳动
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(sortConfig.key && { sortBy: sortConfig.key }),
        sortOrder: sortConfig.direction,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedChannel && { channelTitle: selectedChannel })
      })

      const response = await fetch(`/api/videos?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setVideos(data.data)
        setTotal(data.total || 0)
      } else {
        setError(data.error || '获取数据失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取视频数据失败:', error)
    } finally {
      // 只在初始加载时设置loading为false
      if (loading) {
        setLoading(false)
      }
    }
  }, [currentPage, pageSize, sortConfig, searchTerm, selectedChannel, loading])

  // 初始化数据
  useEffect(() => {
    fetchChannels()
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // 排序处理 - 仅允许特定列排序
  const handleSort = useCallback((key: keyof VideoData) => {
    // 禁用标题、频道名称、标签的排序
    if (key === 'title' || key === 'channel_title' || key === 'tags') {
      return
    }
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }, [])

  // 搜索处理 - 防抖
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  // 频道筛选处理
  const handleChannelFilter = useCallback((value: string) => {
    setSelectedChannel(value)
    setCurrentPage(1)
  }, [])

  // 格式化数值
  const formatNumber = useCallback((num: number | null) => {
    if (num === null || num === undefined) return '-'
    return num.toLocaleString()
  }, [])

  // 格式化日期
  const formatDate = useCallback((dateStr: string | null) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleString('zh-CN')
    } catch {
      return dateStr
    }
  }, [])

  // 截断文本
  const truncateText = useCallback((text: string | null, maxLength: number = 50) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }, [])

  // 格式化时长
  const formatDuration = useCallback((duration: string | null) => {
    if (!duration) return '-'
    
    // 如果已经是 MM:SS 或 HH:MM:SS 格式，直接返回
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(duration)) {
      return duration
    }
    
    // 如果是 ISO 8601 格式 (PT1M30S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (match) {
      const hours = parseInt(match[1] || '0')
      const minutes = parseInt(match[2] || '0')
      const seconds = parseInt(match[3] || '0')
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      }
    }
    
    return duration
  }, [])

  // 生成YouTube链接
  const getYouTubeUrl = useCallback((videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`
  }, [])

  // 打开文本模态框
  const openModal = useCallback((title: string, content: string) => {
    setModalData({ isOpen: true, title, content })
  }, [])

  // 关闭文本模态框
  const closeModal = useCallback(() => {
    setModalData({ isOpen: false, title: '', content: '' })
  }, [])

  // 检查文本是否需要截断
  const needsTruncation = useCallback((text: string | null, maxLength: number) => {
    return text && text.length > maxLength
  }, [])

  const totalPages = Math.ceil(total / pageSize)

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchVideos} className="bg-blue-600 hover:bg-blue-700">
              重新加载
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* 主表格卡片 */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">视频数据管理</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* 筛选和搜索区域 */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input
                    placeholder="搜索标题或描述内容..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Select
                  value={selectedChannel}
                  onChange={(e) => handleChannelFilter(e.target.value)}
                  className="w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">全部频道</option>
                  {channels.map((channel) => (
                    <option key={channel.channel_title} value={channel.channel_title}>
                      {channel.channel_title} ({channel.video_count})
                    </option>
                  ))}
                </Select>
              </div>
              <Button 
                onClick={fetchVideos} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新数据
              </Button>
            </div>
          </div>

          {/* 表格区域 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="w-80 text-gray-700 font-semibold">
                      {VIDEO_FIELD_LABELS.title}
                    </TableHead>
                    <TableHead className="w-40 text-gray-700 font-semibold">
                      {VIDEO_FIELD_LABELS.channel_title}
                    </TableHead>
                    <TableHead 
                      className="w-32 cursor-pointer hover:bg-gray-100 text-gray-700 font-semibold transition-colors duration-150 select-none text-right"
                      onClick={() => handleSort('view_count')}
                    >
                      <div className="flex items-center justify-end">
                        {VIDEO_FIELD_LABELS.view_count}
                        <SortIcon isActive={sortConfig.key === 'view_count'} direction={sortConfig.direction} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-28 cursor-pointer hover:bg-gray-100 text-gray-700 font-semibold transition-colors duration-150 select-none text-right"
                      onClick={() => handleSort('like_count')}
                    >
                      <div className="flex items-center justify-end">
                        {VIDEO_FIELD_LABELS.like_count}
                        <SortIcon isActive={sortConfig.key === 'like_count'} direction={sortConfig.direction} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-28 cursor-pointer hover:bg-gray-100 text-gray-700 font-semibold transition-colors duration-150 select-none text-right"
                      onClick={() => handleSort('comment_count')}
                    >
                      <div className="flex items-center justify-end">
                        {VIDEO_FIELD_LABELS.comment_count}
                        <SortIcon isActive={sortConfig.key === 'comment_count'} direction={sortConfig.direction} />
                      </div>
                    </TableHead>
                    <TableHead className="w-24 text-gray-700 font-semibold text-center">
                      {VIDEO_FIELD_LABELS.duration}
                    </TableHead>
                    <TableHead 
                      className="w-44 cursor-pointer hover:bg-gray-100 text-gray-700 font-semibold transition-colors duration-150 select-none"
                      onClick={() => handleSort('published_at')}
                    >
                      <div className="flex items-center">
                        {VIDEO_FIELD_LABELS.published_at}
                        <SortIcon isActive={sortConfig.key === 'published_at'} direction={sortConfig.direction} />
                      </div>
                    </TableHead>
                    <TableHead className="w-60 text-gray-700 font-semibold">
                      {VIDEO_FIELD_LABELS.tags}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 h-96">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                          <p className="text-gray-500">正在加载数据...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : videos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 h-96">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无数据</h3>
                          <p className="text-gray-500">当前筛选条件下没有找到相关视频</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    videos.map((video, index) => (
                      <TableRow 
                        key={video.id} 
                        className={`hover:bg-blue-50/50 transition-colors duration-150 h-16 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <TableCell className="font-medium p-3">
                          <div className="flex items-center h-10">
                            {video.title ? (
                              <div className="flex items-center w-full">
                                <a
                                  href={getYouTubeUrl(video.id)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150 truncate flex-1"
                                  title={video.title}
                                >
                                  {truncateText(video.title, 60)}
                                </a>
                                {needsTruncation(video.title, 60) && (
                                  <button
                                    onClick={() => openModal('视频标题', video.title || '')}
                                    className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                    title="查看完整内容"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center h-10">
                            {video.channel_title ? (
                              <div className="flex items-center w-full">
                                <span className="truncate flex-1" title={video.channel_title}>
                                  {truncateText(video.channel_title, 20)}
                                </span>
                                {needsTruncation(video.channel_title, 20) && (
                                  <button
                                    onClick={() => openModal('频道名称', video.channel_title || '')}
                                    className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                    title="查看完整内容"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm p-3">
                          <div className="flex items-center justify-end h-10">
                            <span className="text-blue-600 font-medium">
                              {formatNumber(video.view_count)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm p-3">
                          <div className="flex items-center justify-end h-10">
                            <span className="text-green-600 font-medium">
                              {formatNumber(video.like_count)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm p-3">
                          <div className="flex items-center justify-end h-10">
                            <span className="text-purple-600 font-medium">
                              {formatNumber(video.comment_count)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center p-3">
                          <div className="flex items-center justify-center h-10">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatDuration(video.duration)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 p-3">
                          <div className="flex items-center h-10">
                            {formatDate(video.published_at)}
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center h-10">
                            {video.tags ? (
                              <div className="flex items-center w-full">
                                <span className="text-sm text-gray-600 truncate flex-1" title={video.tags}>
                                  {truncateText(video.tags, 40)}
                                </span>
                                {needsTruncation(video.tags, 40) && (
                                  <button
                                    onClick={() => openModal('标签', video.tags || '')}
                                    className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                    title="查看完整内容"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 分页区域 */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> 条，
              共 <span className="font-medium">{total}</span> 条记录
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                上一页
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">第</span>
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md">
                  {currentPage}
                </span>
                <span className="text-sm text-gray-600">页，共 {totalPages} 页</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                下一页
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 文本展开模态框 */}
      <TextModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        content={modalData.content}
      />
    </div>
  )
}