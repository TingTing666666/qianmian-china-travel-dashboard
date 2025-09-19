"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { SidebarState } from "@/types/global"

interface SidebarContextType extends SidebarState {
  toggle: () => void
  setOpen: (open: boolean) => void
  setMobile: (mobile: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar 必须在 SidebarProvider 内使用")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 检测移动端设备 - 只在客户端执行
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      console.log('移动端检测:', { width: window.innerWidth, isMobile: mobile })
      setIsMobile(mobile)
      // 移动端不自动关闭侧边栏，让用户手动控制
    }
    
    // 初始检测
    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 从 localStorage 恢复侧边栏状态（只在客户端初始化时执行一次）
  useEffect(() => {
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("sidebar-open")
      if (stored !== null) {
        try {
          const parsedValue = JSON.parse(stored)
          setIsOpen(parsedValue)
        } catch (error) {
          // 如果解析失败，使用默认值
          console.warn('Failed to parse sidebar state from localStorage:', error)
          setIsOpen(defaultOpen)
        }
      }
    }
    setIsInitialized(true)
  }, [defaultOpen])

  // 保存侧边栏状态到 localStorage（只在初始化完成后且在客户端执行）
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem("sidebar-open", JSON.stringify(isOpen))
      } catch (error) {
        // 处理 localStorage 不可用的情况
        console.warn('Failed to save sidebar state to localStorage:', error)
      }
    }
  }, [isOpen, isInitialized])

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  const setOpen = (open: boolean) => {
    setIsOpen(open)
  }

  const setMobile = (mobile: boolean) => {
    setIsMobile(mobile)
  }

  const value: SidebarContextType = {
    isOpen,
    isMobile,
    toggle,
    setOpen,
    setMobile,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}