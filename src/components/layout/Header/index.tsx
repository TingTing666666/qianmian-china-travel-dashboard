"use client"

import { SidebarTrigger } from "../Sidebar/SidebarTrigger"
import { Breadcrumbs } from "./Breadcrumbs"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <div className="h-4 w-px bg-border" />
      <Breadcrumbs />
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
      </div>
    </header>
  )
}