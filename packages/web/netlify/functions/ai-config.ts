import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NETLIFY_DATABASE_URL!)

interface AIConfig {
  id?: number
  name: string
  url: string
  api_key: string
  created_at?: string
  updated_at?: string
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  }

  // 处理 OPTIONS 请求（CORS 预检）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    // GET - 获取所有 AI 配置或单个配置
    if (event.httpMethod === 'GET') {
      const id = event.queryStringParameters?.id
      
      if (id) {
        // 获取单个配置
        const result = await sql`
          SELECT id, name, url, api_key, created_at, updated_at 
          FROM ai_configs 
          WHERE id = ${id}
        `
        
        if (result.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'AI配置不存在' })
          }
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result[0])
        }
      } else {
        // 获取所有配置
        const result = await sql`
          SELECT id, name, url, api_key, created_at, updated_at 
          FROM ai_configs 
          ORDER BY created_at DESC
        `
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        }
      }
    }

    // POST - 创建新的 AI 配置
    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '请求体不能为空' })
        }
      }

      const config: AIConfig = JSON.parse(event.body)

      // 验证必填字段
      if (!config.name || !config.url || !config.api_key) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '缺少必填字段：name, url, api_key' })
        }
      }

      const result = await sql`
        INSERT INTO ai_configs (name, url, api_key)
        VALUES (${config.name}, ${config.url}, ${config.api_key})
        RETURNING id, name, url, api_key, created_at, updated_at
      `

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(result[0])
      }
    }

    // PUT - 更新 AI 配置
    if (event.httpMethod === 'PUT') {
      const id = event.queryStringParameters?.id

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '缺少配置 ID' })
        }
      }

      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '请求体不能为空' })
        }
      }

      const config: AIConfig = JSON.parse(event.body)

      // 验证必填字段
      if (!config.name || !config.url || !config.api_key) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '缺少必填字段：name, url, api_key' })
        }
      }

      const result = await sql`
        UPDATE ai_configs 
        SET name = ${config.name}, 
            url = ${config.url}, 
            api_key = ${config.api_key},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING id, name, url, api_key, created_at, updated_at
      `

      if (result.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'AI配置不存在' })
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result[0])
      }
    }

    // DELETE - 删除 AI 配置
    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '缺少配置 ID' })
        }
      }

      const result = await sql`
        DELETE FROM ai_configs 
        WHERE id = ${id}
        RETURNING id
      `

      if (result.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'AI配置不存在' })
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: '删除成功', id: result[0].id })
      }
    }

    // 不支持的方法
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: '不支持的请求方法' })
    }

  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '服务器错误', 
        message: error.message 
      })
    }
  }
}

