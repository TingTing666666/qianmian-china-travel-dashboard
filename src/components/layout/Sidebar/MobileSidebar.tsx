/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\layout\Sidebar\MobileSidebar.tsx
 */
"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"
import { Home, Info, Video, MessageCircle, ChevronDown, ChevronRight, X } from "lucide-react"
import { NavItem } from "@/types/global"
import { Button } from "@/components/ui/Button"

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
        title: "热度分析",
        href: "/videos/popularity",
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

interface MobileSidebarItemProps {
  item: NavItem
  onItemClick: () => void
}

function MobileSidebarItem({ item, onItemClick }: MobileSidebarItemProps) {
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

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    } else {
      onItemClick() // 关闭侧边栏
    }
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={handleClick}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
        >
          <div className="flex items-center">
            {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
            <span className="ml-3">{item.title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="ml-8 mt-1 space-y-1 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onItemClick}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname === child.href && "bg-accent text-accent-foreground"
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onItemClick}
      className={cn(
        "flex items-center rounded-lg px-3 py-3 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className="ml-3">{item.title}</span>
      {item.badge && (
        <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function MobileSidebar() {
  const { isOpen, setOpen, isMobile } = useSidebar()

  const handleClose = () => {
    setOpen(false)
  }

  // 只在移动端显示
  if (!isMobile) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* 侧边栏抽屉 */}
          <motion.div
            className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-background border-r shadow-lg overflow-y-auto relative"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* 头部区域 */}
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href="/dashboard" className="flex items-center" onClick={handleClose}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">千</span>
                </div>
                <span className="ml-3 text-lg font-semibold">千面中国游</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                aria-label="关闭侧边栏"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 space-y-1 p-4 pb-20">
              {navigationItems.map((item) => (
                <MobileSidebarItem 
                  key={item.href} 
                  item={item} 
                  onItemClick={handleClose}
                />
              ))}
            </nav>

            {/* 底部区域 */}
            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="ml-3">
                  <p className="text-sm font-medium">管理员</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}