/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\charts\CommentDataTable.tsx
 */
"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { CommentData, CommentQueryParams, COMMENT_FIELD_LABELS, SENTIMENT_CATEGORIES, SENTIMENT_COLORS } from '@/types/comment'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MessageSquare, ThumbsUp, Calendar, User, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface CommentDataTableProps {
  className?: string
}

interface SortConfig {
  key: keyof CommentData
  direction: 'asc' | 'desc'
}

interface VideoOption {
  videoid: string
  comment_count: number
}

interface AuthorOption {
  author: string
  comment_count: number
}

export function CommentDataTable({ className }: CommentDataTableProps) {
  const [comments, setComments] = useState<CommentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'publishedat', direction: 'desc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [selectedSentiment, setSelectedSentiment] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [videoOptions, setVideoOptions] = useState<VideoOption[]>([])
  const [authorOptions, setAuthorOptions] = useState<AuthorOption[]>([])
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

  // 获取视频ID列表
  const fetchVideoOptions = useCallback(async () => {
    try {
      const response = await fetch('/api/comments/videos')
      const data = await response.json()
      if (data.success) {
        setVideoOptions(data.data)
      }
    } catch (error) {
      console.error('获取视频ID列表失败:', error)
    }
  }, [])

  // 获取作者列表
  const fetchAuthorOptions = useCallback(async () => {
    try {
      const response = await fetch('/api/comments/authors')
      const data = await response.json()
      if (data.success) {
        setAuthorOptions(data.data)
      }
    } catch (error) {
      console.error('获取作者列表失败:', error)
    }
  }, [])

  // 获取评论数据
  const fetchComments = useCallback(async () => {
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(sortConfig.key && { sortBy: sortConfig.key }),
        sortOrder: sortConfig.direction,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedVideoId && { videoId: selectedVideoId }),
        ...(selectedSentiment && { sentimentCategory: selectedSentiment }),
        ...(selectedAuthor && { author: selectedAuthor })
      })

      const response = await fetch(`/api/comments?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.data)
        setTotal(data.total || 0)
      } else {
        setError(data.error || '获取数据失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取评论数据失败:', error)
    } finally {
      if (loading) {
        setLoading(false)
      }
    }
  }, [currentPage, pageSize, sortConfig, searchTerm, selectedVideoId, selectedSentiment, selectedAuthor, loading])

  // 初始化数据
  useEffect(() => {
    fetchVideoOptions()
    fetchAuthorOptions()
  }, [])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 排序处理
  const handleSort = useCallback((key: keyof CommentData) => {
    // 禁用文本内容的排序
    if (key === 'text') {
      return
    }
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }, [])

  // 搜索处理
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  // 筛选处理
  const handleVideoFilter = useCallback((value: string) => {
    setSelectedVideoId(value)
    setCurrentPage(1)
  }, [])

  const handleSentimentFilter = useCallback((value: string) => {
    setSelectedSentiment(value)
    setCurrentPage(1)
  }, [])

  const handleAuthorFilter = useCallback((value: string) => {
    setSelectedAuthor(value)
    setCurrentPage(1)
  }, [])

  // 格式化数值
  const formatNumber = useCallback((num: string | null) => {
    if (!num) return '-'
    const parsed = parseInt(num)
    return isNaN(parsed) ? '-' : parsed.toLocaleString()
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

  // 格式化情感分数
  const formatSentimentScore = useCallback((score: string | null) => {
    if (!score) return '-'
    const parsed = parseFloat(score)
    return isNaN(parsed) ? '-' : parsed.toFixed(3)
  }, [])

  // 获取情感标签
  const getSentimentBadge = useCallback((category: string | null) => {
    if (!category || !(category in SENTIMENT_CATEGORIES)) {
      return <Badge variant="secondary">未知</Badge>
    }
    
    const colorClass = SENTIMENT_COLORS[category as keyof typeof SENTIMENT_COLORS]
    const label = SENTIMENT_CATEGORIES[category as keyof typeof SENTIMENT_CATEGORIES]
    
    return (
      <Badge className={`${colorClass} border-0`}>
        {category === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
        {category === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
        {category === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
        {label}
      </Badge>
    )
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
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchComments} className="bg-red-600 hover:bg-red-700">
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
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            评论数据管理
          </CardTitle>
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
                    placeholder="搜索评论内容或作者..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <Select
                  value={selectedVideoId}
                  onChange={(e) => handleVideoFilter(e.target.value)}
                  className="w-full sm:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">全部视频</option>
                  {videoOptions.map((video) => (
                    <option key={video.videoid} value={video.videoid}>
                      {video.videoid.substring(0, 8)}... ({video.comment_count})
                    </option>
                  ))}
                </Select>
                <Select
                  value={selectedSentiment}
                  onChange={(e) => handleSentimentFilter(e.target.value)}
                  className="w-full sm:w-32 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">全部情感</option>
                  <option value="positive">积极</option>
                  <option value="negative">消极</option>
                  <option value="neutral">中性</option>
                </Select>
                <Select
                  value={selectedAuthor}
                  onChange={(e) => handleAuthorFilter(e.target.value)}
                  className="w-full sm:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">全部作者</option>
                  {authorOptions.map((author) => (
                    <option key={author.author} value={author.author}>
                      {author.author} ({author.comment_count})
                    </option>
                  ))}
                </Select>
              </div>
              <Button 
                onClick={fetchComments} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
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
                    <TableHead className="w-24 text-gray-700 font-semibold">
                      <button
                        onClick={() => handleSort('videoid')}
                        className="flex items-center hover:text-purple-600 transition-colors"
                      >
                        视频ID
                        <BarChart3 className="w-3 h-3 ml-1" />
                      </button>
                    </TableHead>
                    <TableHead className="w-32 text-gray-700 font-semibold">
                      <button
                        onClick={() => handleSort('author')}
                        className="flex items-center hover:text-purple-600 transition-colors"
                      >
                        <User className="w-4 h-4 mr-1" />
                        作者
                        <BarChart3 className="w-3 h-3 ml-1" />
                      </button>
                    </TableHead>
                    <TableHead className="w-80 text-gray-700 font-semibold">
                      评论内容
                    </TableHead>
                    <TableHead className="w-20 text-gray-700 font-semibold">
                      <button
                        onClick={() => handleSort('likecount')}
                        className="flex items-center hover:text-purple-600 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        点赞
                        <BarChart3 className="w-3 h-3 ml-1" />
                      </button>
                    </TableHead>
                    <TableHead className="w-32 text-gray-700 font-semibold">
                      <button
                        onClick={() => handleSort('publishedat')}
                        className="flex items-center hover:text-purple-600 transition-colors"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        发布时间
                        <BarChart3 className="w-3 h-3 ml-1" />
                      </button>
                    </TableHead>
                    <TableHead className="w-24 text-gray-700 font-semibold">
                      <button
                        onClick={() => handleSort('sentiment_category')}
                        className="flex items-center hover:text-purple-600 transition-colors"
                      >
                        情感分类
                        <BarChart3 className="w-3 h-3 ml-1" />
                      </button>
                    </TableHead>
                    <TableHead className="w-20 text-gray-700 font-semibold">
                      <button
                        onClick={() => handleSort('compound')}
                        className="flex items-center hover:text-purple-600 transition-colors"
                      >
                        综合分数
                        <BarChart3 className="w-3 h-3 ml-1" />
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <span className="ml-2 text-gray-600">加载中...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : comments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无数据</h3>
                          <p className="text-gray-500">当前筛选条件下没有找到相关评论</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    comments.map((comment, index) => (
                      <TableRow 
                        key={`${comment.videoid}-${index}`} 
                        className={`hover:bg-purple-50/50 transition-colors duration-150 h-16 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <TableCell className="font-medium p-3">
                          <div className="flex items-center h-10">
                            <span className="text-sm text-gray-600 font-mono" title={comment.videoid}>
                              {comment.videoid ? comment.videoid.substring(0, 8) + '...' : '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center h-10">
                            <span className="text-sm text-gray-600 truncate" title={comment.author || ''}>
                              {truncateText(comment.author, 15)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center h-10">
                            {comment.text ? (
                              <div className="flex items-center w-full">
                                <span className="text-sm text-gray-600 truncate flex-1" title={comment.text}>
                                  {truncateText(comment.text, 60)}
                                </span>
                                {needsTruncation(comment.text, 60) && (
                                  <button
                                    onClick={() => openModal('评论内容', comment.text || '')}
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
                        <TableCell className="text-sm text-gray-600 p-3">
                          <div className="flex items-center h-10">
                            {formatNumber(comment.likecount)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 p-3">
                          <div className="flex items-center h-10">
                            {formatDate(comment.publishedat)}
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center h-10">
                            {getSentimentBadge(comment.sentiment_category)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 p-3">
                          <div className="flex items-center h-10">
                            {formatSentimentScore(comment.compound)}
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
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
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
                <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-md">
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

      {/* 文本模态框 */}
      {modalData.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{modalData.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {modalData.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}