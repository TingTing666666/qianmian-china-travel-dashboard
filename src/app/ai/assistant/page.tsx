"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Send, Bot, User, BarChart3, TrendingUp, Users, MapPin, Sparkles, MessageSquare, Brain, Square, ChevronRight, BrainCircuit, BrainCog, Zap, ZapOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface DataItem {
  id: string
  title: string
  description: string
  value: string | number
  type: "video" | "comment" | "region" | "trend"
  data?: any
}

// 模拟数据条
const sampleDataItems: DataItem[] = [
  {
    id: "1",
    title: "热门视频数据",
    description: "最近30天播放量前10的视频",
    value: "10条记录",
    type: "video",
    data: { totalViews: 1250000, avgDuration: "8:32" }
  },
  {
    id: "2", 
    title: "评论情感分析",
    description: "用户评论情感倾向统计",
    value: "85%正面",
    type: "comment",
    data: { positive: 85, negative: 10, neutral: 5 }
  },
  {
    id: "3",
    title: "地域分布数据", 
    description: "视频观看地域分布情况",
    value: "34个省市",
    type: "region",
    data: { topRegions: ["北京", "上海", "广东", "浙江", "江苏"] }
  },
  {
    id: "4",
    title: "趋势分析报告",
    description: "近期旅游热点趋势变化",
    value: "上升12%",
    type: "trend", 
    data: { growth: 12, period: "30天", category: "文化旅游" }
  }
]

const getDataIcon = (type: DataItem["type"]) => {
  switch (type) {
    case "video": return BarChart3
    case "comment": return MessageSquare
    case "region": return MapPin
    case "trend": return TrendingUp
    default: return BarChart3
  }
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant", 
      content: "您好！我是千面大模型助手，专门为您分析旅游数据。您可以向我提问关于视频数据、评论分析、地域分布等任何问题，或者点击右侧的数据条让我为您分析。",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isThinkingMode, setIsThinkingMode] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [hoveredDataItem, setHoveredDataItem] = useState<DataItem | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAbort = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsLoading(false)
      
      // 添加中断消息
      const abortMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "思考已被中断。",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, abortMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 创建新的 AbortController
    const controller = new AbortController()
    setAbortController(controller)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input.trim(),
          history: messages.slice(-10),
          model: isThinkingMode ? "deepseek-reasoner" : "deepseek-chat",
          stream: true
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error("API调用失败")
      }

      // 创建流式消息
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      // 处理流式响应
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedContent = ""
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                // 流结束，更新消息状态
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, isStreaming: false }
                    : msg
                ))
                setIsLoading(false)
                setAbortController(null)
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.content
                if (content) {
                  accumulatedContent += content
                  // 实时更新消息内容
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ))
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求被中断')
        return
      }
      
      console.error("发送消息失败:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: "抱歉，我暂时无法回应您的消息。请稍后再试。",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setAbortController(null)
    }
  }

  const handleDataItemClick = async (item: DataItem) => {
    const prompt = `请分析以下数据：${item.title} - ${item.description}。数据详情：${JSON.stringify(item.data)}`
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `分析数据：${item.title}`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          history: messages.slice(-10),
          model: isThinkingMode ? "deepseek-reasoner" : "deepseek-chat",
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error("API调用失败")
      }

      // 创建流式消息
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      // 处理流式响应
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedContent = ""
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                // 流结束，更新消息状态
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, isStreaming: false }
                    : msg
                ))
                setIsLoading(false)
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.content
                if (content) {
                  accumulatedContent += content
                  // 实时更新消息内容
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ))
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("数据分析失败:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，数据分析失败。请稍后再试。",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDataItemHover = (item: DataItem | null, e?: React.MouseEvent) => {
    if (item && e) {
      const rect = e.currentTarget.getBoundingClientRect()
      setHoverPosition({
        x: rect.left - 300, // 悬浮框宽度为280px，留20px边距
        y: rect.top
      })
    }
    setHoveredDataItem(item)
  }

  const renderDataTooltip = () => {
    if (!hoveredDataItem) return null

    return (
      <div 
        className="fixed z-50 bg-background border rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto"
        style={{
          left: `${hoverPosition.x}px`,
          top: `${hoverPosition.y}px`,
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {(() => {
                const IconComponent = getDataIcon(hoveredDataItem.type)
                return <IconComponent className="h-4 w-4" />
              })()}
            </div>
            <h3 className="font-semibold text-sm">{hoveredDataItem.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{hoveredDataItem.description}</p>
          <div className="bg-muted rounded p-3">
            <div className="text-xs font-medium mb-2">数据详情:</div>
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {JSON.stringify(hoveredDataItem.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* 顶部标题栏 - 完全固定 */}
      <div className="flex border-b bg-card flex-shrink-0">
        {/* 左侧标题 */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">千面大模型助手</h1>
              <p className="text-sm text-muted-foreground">AI驱动的旅游数据分析专家</p>
            </div>
          </div>
        </div>
        
        {/* 右侧数据概览标题 */}
        <div className="w-80 border-l p-4">
          <h2 className="font-semibold text-lg">数据概览</h2>
          <p className="text-sm text-muted-foreground mt-1">
            点击数据卡片进行AI分析
          </p>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 聊天区域 - 可滚动 */}
        <div className="flex-1 flex flex-col pb-20">
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <MarkdownRenderer content={message.content} />
                        </div>
                        <div className="mt-2 text-xs opacity-70">
                          {isClient ? message.timestamp.toLocaleTimeString() : ''}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && messages.length > 0 && !messages[messages.length - 1].isStreaming && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI正在思考...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
            </ScrollArea>
          </div>

          {/* 右侧数据面板 - 只有数据列表可滚动 */}
          <div className="w-80 border-l bg-card">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {sampleDataItems.map((item) => {
                  const Icon = getDataIcon(item.type)
                  return (
                    <Card 
                      key={item.id} 
                      className="cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                      onClick={() => handleDataItemClick(item)}
                      onMouseEnter={(e) => handleDataItemHover(item, e)}
                      onMouseLeave={() => handleDataItemHover(null)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-sm truncate">{item.title}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs font-medium">
                                {item.value}
                              </Badge>
                              <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                <span>分析</span>
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* 固定在底部的输入框 */}
       <div className="fixed bottom-0 left-0 right-80 border-t bg-card p-4 z-10">
         <div className="flex gap-2 max-w-4xl mx-auto">
           <Input
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyPress={handleKeyPress}
             placeholder="输入您的问题或数据分析需求..."
             className="flex-1"
             disabled={isLoading}
           />
           
           {/* 思考模式切换按钮 - 主流AI风格 */}
           <div className="flex items-center">
             <Button
               variant={isThinkingMode ? "default" : "outline"}
               size="sm"
               onClick={() => setIsThinkingMode(!isThinkingMode)}
               disabled={isLoading}
               className={cn(
                 "relative px-3 py-2 h-9 flex items-center gap-2 transition-all duration-200",
                 isThinkingMode 
                   ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg" 
                   : "border-2 border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/50"
               )}
               title={isThinkingMode ? "关闭思考模式" : "开启思考模式"}
             >
               {isThinkingMode ? (
                 <>
                   <div className="relative">
                     <Zap className="h-4 w-4" />
                     <div className="absolute inset-0 animate-pulse">
                       <Zap className="h-4 w-4 opacity-50" />
                     </div>
                   </div>
                   <span className="font-medium">思考中</span>
                 </>
               ) : (
                 <>
                   <Brain className="h-4 w-4" />
                   <span>思考模式</span>
                 </>
               )}
             </Button>
           </div>
           
           {/* 打断按钮 */}
           {isLoading && (
             <Button
               variant="destructive"
               size="icon"
               onClick={handleAbort}
               title="打断思考"
             >
               <Square className="h-4 w-4" />
             </Button>
           )}
           
           <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              size="sm"
              className={cn(
                "rounded-full px-4 h-9 transition-all duration-200",
                isLoading 
                  ? "opacity-60 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow hover:shadow-md hover:brightness-105"
              )}
              aria-label="发送消息"
              title="发送消息"
            >
              <Send className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">发送</span>
            </Button>
         </div>
       </div>
       
       {/* 悬浮数据详情 */}
       {renderDataTooltip()}
     </div>
   )
}