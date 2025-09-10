import { Pool } from 'pg'
import { databaseConfig } from '@/config/database'

// 创建连接池
const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  database: databaseConfig.database,
  user: databaseConfig.user,
  password: databaseConfig.password,
  ...databaseConfig.poolConfig
})

// 查询函数
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } catch (error) {
    console.error('数据库查询错误:', error)
    throw error
  } finally {
    client.release()
  }
}

// 关闭连接池（通常在应用关闭时调用）
export const closePool = async () => {
  await pool.end()
}