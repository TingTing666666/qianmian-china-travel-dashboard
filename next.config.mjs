/** @type {import('next').NextConfig} */
const nextConfig = {
  // 新的外部包配置方式（替换 experimental.serverComponentsExternalPackages）
  serverExternalPackages: [
    // 如果您需要排除特定的包，在这里添加
    // 例如：'@tremor/react', 'some-package'
  ],
  
  // 启用实验性功能
  experimental: {
    // 移除已废弃的 serverComponentsExternalPackages
    // 保留其他实验性功能（如果需要的话）
  },
  
  // 图片配置
  images: {
    domains: [
      'i.ytimg.com', // YouTube 缩略图
      'yt3.ggpht.com', // YouTube 头像
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 优化配置
  compiler: {
    // 移除 console.log
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 输出配置
  output: 'standalone',
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
      // 添加一个兜底重定向，防止任何 quotes 路由
      {
        source: '/quotes/:path*',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  
  // 添加 React 严格模式（推荐）
  reactStrictMode: true,
  
  // SWC 压缩在新版本中默认启用，无需手动配置
}

export default nextConfig