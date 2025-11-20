// 数据库初始化脚本
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NETLIFY_DATABASE_URL!)

async function initDatabase() {
  try {
    console.log('开始初始化数据库...')
    
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
    console.log('✓ AI配置表创建成功')
    
    // 创建索引
    await sql`
      CREATE INDEX IF NOT EXISTS idx_ai_configs_created_at 
      ON ai_configs(created_at DESC)
    `
    console.log('✓ 索引创建成功')
    
    // 检查是否已有数据
    const result = await sql`SELECT COUNT(*) as count FROM ai_configs`
    const count = result[0].count
    
    if (count === 0) {
      console.log('数据库为空，插入示例配置...')
      await sql`
        INSERT INTO ai_configs (name, url, api_key) 
        VALUES ('Gemini 2.5', 'https://api.go-model.com/v1', 'your-api-key-here')
      `
      console.log('✓ 示例配置插入成功')
    } else {
      console.log(`✓ 数据库已有 ${count} 条配置记录`)
    }
    
    console.log('✅ 数据库初始化完成！')
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error)
    throw error
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { initDatabase }

