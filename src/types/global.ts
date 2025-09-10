/*
 * @Date: 2025-09-09 13:56:51
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-09 14:05:48
 * @FilePath: \qianmian-china-travel-dashboard\src\types\global.ts
 */
export interface NavItem {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    children?: NavItem[]
    badge?: number | string
    disabled?: boolean
  }
  
  export interface SidebarState {
    isOpen: boolean
    isMobile: boolean
  }
  
  export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'user'
  }
  
  export interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
    timestamp: string
  }
  
  export interface PaginationParams {
    page: number
    pageSize: number
    total?: number
  }
  
  export interface FilterParams {
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    dateRange?: {
      start: string
      end: string
    }
  }
  
  export interface ChartData {
    name: string
    value: number
    [key: string]: any
  }
  
  export interface MetricCard {
    id: string
    title: string
    value: string | number
    change: number
    changeType: 'increase' | 'decrease' | 'neutral'
    description?: string
    icon?: React.ComponentType<{ className?: string }>
  }
  
  // 应用主题类型
  export type Theme = 'light' | 'dark' | 'system'
  
  // 加载状态
  export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
  
  // 通用错误类型
  export interface AppError {
    code: string
    message: string
    details?: any
  }