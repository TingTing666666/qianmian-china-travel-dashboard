/*
 * @Date: 2025-09-09 13:39:43
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-10 11:38:49
 * @FilePath: \qianmian-china-travel-dashboard\src\app\layout.tsx
 */
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/layout/Sidebar/SidebarProvider"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileSidebar } from "@/components/layout/Sidebar/MobileSidebar"
import { Header } from "@/components/layout/Header"
import { PageTransition } from "@/components/layout/PageTransition"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "中国旅游",
    "视频分析",
    "数据平台",
    "YouTube",
    "内容分析",
  ],
  authors: [
    {
      name: siteConfig.creator.name,
      url: siteConfig.creator.url,
    },
  ],
  creator: siteConfig.creator.name,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen">
              <Sidebar />
              <MobileSidebar />
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-hidden">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}