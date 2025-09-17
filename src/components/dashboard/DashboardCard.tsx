/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\DashboardCard.tsx
 */
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ExternalLink, LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  children: React.ReactNode
  actionText?: string
  actionHref?: string
  className?: string
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  children,
  actionText,
  actionHref,
  className = ""
}: DashboardCardProps) {
  return (
    <Card className={`h-full flex flex-col bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <CardTitle className="text-base font-semibold text-gray-900 leading-none">
              {title}
            </CardTitle>
            {description && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {actionText && actionHref && (
          <Link 
            href={actionHref}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium px-2 py-1 rounded-md hover:bg-blue-50"
          >
            <span>{actionText}</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        {children}
      </CardContent>
    </Card>
  )
}