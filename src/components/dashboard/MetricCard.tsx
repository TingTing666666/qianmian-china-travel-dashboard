/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-01-16 00:00:00
 * @FilePath: \qianmian-china-travel-dashboard\src\components\dashboard\MetricCard.tsx
 */
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: LucideIcon
  description?: string
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  loading = false
}: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendIcon = () => {
    if (changeType === 'increase') return TrendingUp
    if (changeType === 'decrease') return TrendingDown
    return null
  }

  const TrendIcon = getTrendIcon()

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change || description) && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {change && (
              <>
                {TrendIcon && <TrendIcon className="h-3 w-3" />}
                <span className={getChangeColor()}>{change}</span>
              </>
            )}
            {description && (
              <span>{change ? ` ${description}` : description}</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
}