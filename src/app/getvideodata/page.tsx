"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  Play, 
  Square, 
  Plus, 
  Trash2, 
  Settings, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Youtube
} from 'lucide-react'
import { generateChinaTravelKeywords } from '@/utils/chinaKeywords'

interface CrawlProgress {
  total: number
  current: number
  percentage: number
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error'
  message: string
  videosProcessed: number
  errors: string[]
}

interface ApiKeyStatus {
  key: string
  status: 'active' | 'quota_exceeded' | 'error'
  requestsUsed: number
  lastUsed: string
}

export default function GetVideoDataPage() {
  const [searchQuery, setSearchQuery] = useState('china travel')
  const [startDate, setStartDate] = useState('2025-04-01')
  const [endDate, setEndDate] = useState('')
  const [maxResults, setMaxResults] = useState(1000)
  const [multiMode, setMultiMode] = useState(false)
  const [keywordListText, setKeywordListText] = useState('')
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])
  const [apiKeys, setApiKeys] = useState<string[]>([
    'AIzaSyCjs1i2BMEnAdiAjSrIp76bWJnJkBgUZx4',
    'AIzaSyAb9NJgZa2e-cE5x42-88t7I3ZM8uXcS0A',
    'AIzaSyBitTQCdHazT9XKcmy3XlmGTD5cu8gWx58',
    'AIzaSyCSX6ohQteHINnrrPl9gcBJFshGgcIKzCY'
  ])
  const [newApiKey, setNewApiKey] = useState('')
  const [currentApiIndex, setCurrentApiIndex] = useState(0)
  const [proxyUrl, setProxyUrl] = useState('')
  const [apiKeyTests, setApiKeyTests] = useState<any[]>([])
  const [apiNetwork, setApiNetwork] = useState<any>(null)
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [queryIndex, setQueryIndex] = useState(0)
  const [queryTotal, setQueryTotal] = useState(0)
  const [pageNumber, setPageNumber] = useState(0)
  const [mode, setMode] = useState<'keyword' | 'daily'>('keyword')
  const [perDayMaxResults, setPerDayMaxResults] = useState(200)
  const [currentDay, setCurrentDay] = useState<string>('')
  const [dayIndex, setDayIndex] = useState(0)
  const [dayTotal, setDayTotal] = useState(0)
  const [crawlProgress, setCrawlProgress] = useState<CrawlProgress>({
    total: 0,
    current: 0,
    percentage: 0,
    status: 'idle',
    message: '准备就绪',
    videosProcessed: 0,
    errors: []
  })
  const [logs, setLogs] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const crawlControllerRef = useRef<AbortController | null>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const logsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 仅滚动日志容器，不滚动整个页面
    const el = logsContainerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [logs])

  useEffect(() => {
    // 初始加载API状态
    (async () => {
      try {
        const url = '/api/test-youtube' + (proxyUrl ? `?proxyUrl=${encodeURIComponent(proxyUrl)}` : '')
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setApiKeyTests(data.apiKeyTests || [])
          setApiNetwork(data.networkTest || null)
        }
      } catch (e) {}
    })()
  }, [])

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    setLogs(prev => [...prev, logMessage])
  }

  const handleGenerateKeywords = () => {
    const kws = generateChinaTravelKeywords({ includeBase: true, includeProvinceCombos: true })
    setGeneratedKeywords(kws)
    setKeywordListText(kws.join('\n'))
    addLog(`生成关键词 ${kws.length} 个`, 'success')
  }

  const handleApplyMultiKeywords = () => {
    const list = keywordListText.split('\n').map(s => s.trim()).filter(Boolean)
    if (list.length === 0) {
      addLog('关键词列表为空，无法应用多关键词模式', 'error')
      return
    }
    setGeneratedKeywords(list)
    setMultiMode(true)
    addLog(`已启用多关键词模式，共 ${list.length} 个关键词`, 'info')
  }

  const handleAddApiKey = () => {
    if (newApiKey.trim() && !apiKeys.includes(newApiKey.trim())) {
      setApiKeys(prev => [...prev, newApiKey.trim()])
      setNewApiKey('')
      addLog(`添加新的API密钥: ${newApiKey.substring(0, 10)}...`, 'success')
    }
  }

  const handleRemoveApiKey = (index: number) => {
    const removedKey = apiKeys[index]
    setApiKeys(prev => prev.filter((_, i) => i !== index))
    if (currentApiIndex >= apiKeys.length - 1) {
      setCurrentApiIndex(0)
    }
    addLog(`删除API密钥: ${removedKey.substring(0, 10)}...`, 'warning')
  }

  const refreshApiStatus = async () => {
    try {
      const url = '/api/test-youtube' + (proxyUrl ? `?proxyUrl=${encodeURIComponent(proxyUrl)}` : '')
      const res = await fetch(url)
      const data = await res.json()
      setApiKeyTests(data.apiKeyTests || [])
      setApiNetwork(data.networkTest || null)
      addLog('已刷新API状态', 'info')
    } catch (e: any) {
      addLog(`刷新API状态失败: ${e.message}`, 'error')
    }
  }

  const handleStartCrawl = async () => {
    if (apiKeys.length === 0) {
      addLog('错误: 没有可用的API密钥', 'error')
      return
    }

    crawlControllerRef.current = new AbortController()
    
    setCrawlProgress(prev => ({
      ...prev,
      status: 'running',
      message: '开始爬取...',
      current: 0,
      percentage: 0,
      errors: []
    }))
    setCurrentKeyword(multiMode ? (generatedKeywords[0] || '') : searchQuery)
    setQueryIndex(0)
    setQueryTotal(multiMode ? generatedKeywords.length : 1)
    setPageNumber(0)
    if (mode === 'daily') {
      setCurrentDay(startDate)
      setDayIndex(0)
      setDayTotal(endDate ? Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 3600 * 1000)) + 1 : 1)
    } else {
      setCurrentDay('')
      setDayIndex(0)
      setDayTotal(0)
    }
    addLog(`开始爬取视频数据`, 'info')
    if (multiMode) {
      addLog(`多关键词模式: ${generatedKeywords.length} 个关键词`, 'info')
    } else {
      addLog(`搜索关键词: ${searchQuery}`, 'info')
    }
    addLog(`开始日期: ${startDate}`, 'info')
    if (endDate) addLog(`结束日期: ${endDate}`, 'info')
    addLog(`最大结果数: ${maxResults}`, 'info')
    addLog(`可用API密钥数量: ${apiKeys.length}`, 'info')
    if (proxyUrl) {
      addLog(`使用代理: ${proxyUrl}`, 'info')
    } else {
      addLog(`未设置代理，将使用环境配置（若有）`, 'warning')
    }

    try {
      const response = await fetch('/api/crawl-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          startDate,
          endDate: endDate || undefined,
          maxResults,
          apiKeys,
          proxyUrl: proxyUrl || undefined,
          queries: multiMode ? generatedKeywords : undefined,
          mode,
          perDayMaxResults
        }),
        signal: crawlControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'progress') {
                  setCrawlProgress(prev => ({
                    ...prev,
                    current: data.current,
                    total: data.total,
                    percentage: Math.round((data.current / data.total) * 100),
                    message: data.message,
                    videosProcessed: data.videosProcessed || prev.videosProcessed
                  }))
                } else if (data.type === 'log') {
                  addLog(data.message, data.level || 'info')
                } else if (data.type === 'api_switch') {
                  setCurrentApiIndex(data.apiIndex)
                  addLog(`切换到API密钥 #${data.apiIndex + 1}`, 'warning')
                } else if (data.type === 'api_info') {
                  setCurrentApiIndex(data.api.index)
                } else if (data.type === 'api_status') {
                  addLog(`API状态: ${data.status}`, 'warning')
                } else if (data.type === 'query_start') {
                  setCurrentKeyword(data.query || '')
                  setQueryIndex(data.index || 0)
                  setQueryTotal(data.total || (multiMode ? generatedKeywords.length : 1))
                  setPageNumber(1)
                  addLog(`开始当前关键词 (${data.index + 1}/${data.total}): ${data.query}`, 'info')
                } else if (data.type === 'query_progress') {
                  setPageNumber(data.page || 1)
                } else if (data.type === 'day_start') {
                  setCurrentDay(data.day || '')
                  setDayIndex(data.index || 0)
                  setDayTotal(data.total || (endDate ? Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 3600 * 1000)) + 1 : 1))
                } else if (data.type === 'day_progress') {
                  // 可选择根据分页更新当前页或其他状态
                  setPageNumber(data.page || 1)
                } else if (data.type === 'day_completed') {
                  // 日结束提示
                  addLog(`日期 ${data.day} 完成，处理 ${data.processed || 0} 个视频`, 'success')
                }
              } catch (e) {
                console.error('解析SSE数据失败:', e)
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setCrawlProgress(prev => ({
          ...prev,
          status: 'paused',
          message: '爬取已停止'
        }))
        addLog('爬取已被用户停止', 'warning')
      } else {
        setCrawlProgress(prev => ({
          ...prev,
          status: 'error',
          message: '爬取失败'
        }))
        addLog(`爬取失败: ${error.message}`, 'error')
      }
    }
  }

  const handleStopCrawl = () => {
    if (crawlControllerRef.current) {
      crawlControllerRef.current.abort()
      crawlControllerRef.current = null
    }
  }

  const handleClearLogs = () => {
    setLogs([])
  }

  const runDedupe = async () => {
    try {
      const res = await fetch('/api/videos/dedupe', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        addLog(`查重完成，删除 ${data.deletedCount} 条，重复组 ${data.duplicateGroups} 个`, 'success')
      } else {
        addLog(`查重失败: ${data.error}`, 'error')
      }
    } catch (e: any) {
      addLog(`查重请求失败: ${e.message}`, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Youtube className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">YouTube 数据爬取</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>设置</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>爬取配置</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="searchQuery">搜索关键词</Label>
                  <Input
                    id="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入搜索关键词"
                    disabled={crawlProgress.status === 'running' || multiMode}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">开始日期</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={crawlProgress.status === 'running'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">结束日期（可选）</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={crawlProgress.status === 'running'}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="maxResults">最大结果数</Label>
                  <Input
                    id="maxResults"
                    type="number"
                    value={maxResults}
                    onChange={(e) => setMaxResults(parseInt(e.target.value) || 1000)}
                    min="1"
                    max="10000"
                    disabled={crawlProgress.status === 'running'}
                  />
                </div>

                <div>
                  <Label htmlFor="proxyUrl">代理地址（可选）</Label>
                  <Input
                    id="proxyUrl"
                    value={proxyUrl}
                    onChange={(e) => setProxyUrl(e.target.value)}
                    placeholder="http://127.0.0.1:7890"
                    disabled={crawlProgress.status === 'running'}
                  />
                </div>

                <div>
                  <Label>爬取模式</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={mode === 'keyword' ? 'default' : 'outline'}
                      onClick={() => setMode('keyword')}
                      disabled={crawlProgress.status === 'running'}
                    >关键词优先</Button>
                    <Button
                      size="sm"
                      variant={mode === 'daily' ? 'default' : 'outline'}
                      onClick={() => setMode('daily')}
                      disabled={crawlProgress.status === 'running'}
                    >按天模式</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label htmlFor="perDayMaxResults">单日日上限</Label>
                      <Input
                        id="perDayMaxResults"
                        type="number"
                        value={perDayMaxResults}
                        onChange={(e) => setPerDayMaxResults(parseInt(e.target.value) || 200)}
                        min="1"
                        max="1000"
                        disabled={crawlProgress.status === 'running' || mode !== 'daily'}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">按天模式会按日期依次遍历所有关键词。</div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleStartCrawl}
                    disabled={crawlProgress.status === 'running' || apiKeys.length === 0}
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>开始爬取</span>
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={handleStopCrawl}
                    disabled={crawlProgress.status !== 'running'}
                    className="flex items-center justify-center"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>关键词生成器</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleGenerateKeywords}>生成关键词</Button>
                  <Button size="sm" variant={multiMode ? 'default' : 'outline'} onClick={handleApplyMultiKeywords}>
                    应用为多关键词模式
                  </Button>
                </div>
                <Textarea
                  value={keywordListText}
                  onChange={(e) => setKeywordListText(e.target.value)}
                  placeholder="每行一个关键词（可编辑）"
                  className="min-h-[160px]"
                />
                <div className="text-xs text-gray-500">将自动组合“省份 + travel”等英文关键词</div>
              </CardContent>
            </Card>

            {isSettingsOpen && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>API密钥管理与状态</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="输入新的API密钥"
                      className="flex-1"
                    />
                    <Button onClick={handleAddApiKey} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {apiKeys.map((key, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Badge variant={index === currentApiIndex ? 'default' : 'secondary'}>
                            #{index + 1}
                          </Badge>
                          <span className="font-mono text-sm">
                            {key.substring(0, 10)}...
                          </span>
                          {index === currentApiIndex && (
                            <span className="text-xs text-blue-600">正在使用</span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveApiKey(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">API状态</span>
                      <Button size="sm" variant="outline" onClick={refreshApiStatus}>刷新状态</Button>
                    </div>
                    <div className="space-y-1">
                      {apiKeyTests && apiKeyTests.length > 0 ? (
                        apiKeyTests.map((t: any) => (
                          <div key={t.keyIndex} className="flex items-center justify-between text-xs p-2 border rounded">
                            <div>
                              <span className="font-mono mr-2">#{t.keyIndex} {t.key}</span>
                              <span className={t.status === 'success' ? 'text-green-600' : t.status === 'failed' ? 'text-red-600' : 'text-amber-600'}>
                                {t.status}
                              </span>
                            </div>
                            <div className="text-gray-500">{t.message}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500">暂无状态</div>
                      )}
                      {apiNetwork && (
                        <div className="text-xs text-gray-600">网络: {apiNetwork.message} {apiNetwork.proxy?.inUse ? `(代理: ${apiNetwork.proxy.proxyUrl})` : ''}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>查重工具</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={runDedupe}>查重并删除</Button>
                <div className="text-xs text-gray-500">按“标题 + 频道ID”去重，保留观看数高/发布时间新的记录。</div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>爬取进度</span>
                  </div>
                  <Badge 
                    variant={
                      crawlProgress.status === 'running' ? 'default' :
                      crawlProgress.status === 'completed' ? 'secondary' :
                      crawlProgress.status === 'error' ? 'destructive' : 'outline'
                    }
                  >
                    {crawlProgress.status === 'idle' && '待机'}
                    {crawlProgress.status === 'running' && '运行中'}
                    {crawlProgress.status === 'paused' && '已暂停'}
                    {crawlProgress.status === 'completed' && '已完成'}
                    {crawlProgress.status === 'error' && '错误'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{crawlProgress.message}</span>
                    <span>{crawlProgress.current} / {crawlProgress.total}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    日期: {currentDay || (endDate ? `${startDate} ~ ${endDate}` : startDate)} （{dayIndex + 1}/{dayTotal || (mode === 'daily' ? Math.max(1, Math.floor((new Date(endDate || startDate).getTime() - new Date(startDate).getTime()) / (24 * 3600 * 1000)) + 1) : 1)}） · 关键词: {currentKeyword ? `"${currentKeyword}"` : '-'} （{queryIndex + 1}/{queryTotal || (multiMode ? generatedKeywords.length : 1)}） · 分页: 第 {pageNumber || 0} 页
                  </div>
                  <Progress value={crawlProgress.percentage} className="w-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>已处理: {crawlProgress.videosProcessed}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span>错误: {crawlProgress.errors.length}</span>
                  </div>
                </div>

                {crawlProgress.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">错误信息:</h4>
                    <div className="bg-red-50 border border-red-200 rounded p-2 max-h-20 overflow-y-auto">
                      {crawlProgress.errors.map((error, index) => (
                        <div key={index} className="text-xs text-red-700">{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>实时日志</span>
                  <Button variant="outline" size="sm" onClick={handleClearLogs}>
                    清空日志
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto" ref={logsContainerRef}>
                  {logs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}