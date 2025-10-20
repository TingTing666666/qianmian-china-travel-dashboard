/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\app\team\page.tsx
 */
"use client"

import React from 'react'

export default function TeamPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              团队介绍
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          {/* 内容区域 - 暂时留白 */}
          <div className="bg-card rounded-lg shadow-sm border p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-lg">团队介绍内容待完善...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}