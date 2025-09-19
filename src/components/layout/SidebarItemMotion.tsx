"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSidebar } from "./Sidebar/SidebarProvider"
import { ChevronDown, ChevronRight } from "lucide-react"
import { NavItem } from "@/types/global"

interface SidebarItemMotionProps {
  item: NavItem
  isCollapsed: boolean
}

// 导航项动画变体
const itemVariants = {
  hover: {
    scale: 1.02,
    backgroundColor: "hsl(var(--accent))",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

// 图标旋转动画变体
const iconVariants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 90 }
}

export function SidebarItemMotion({ item, isCollapsed }: SidebarItemMotionProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { setOpen } = useSidebar()
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href || (hasChildren && item.children?.some(child => pathname === child.href))

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
      setOpen(true)
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
            "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isCollapsed ? (
            <div className="flex w-full justify-center">
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            </div>
          ) : (
            <>
              <div className="flex items-center min-w-0">
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                <motion.span 
                  className="ml-3 overflow-hidden whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.title}
                </motion.span>
              </div>
              <motion.div
                variants={iconVariants}
                animate={isExpanded ? "expanded" : "collapsed"}
                transition={{ duration: 0.2 }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </motion.div>
            </>
          )}
        </motion.button>
        
        {isExpanded && !isCollapsed && (
          <motion.div 
            className="ml-6 mt-1 space-y-1 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {item.children?.map((child, index) => (
              <motion.div
                key={child.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.2,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  whileHover={{ x: 4, backgroundColor: "hsl(var(--accent))" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <Link
        href={item.href}
        className={cn(
          "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        {isCollapsed ? (
          <div className="flex w-full justify-center">
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
          </div>
        ) : (
          <>
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            <motion.span 
              className="ml-3 overflow-hidden whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {item.title}
            </motion.span>
            {item.badge && (
              <motion.span 
                className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {item.badge}
              </motion.span>
            )}
          </>
        )}
      </Link>
    </motion.div>
  )
}