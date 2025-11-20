import { Handler } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NETLIFY_DATABASE_URL!)

export const handler: Handler = async () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  try {
    // 创建 AI 配置表
    await sql`
      CREATE TABLE IF NOT EXISTS ai_configs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        api_key TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // 创建索引
    await sql`
      CREATE INDEX IF NOT EXISTS idx_ai_configs_created_at 
      ON ai_configs(created_at DESC)
    `

    // 检查是否已有数据
    const result = await sql`SELECT COUNT(*) as count FROM ai_configs`
    const count = parseInt(result[0].count as string)

    let message = '数据库表已就绪'
    
    if (count === 0) {
      await sql`
        INSERT INTO ai_configs (name, url, api_key) 
        VALUES ('Gemini 2.5', 'https://api.go-model.com/v1', '请在配置中填写您的API密钥')
      `
      message = '数据库初始化成功，已创建示例配置'
    } else {
      message = `数据库已有 ${count} 条配置记录`
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message,
        count
      })
    }

  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: '数据库初始化失败',
        message: error.message
      })
    }
  }
}

