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

  // 检测移动端设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 从 localStorage 恢复侧边栏状态
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-open")
    if (stored !== null) {
      setIsOpen(JSON.parse(stored))
    }
  }, [])

  // 保存侧边栏状态到 localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-open", JSON.stringify(isOpen))
  }, [isOpen])

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