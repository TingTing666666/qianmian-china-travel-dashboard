/*
 * @Date: 2025-09-09 13:54:03
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-09 14:07:23
 * @FilePath: \qianmian-china-travel-dashboard\src\components\layout\Sidebar\SidebarTrigger.tsx
 */
"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useSidebar } from "./SidebarProvider"

export function SidebarTrigger() {
  const { toggle } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="切换侧边栏"
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}