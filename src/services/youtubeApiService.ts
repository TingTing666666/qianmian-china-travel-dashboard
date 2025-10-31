/*
 * YouTube API 服务
 * 支持多个API密钥管理和自动切换
 */

import { ProxyAgent } from 'undici'

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  channelTitle: string
  channelId: string
  tags?: string[]
  categoryId: string
  viewCount: string
  likeCount: string
  favoriteCount: string
  commentCount: string
  duration: string
  thumbnails: {
    default?: { url: string }
    medium?: { url: string }
    high?: { url: string }
  }
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[]
  nextPageToken?: string
  totalResults: number
  resultsPerPage: number
}

export class YouTubeApiService {
  private apiKeys: string[] = [
    'AIzaSyCjs1i2BMEnAdiAjSrIp76bWJnJkBgUZx4',
    'AIzaSyAb9NJgZa2e-cE5x42-88t7I3ZM8uXcS0A',
    'AIzaSyBitTQCdHazT9XKcmy3XlmGTD5cu8gWx58',
    'AIzaSyCSX6ohQteHINnrrPl9gcBJFshGgcIKzCY'
  ]
  
  private currentApiIndex = 0
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3'
  private proxyUrl?: string
  private proxyAgent?: ProxyAgent
  
  constructor(apiKeys?: string[], proxyUrl?: string) {
    // 优先使用传入的 API 密钥
    if (apiKeys && apiKeys.length > 0) {
      this.apiKeys = apiKeys
    } else if (typeof window !== 'undefined') {
      const savedKeys = localStorage.getItem('youtube_api_keys')
      if (savedKeys) {
        this.apiKeys = JSON.parse(savedKeys)
      }
    }

    // 设置代理：优先使用传入的 proxyUrl，否则读取环境变量
    if (proxyUrl) {
      this.setProxy(proxyUrl)
    } else {
      const envProxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
      if (envProxy) {
        this.setProxy(envProxy)
      }
    }
  }

  setProxy(proxyUrl?: string): void {
    this.proxyUrl = proxyUrl
    if (proxyUrl) {
      try {
        this.proxyAgent = new ProxyAgent(proxyUrl)
      } catch (e) {
        console.warn('代理初始化失败:', e)
        this.proxyAgent = undefined
      }
    } else {
      this.proxyAgent = undefined
    }
  }

  // 添加新的API密钥
  addApiKey(apiKey: string): void {
    if (!this.apiKeys.includes(apiKey)) {
      this.apiKeys.push(apiKey)
      this.saveApiKeys()
    }
  }

  // 移除API密钥
  removeApiKey(apiKey: string): void {
    const index = this.apiKeys.indexOf(apiKey)
    if (index > -1) {
      this.apiKeys.splice(index, 1)
      if (this.currentApiIndex >= this.apiKeys.length) {
        this.currentApiIndex = 0
      }
      this.saveApiKeys()
    }
  }

  // 获取当前API密钥列表
  getApiKeys(): string[] {
    return [...this.apiKeys]
  }

  // 保存API密钥到localStorage
  private saveApiKeys(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('youtube_api_keys', JSON.stringify(this.apiKeys))
    }
  }

  // 获取当前API密钥
  private getCurrentApiKey(): string {
    if (this.apiKeys.length === 0) {
      throw new Error('没有可用的YouTube API密钥')
    }
    return this.apiKeys[this.currentApiIndex]
  }

  // 切换到下一个API密钥
  private switchToNextApiKey(): void {
    this.currentApiIndex = (this.currentApiIndex + 1) % this.apiKeys.length
  }

  // 发送API请求，支持自动重试和密钥切换
  private async makeApiRequest(endpoint: string, params: Record<string, any>): Promise<any> {
    const maxRetries = this.apiKeys.length
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const apiKey = this.getCurrentApiKey()
        const url = new URL(`${this.baseUrl}/${endpoint}`)
        
        // 添加API密钥和其他参数
        url.searchParams.append('key', apiKey)
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value))
          }
        })

        console.log(`尝试请求: ${url.toString()}`)

        // 配置请求选项
        const fetchOptions: RequestInit & { dispatcher?: any } = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          signal: AbortSignal.timeout(30000)
        }

        if (this.proxyAgent) {
          fetchOptions.dispatcher = this.proxyAgent
        }

        const response = await fetch(url.toString(), fetchOptions)
        
        if (response.ok) {
          return await response.json()
        }

        if (response.status === 403 || response.status === 429) {
          console.warn(`API密钥 ${apiKey.substring(0, 10)}... 配额超限，切换到下一个密钥`)
          this.switchToNextApiKey()
          continue
        }

        const errorData = await response.json().catch(() => ({}))
        throw new Error(`YouTube API错误: ${errorData.error?.message || response.statusText}`)

      } catch (error) {
        lastError = error as Error
        console.error(`API请求失败 (尝试 ${attempt + 1}/${maxRetries}):`, error)
        
        // 网络失败或超时增强错误信息
        const msg = (error as Error).message || ''
        if (msg.includes('timeout') || msg.includes('AbortSignal')) {
          lastError = new Error(`请求超时: 连接 YouTube API 超过 30 秒未响应。${this.proxyUrl ? `代理: ${this.proxyUrl}` : ''}`)
        }
        if (error instanceof TypeError && msg.includes('fetch failed')) {
          const proxyMsg = this.proxyUrl ? ` 已设置代理: ${this.proxyUrl}` : ''
          lastError = new Error(`网络连接失败: 无法访问 YouTube API。请检查网络、防火墙或代理配置。${proxyMsg} 原始错误: ${msg}`)
        }
        
        if (attempt < maxRetries - 1) {
          this.switchToNextApiKey()
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
      }
    }

    throw lastError || new Error('所有API密钥都已超限或失效')
  }

  // 搜索视频
  async searchVideos(
    query: string,
    options: {
      maxResults?: number
      pageToken?: string
      publishedAfter?: string
      publishedBefore?: string
      order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount'
    } = {}
  ): Promise<YouTubeSearchResponse> {
    const {
      maxResults = 50,
      pageToken,
      publishedAfter,
      publishedBefore,
      order = 'date'
    } = options

    const searchParams = {
      part: 'id',
      q: query,
      type: 'video',
      maxResults,
      order,
      pageToken,
      publishedAfter,
      publishedBefore
    }

    const searchResponse = await this.makeApiRequest('search', searchParams)
    
    if (!searchResponse.items || searchResponse.items.length === 0) {
      return {
        items: [],
        totalResults: 0,
        resultsPerPage: maxResults,
        nextPageToken: searchResponse.nextPageToken
      }
    }

    const videoIds = searchResponse.items.map((item: any) => item.id.videoId).join(',')
    const videosResponse = await this.makeApiRequest('videos', {
      part: 'snippet,statistics,contentDetails',
      id: videoIds
    })

    const videos: YouTubeVideo[] = videosResponse.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      tags: item.snippet.tags || [],
      categoryId: item.snippet.categoryId,
      viewCount: item.statistics.viewCount || '0',
      likeCount: item.statistics.likeCount || '0',
      favoriteCount: item.statistics.favoriteCount || '0',
      commentCount: item.statistics.commentCount || '0',
      duration: item.contentDetails.duration,
      thumbnails: item.snippet.thumbnails
    }))

    return {
      items: videos,
      totalResults: searchResponse.pageInfo.totalResults,
      resultsPerPage: searchResponse.pageInfo.resultsPerPage,
      nextPageToken: searchResponse.nextPageToken
    }
  }

  // 获取当前使用的API密钥信息
  getCurrentApiInfo(): { index: number; key: string; total: number } {
    return {
      index: this.currentApiIndex,
      key: this.getCurrentApiKey().substring(0, 10) + '...',
      total: this.apiKeys.length
    }
  }
}