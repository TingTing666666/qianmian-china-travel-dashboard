"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
  const [isClient, setIsClient] = React.useState(false)
  const { setOpen } = useSidebar()
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href || (hasChildren && item.children?.some(child => pathname === child.href))

  // 确保只在客户端执行
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // 如果当前路径是子项目之一，自动展开
  React.useEffect(() => {
    if (hasChildren && item.children?.some(child => pathname === child.href)) {
      setIsExpanded(true)
    }
  }, [pathname, item.children, hasChildren])

  const Icon = item.icon

  // 处理收起状态下有子菜单项的点击
  const handleCollapsedClick = () => {
    if (isCollapsed && hasChildren) {
      // 自动打开侧边栏，但不强制跳转页面
      setOpen(true)
      // 展开当前菜单项以显示子菜单
      setIsExpanded(true)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  if (hasChildren) {
    return (
      <div>
        <motion.button
          onClick={handleCollapsedClick}
          className={cn(
            "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isCollapsed ? (
            // 收起状态：只显示居中的图标
            <div className="flex w-full justify-center">
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            </div>
          ) : (
            // 展开状态：显示完整布局
            <>
              <div className="flex items-center min-w-0">
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                <span 
                  className={cn(
                    "transition-all duration-200 overflow-hidden whitespace-nowrap ml-3 opacity-100"
                  )}
                >
                  {item.title}
                </span>
              </div>
              <div className="transition-all duration-200">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </>
          )}
        </motion.button>
        
        {isExpanded && !isCollapsed && (
          <AnimatePresence>
            <motion.div 
              className="ml-6 mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {item.children?.map((child, index) => (
                <motion.div
                    key={child.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                  <Link
                    href={child.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      pathname === child.href && "bg-accent text-accent-foreground"
                    )}
                  >
                    {child.title}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {isClient ? (
        <Link
          href={item.href}
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
        >
          {isCollapsed ? (
            // 收起状态：只显示居中的图标
            <div className="flex w-full justify-center">
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            </div>
          ) : (
            // 展开状态：显示完整布局
            <>
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              <span 
                className={cn(
                  "transition-all duration-200 overflow-hidden whitespace-nowrap ml-3 opacity-100"
                )}
              >
                {item.title}
              </span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>
      ) : (
        // 服务端渲染时的占位符，避免水合错误
        <div
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
        >
          {isCollapsed ? (
            // 收起状态：只显示居中的图标
            <div className="flex w-full justify-center">
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            </div>
          ) : (
            // 展开状态：显示完整布局
            <>
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              <span 
                className={cn(
                  "transition-all duration-200 overflow-hidden whitespace-nowrap ml-3 opacity-100"
                )}
              >
                {item.title}
              </span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

export function Sidebar() {
  const { isOpen, isMobile } = useSidebar()
  
  if (isMobile) {
    return null // 移动端用抽屉组件
  }

  return (
    <motion.div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300 flex-shrink-0",
        isOpen ? "w-64" : "w-16"
      )}
      style={{ minWidth: isOpen ? '256px' : '64px', maxWidth: isOpen ? '256px' : '64px' }}
      animate={{ 
        width: isOpen ? 256 : 64,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo 区域 */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">千</span>
          </div>
          <span 
            className={cn(
              "ml-3 text-lg font-semibold transition-all duration-300 overflow-hidden whitespace-nowrap",
              isOpen ? "max-w-none opacity-100" : "max-w-0 opacity-0"
            )}
          >
            千面中国游
          </span>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <SidebarItem item={item} isCollapsed={!isOpen} />
          </motion.div>
        ))}
      </nav>

      {/* 底部区域 */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div 
            className={cn(
              "ml-3 transition-all duration-300 overflow-hidden",
              isOpen ? "max-w-none opacity-100" : "max-w-0 opacity-0"
            )}
          >
            <p className="text-sm font-medium whitespace-nowrap">管理员</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">admin@example.com</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}