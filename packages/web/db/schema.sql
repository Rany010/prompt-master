-- AI 配置表
CREATE TABLE IF NOT EXISTS ai_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_ai_configs_created_at ON ai_configs(created_at DESC);

-- 插入默认配置（可选）
INSERT INTO ai_configs (name, url, api_key) 
VALUES ('示例配置', 'https://api.openai.com/v1/chat/completions', 'your-api-key-here')
ON CONFLICT DO NOTHING;

