/*
 * @Date: 2025-09-10 13:45:26
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-10 13:45:35
 * @FilePath: \qianmian-china-travel-dashboard\src\types\province.ts
 */
// 省份提及数据类型
export interface ProvinceMention {
    province: string
    mentions: number
  }
  
  // API 响应类型
  export interface ProvinceMentionResponse {
    success: boolean
    data: ProvinceMention[]
    error?: string
  }