// 数据库配置
export const databaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'qianmian_travel',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123456', // 请在这里改成你的密码
    
    // 连接池配置
    poolConfig: {
      max: 20,                    // 最大连接数
      idleTimeoutMillis: 30000,   // 空闲超时
      connectionTimeoutMillis: 2000, // 连接超时
    }
  }