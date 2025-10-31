import { NextRequest, NextResponse } from 'next/server'
import { YouTubeApiService } from '@/services/youtubeApiService'
import { VideoService } from '@/services/videoService'
import { VideoData } from '@/types/video'

export interface CrawlRequest {
  query?: string
  startDate?: string
  endDate?: string
  maxResults?: number
  queries?: string[]
  apiKeys?: string[]
  proxyUrl?: string
  mode?: 'keyword' | 'daily'
  perDayMaxResults?: number
}

function convertYouTubeToVideoData(youtubeVideo: any): Omit<VideoData, 'created_at' | 'updated_at'> {
  return {
    id: youtubeVideo.id,
    title: youtubeVideo.title || null,
    description: youtubeVideo.description || null,
    published_at: youtubeVideo.publishedAt || null,
    channel_title: youtubeVideo.channelTitle || null,
    channel_id: youtubeVideo.channelId || null,
    tags: youtubeVideo.tags ? youtubeVideo.tags.join(',') : null,
    category_id: youtubeVideo.categoryId ? parseInt(youtubeVideo.categoryId) : null,
    view_count: youtubeVideo.viewCount ? parseInt(youtubeVideo.viewCount) : null,
    like_count: youtubeVideo.likeCount ? parseInt(youtubeVideo.likeCount) : null,
    favorite_count: youtubeVideo.favoriteCount ? parseInt(youtubeVideo.favoriteCount) : null,
    comment_count: youtubeVideo.commentCount ? parseInt(youtubeVideo.commentCount) : null,
    duration: youtubeVideo.duration || null
  }
}

function parseDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return duration
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  } else {
    return `${m}:${s.toString().padStart(2, '0')}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CrawlRequest = await request.json()
    const { query, startDate, maxResults, apiKeys, proxyUrl } = body
    const { queries = [], endDate, mode = 'keyword', perDayMaxResults } = body

    if ((!query && (!queries || queries.length === 0)) || !startDate || !maxResults || !apiKeys || apiKeys.length === 0) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const sendMessage = (msg: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`))
        }

        const youtubeService = new YouTubeApiService(apiKeys, proxyUrl)
        const videoService = new VideoService()

        const batchSize = 50
        let totalProcessed = 0
        let totalErrors = 0
        let heartbeat: any

        // 将多关键词列表标准化
        const queryList = (queries && queries.length > 0) ? queries : [query]

        const parseDuration = (iso: string) => {
          const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
          if (!match) return iso
          const hours = parseInt(match[1] || '0')
          const minutes = parseInt(match[2] || '0')
          const seconds = parseInt(match[3] || '0')
          if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          }
          return `${minutes}:${seconds.toString().padStart(2, '0')}`
        }

        (async () => {
          try {
            // 心跳: 避免长时间无输出让前端感觉卡住
            heartbeat = setInterval(() => {
              sendMessage({ type: 'heartbeat', ts: Date.now(), message: '仍在处理，请稍候' })
            }, 5000)

            sendMessage({ type: 'log', message: `开始爬取，关键词数量: ${queryList.length}`, level: 'info' })
            sendMessage({ type: 'log', message: `时间范围: ${startDate}${endDate ? ` ~ ${endDate}` : ''}`, level: 'info' })

            // 计算日列表（按天模式）
            const buildDayList = (start: string, end?: string) => {
              const s = new Date(start)
              const e = new Date(end || start)
              const days: string[] = []
              const cur = new Date(s)
              // 归零到当天 00:00（以本地时间）
              cur.setHours(0, 0, 0, 0)
              e.setHours(0, 0, 0, 0)
              while (cur.getTime() <= e.getTime()) {
                const y = cur.getFullYear()
                const m = (cur.getMonth() + 1).toString().padStart(2, '0')
                const d = cur.getDate().toString().padStart(2, '0')
                days.push(`${y}-${m}-${d}`)
                cur.setDate(cur.getDate() + 1)
              }
              return days
            }

            if (mode === 'daily') {
              const dayList = buildDayList(startDate, endDate)
              sendMessage({ type: 'log', message: `按天模式，总天数: ${dayList.length}`, level: 'info' })

              for (let di = 0; di < dayList.length; di++) {
                const day = dayList[di]
                if (totalProcessed >= maxResults) break

                const publishedAfter = new Date(`${day}T00:00:00.000Z`).toISOString()
                const publishedBefore = new Date(`${day}T23:59:59.999Z`).toISOString()

                let dayProcessed = 0
                const dayLimit = typeof perDayMaxResults === 'number' && perDayMaxResults > 0 ? perDayMaxResults : Infinity

                sendMessage({ type: 'day_start', day, index: di, total: dayList.length })

                for (let qi = 0; qi < queryList.length; qi++) {
                  const q = queryList[qi]
                  if (totalProcessed >= maxResults) break
                  if (dayProcessed >= dayLimit) {
                    sendMessage({ type: 'log', message: `当天 ${day} 达到日上限 ${dayLimit}，跳过剩余词条`, level: 'warning' })
                    break
                  }

                  let pageToken: string | undefined = undefined
                  let pageNumber = 1

                  sendMessage({ type: 'log', message: `开始处理日期: ${day}，关键词: "${q}"`, level: 'info' })
                  sendMessage({ type: 'query_start', query: q, index: qi, total: queryList.length })

                  while (totalProcessed < maxResults && dayProcessed < dayLimit) {
                    try {
                      const remainingResults = Math.min(maxResults - totalProcessed, dayLimit - dayProcessed)
                      const currentBatchSize = Math.min(batchSize, remainingResults)

                      sendMessage({ type: 'api_info', api: youtubeService.getCurrentApiInfo() })
                      sendMessage({ type: 'log', message: `正在搜索批次，日期: ${day}，关键词: "${q}"`, level: 'info' })
                      sendMessage({ type: 'query_progress', query: q, index: qi, total: queryList.length, page: pageNumber })
                      sendMessage({ type: 'day_progress', day, index: di, total: dayList.length, page: pageNumber })

                      const searchResponse = await youtubeService.searchVideos(q, {
                        maxResults: currentBatchSize,
                        pageToken,
                        publishedAfter,
                        publishedBefore,
                        order: 'date'
                      })

                      if (!searchResponse.items || searchResponse.items.length === 0) {
                        sendMessage({ type: 'log', message: `日期 ${day}，关键词 "${q}" 没有找到更多视频`, level: 'warning' })
                        break
                      }

                      sendMessage({ type: 'log', message: `日期 ${day} 找到 ${searchResponse.items.length} 个视频，开始处理...`, level: 'info' })

                      for (let i = 0; i < searchResponse.items.length; i++) {
                        const video = searchResponse.items[i]

                        try {
                          const videoData = convertYouTubeToVideoData(video)

                          if (videoData.duration) {
                            videoData.duration = parseDuration(videoData.duration)
                          }

                          const existingVideo = await videoService.getVideoById(videoData.id)

                          if (existingVideo) {
                            await videoService.updateVideo(videoData.id, videoData)
                            sendMessage({ type: 'log', message: `更新视频: ${videoData.id} - ${videoData.title}`, level: 'success' })
                          } else {
                            await videoService.createVideo(videoData)
                            sendMessage({ type: 'log', message: `保存视频: ${videoData.id} - ${videoData.title}`, level: 'success' })
                          }

                          totalProcessed++
                          dayProcessed++
                          sendMessage({ type: 'progress', current: totalProcessed, total: maxResults, message: `已处理 ${totalProcessed}/${maxResults}` })

                          if (totalProcessed >= maxResults || dayProcessed >= dayLimit) break
                        } catch (error: any) {
                          totalErrors++
                          const errMsg = error.message || String(error)
                          sendMessage({ type: 'error', message: `处理视频失败: ${errMsg}` })
                          sendMessage({ type: 'log', message: `处理视频失败: ${errMsg}`, level: 'error' })
                        }
                      }

                      pageToken = searchResponse.nextPageToken
                      if (pageToken) {
                        pageNumber++
                      }

                      if (!pageToken) {
                        sendMessage({ type: 'log', message: `日期 ${day}，关键词 "${q}" 已处理完所有分页`, level: 'info' })
                        break
                      }
                    } catch (error: any) {
                      const errMsg = error.message || String(error)
                      if (errMsg.includes('配额') || errMsg.toLowerCase().includes('quota')) {
                        sendMessage({ type: 'api_status', status: 'quota_exceeded', api: youtubeService.getCurrentApiInfo() })
                        sendMessage({ type: 'api_switch', apiIndex: youtubeService.getCurrentApiInfo().index, message: '切换API密钥' })
                        sendMessage({ type: 'log', message: `API密钥配额超限: ${errMsg}`, level: 'warning' })
                        continue
                      } else {
                        sendMessage({ type: 'error', message: `搜索失败: ${errMsg}` })
                        sendMessage({ type: 'log', message: `搜索失败: ${errMsg}`, level: 'error' })
                        break
                      }
                    }
                  }
                }

                sendMessage({ type: 'day_completed', day, processed: dayProcessed })
              }
            } else {
              // 词条模式（默认）
              for (let qi = 0; qi < queryList.length; qi++) {
                const q = queryList[qi]
                if (totalProcessed >= maxResults) break
                let pageToken: string | undefined = undefined
                let pageNumber = 1

                sendMessage({ type: 'log', message: `开始处理关键词: "${q}"`, level: 'info' })
                sendMessage({ type: 'query_start', query: q, index: qi, total: queryList.length })

                while (totalProcessed < maxResults) {
                  try {
                    const remainingResults = maxResults - totalProcessed
                    const currentBatchSize = Math.min(batchSize, remainingResults)

                    sendMessage({ type: 'api_info', api: youtubeService.getCurrentApiInfo() })
                    sendMessage({ type: 'log', message: `正在搜索批次，关键词: "${q}"`, level: 'info' })
                    sendMessage({ type: 'query_progress', query: q, index: qi, total: queryList.length, page: pageNumber })

                    const searchResponse = await youtubeService.searchVideos(q, {
                      maxResults: currentBatchSize,
                      pageToken,
                      publishedAfter: new Date(startDate).toISOString(),
                      publishedBefore: endDate ? new Date(endDate).toISOString() : undefined,
                      order: 'date'
                    })

                    if (!searchResponse.items || searchResponse.items.length === 0) {
                      sendMessage({ type: 'log', message: `关键词 "${q}" 没有找到更多视频`, level: 'warning' })
                      break
                    }

                    sendMessage({ type: 'log', message: `找到 ${searchResponse.items.length} 个视频，开始处理...`, level: 'info' })

                    for (let i = 0; i < searchResponse.items.length; i++) {
                      const video = searchResponse.items[i]

                      try {
                        const videoData = convertYouTubeToVideoData(video)

                        if (videoData.duration) {
                          videoData.duration = parseDuration(videoData.duration)
                        }

                        const existingVideo = await videoService.getVideoById(videoData.id)

                        if (existingVideo) {
                          await videoService.updateVideo(videoData.id, videoData)
                          sendMessage({ type: 'log', message: `更新视频: ${videoData.id} - ${videoData.title}`, level: 'success' })
                        } else {
                          await videoService.createVideo(videoData)
                          sendMessage({ type: 'log', message: `保存视频: ${videoData.id} - ${videoData.title}`, level: 'success' })
                        }

                        totalProcessed++
                        sendMessage({ type: 'progress', current: totalProcessed, total: maxResults, message: `已处理 ${totalProcessed}/${maxResults}` })

                        if (totalProcessed >= maxResults) break
                      } catch (error: any) {
                        totalErrors++
                        const errMsg = error.message || String(error)
                        sendMessage({ type: 'error', message: `处理视频失败: ${errMsg}` })
                        sendMessage({ type: 'log', message: `处理视频失败: ${errMsg}`, level: 'error' })
                      }
                    }

                    pageToken = searchResponse.nextPageToken
                    if (pageToken) {
                      pageNumber++
                    }

                    if (!pageToken) {
                      sendMessage({ type: 'log', message: `关键词 "${q}" 已处理完所有分页`, level: 'info' })
                      break
                    }
                  } catch (error: any) {
                    const errMsg = error.message || String(error)
                    if (errMsg.includes('配额') || errMsg.toLowerCase().includes('quota')) {
                      sendMessage({ type: 'api_status', status: 'quota_exceeded', api: youtubeService.getCurrentApiInfo() })
                      sendMessage({ type: 'api_switch', apiIndex: youtubeService.getCurrentApiInfo().index, message: '切换API密钥' })
                      sendMessage({ type: 'log', message: `API密钥配额超限: ${errMsg}`, level: 'warning' })
                      continue
                    } else {
                      sendMessage({ type: 'error', message: `搜索失败: ${errMsg}` })
                      sendMessage({ type: 'log', message: `搜索失败: ${errMsg}`, level: 'error' })
                      break
                    }
                  }
                }
              }
            }

            sendMessage({ type: 'completed', totalProcessed, totalErrors, message: '爬取完成' })
            sendMessage({ type: 'log', message: `爬取完成! 总共处理 ${totalProcessed} 个视频，错误 ${totalErrors} 个`, level: 'success' })

          } catch (error: any) {
            sendMessage({ type: 'error', message: `爬取过程发生错误: ${error.message}` })
            sendMessage({ type: 'log', message: `爬取过程发生错误: ${error.message}`, level: 'error' })
          } finally {
            if (heartbeat) clearInterval(heartbeat)
            controller.close()
          }
        })()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: any) {
    console.error('爬取API错误:', error)
    return NextResponse.json(
      { error: `服务器错误: ${error.message}` },
      { status: 500 }
    )
  }
}

const sendEvent = (controller: ReadableStreamDefaultController, type: string, payload: any = {}) => {
  const data = JSON.stringify({ type, ...payload })
  const encoder = new TextEncoder()
  const chunk = encoder.encode(`data: ${data}\n\n`)
  controller.enqueue(chunk)
}