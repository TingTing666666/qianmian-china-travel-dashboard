import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { databaseConfig } from '@/config/database'

export async function GET() {
  try {
    const ping = await query('SELECT 1 as ok')
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'video_fdata'
      ) as exists
    `)

    const connectionOk = ping.rows[0]?.ok === 1
    const tableExists = tableCheck.rows[0]?.exists === true

    return NextResponse.json({
      success: true,
      connection: connectionOk,
      tableExists,
      config: {
        host: databaseConfig.host,
        port: databaseConfig.port,
        database: databaseConfig.database,
        user: databaseConfig.user
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || '数据库连接失败',
      config: {
        host: databaseConfig.host,
        port: databaseConfig.port,
        database: databaseConfig.database,
        user: databaseConfig.user
      }
    }, { status: 500 })
  }
}