/*
 * @Date: 2025-09-10 13:46:32
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-10 13:46:43
 * @FilePath: \qianmian-china-travel-dashboard\src\services\provinceService.ts
 */
import { query } from '@/lib/db'
import { ProvinceMention } from '@/types/province'

export class ProvinceService {
  // 获取所有省份提及数据，按提及次数排序
  async getProvinceMentions(): Promise<ProvinceMention[]> {
    try {
      const result = await query(`
        SELECT province, mentions 
        FROM province_mentions 
        ORDER BY mentions DESC
      `)
      
      return result.rows
    } catch (error) {
      console.error('获取省份数据失败:', error)
      throw new Error('获取省份数据失败')
    }
  }

  // 获取Top N省份数据
  async getTopProvinceMentions(limit: number = 10): Promise<ProvinceMention[]> {
    try {
      const result = await query(`
        SELECT province, mentions 
        FROM province_mentions 
        ORDER BY mentions DESC 
        LIMIT $1
      `, [limit])
      
      return result.rows
    } catch (error) {
      console.error('获取Top省份数据失败:', error)
      throw new Error('获取Top省份数据失败')
    }
  }
}