import { NextRequest, NextResponse } from "next/server"

const DEEPSEEK_API_KEY = "sk-4f5b261cc33c4cc78044dccaa6f13356"
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatRequest {
  message: string
  history?: Message[]
  model?: "deepseek-chat" | "deepseek-reasoner"
  stream?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], model = "deepseek-chat", stream = true }: ChatRequest = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "消息内容不能为空" },
        { status: 400 }
      )
    }

    // 构建系统提示词
    const systemPrompt = `你是千面大模型助手，专门分析旅游相关数据。请用简洁、专业的语言回答用户问题。回答的内容越多，越专业越好。不用展示用户输入的数据。
  
请使用标准Markdown格式来组织你的回答，包括：
- 使用 ### 作为标题
- 使用 **粗体** 强调重要内容
- 使用 - 或 1. 创建列表
- 使用适当的格式让内容更易读`

    // 构建消息历史
    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10), // 只保留最近10条消息作为上下文
      { role: "user", content: message }
    ]

    // 调用DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: stream
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("DeepSeek API错误:", errorData)
      return NextResponse.json(
        { error: "AI服务暂时不可用，请稍后再试" },
        { status: 500 }
      )
    }

    // 处理流式响应
    if (stream) {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      const readableStream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader()
          if (!reader) {
            controller.close()
            return
          }

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value)
              const lines = chunk.split('\n')

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6)
                  if (data === '[DONE]') {
                    controller.close()
                    return
                  }

                  try {
                    const parsed = JSON.parse(data)
                    const content = parsed.choices?.[0]?.delta?.content
                    if (content) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                    }
                  } catch (e) {
                    // 忽略解析错误
                  }
                }
              }
            }
          } catch (error) {
            console.error('Stream error:', error)
          } finally {
            controller.close()
          }
        }
      })

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      })
    }

    // 非流式响应
    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      return NextResponse.json(
        { error: "AI响应格式错误" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content: data.choices[0].message.content,
      usage: data.usage
    })

  } catch (error) {
    console.error("聊天API错误:", error)
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    )
  }
}