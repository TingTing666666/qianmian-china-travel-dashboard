"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

// 路径名称映射
const pathNameMap: Record<string, string> = {
  dashboard: "主页",
  about: "简介",
  videos: "视频看板",
  analysis: "分析",
  data: "数据",
  comments: "评论看板",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  // 构建面包屑数据
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const name = pathNameMap[segment] || segment
    const isLast = index === pathSegments.length - 1

    return {
      name,
      href,
      isLast,
    }
  })

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          {breadcrumb.isLast ? (
            <span className="ml-1 font-medium text-foreground">
              {breadcrumb.name}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="ml-1 hover:text-foreground"
            >
              {breadcrumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}