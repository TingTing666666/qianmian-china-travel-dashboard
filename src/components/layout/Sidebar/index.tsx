"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"
import { Home, Info, Video, MessageCircle, ChevronDown, ChevronRight, MapPin } from "lucide-react"
import { NavItem } from "@/types/global"

// 导航配置
const navigationItems: NavItem[] = [
  {
    title: "主页",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "简介",
    href: "/about",
    icon: Info,
  },
  {
    title: "视频看板",
    href: "/videos",
    icon: Video,
    children: [
      {
        title: "时序分析",
        href: "/videos/analysis",
      },
      {
        title: "地域分析",
        href: "/videos/regional",
      },
      {
        title: "视频数据",
        href: "/videos/data",
      },
    ],
  },
  {
    title: "评论看板",
    href: "/comments",
    icon: MessageCircle,
    children: [
      {
        title: "评论分析",
        href: "/comments/analysis",
      },
      {
        title: "评论数据",
        href: "/comments/data",
      },
    ],
  },
]

interface SidebarItemProps {
  item: NavItem
  isCollapsed: boolean
}

function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href || (hasChildren && item.children?.some(child => pathname === child.href))

  // 如果当前路径是子项目之一，自动展开
  React.useEffect(() => {
    if (hasChildren && item.children?.some(child => pathname === child.href)) {
      setIsExpanded(true)
    }
  }, [pathname, item.children, hasChildren])

  const Icon = item.icon

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
        >
          <div className="flex items-center">
            {Icon && <Icon className="mr-3 h-4 w-4" />}
            {!isCollapsed && <span>{item.title}</span>}
          </div>
          {!isCollapsed && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </button>
        
        {isExpanded && !isCollapsed && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === child.href && "bg-accent text-accent-foreground"
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {Icon && <Icon className="mr-3 h-4 w-4" />}
      {!isCollapsed && <span>{item.title}</span>}
      {item.badge && !isCollapsed && (
        <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const { isOpen, isMobile } = useSidebar()
  
  if (isMobile) {
    return null // 移动端用抽屉组件
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo 区域 */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">千</span>
          </div>
          {isOpen && (
            <span className="ml-3 text-lg font-semibold">千面中国游</span>
          )}
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <SidebarItem key={item.href} item={item} isCollapsed={!isOpen} />
        ))}
      </nav>

      {/* 底部区域 */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-muted" />
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">管理员</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}