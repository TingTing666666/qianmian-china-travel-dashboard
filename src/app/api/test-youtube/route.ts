import { NextRequest, NextResponse } from 'next/server'
import { ProxyAgent } from 'undici'

export async function GET(request: NextRequest) {
  const apiKeys = [
    'AIzaSyCjs1i2BMEnAdiAjSrIp76bWJnJkBgUZx4',
    'AIzaSyAb9NJgZa2e-cE5x42-88t7I3ZM8uXcS0A',
    'AIzaSyBitTQCdHazT9XKcmy3XlmGTD5cu8gWx58',
    'AIzaSyCSX6ohQteHINnrrPl9gcBJFshGgcIKzCY'
  ]

  // 获取代理参数（优先使用请求参数，其次环境变量）
  const { searchParams } = new URL(request.url)
  const proxyParam = searchParams.get('proxyUrl') || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null
  const dispatcher = proxyParam ? new ProxyAgent(proxyParam) : undefined
  const proxyInfo = proxyParam
    ? { inUse: true, proxyUrl: proxyParam, source: searchParams.get('proxyUrl') ? 'request' : 'env' }
    : { inUse: false }

  const results = []

  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i]
    const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&key=${apiKey}`
    
    try {
      console.log(`测试API密钥 ${i + 1}: ${apiKey.substring(0, 10)}... 使用代理: ${proxyParam || '无'}`)
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        dispatcher,
        signal: AbortSignal.timeout(10000)
      })

      if (response.ok) {
        const data = await response.json()
        results.push({
          keyIndex: i + 1,
          key: `${apiKey.substring(0, 10)}...`,
          status: 'success',
          message: `成功获取 ${data.items?.length || 0} 个结果`,
          quota: data.pageInfo?.totalResults || 0
        })
      } else {
        let errorData: any = null
        try {
          errorData = await response.json()
        } catch {}
        results.push({
          keyIndex: i + 1,
          key: `${apiKey.substring(0, 10)}...`,
          status: 'error',
          message: `HTTP ${response.status}: ${errorData?.error?.message || response.statusText}`,
          error: errorData || { statusText: response.statusText }
        })
      }
    } catch (error: any) {
      results.push({
        keyIndex: i + 1,
        key: `${apiKey.substring(0, 10)}...`,
        status: 'failed',
        message: `网络错误: ${error.message}${proxyParam ? ` (代理: ${proxyParam})` : ''}`,
        error: error.toString()
      })
    }
  }

  // 测试Google连通性
  let networkTest = null
  try {
    const testResponse = await fetch('https://www.google.com', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
      dispatcher
    })
    networkTest = {
      status: testResponse.ok ? 'success' : 'failed',
      message: testResponse.ok ? '网络连接正常' : `HTTP ${testResponse.status}`,
      proxy: proxyInfo
    }
  } catch (error: any) {
    networkTest = {
      status: 'failed',
      message: `网络连接失败: ${error.message}${proxyParam ? ` (代理: ${proxyParam})` : ''}`,
      proxy: proxyInfo
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    networkTest,
    apiKeyTests: results,
    proxy: proxyInfo,
    summary: {
      total: apiKeys.length,
      success: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status !== 'success').length
    }
  })
}