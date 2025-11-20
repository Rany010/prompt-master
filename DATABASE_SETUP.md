# 数据库设置指南

本文档介绍如何设置和使用 Netlify Neon 数据库来存储 AI 配置信息。

## 📋 前置条件

- 已在 Netlify 上开通 Neon 数据库扩展
- 已获得以下环境变量：
  - `NETLIFY_DATABASE_URL`
  - `NETLIFY_DATABASE_URL_UNPOOLED`

## 🚀 快速开始

### 1. 安装依赖

```bash
cd packages/web
pnpm install
```

新增的依赖包括：
- `@neondatabase/serverless` - Neon 数据库客户端
- `@netlify/functions` - Netlify Functions 类型定义

### 2. 初始化数据库

部署后，访问以下 URL 初始化数据库表：

```
https://your-site.netlify.app/.netlify/functions/init-db
```

或者使用 curl：

```bash
curl https://your-site.netlify.app/.netlify/functions/init-db
```

这将创建必要的表和索引。

### 3. 本地开发

在本地开发时，需要在 `.env` 文件中配置数据库连接：

```bash
# 创建 .env 文件
cd packages/web
cat > .env << EOL
NETLIFY_DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
EOL
```

然后使用 Netlify CLI 运行：

```bash
netlify dev
```

## 📊 数据库结构

### ai_configs 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 主键，自增 |
| name | VARCHAR(255) | AI 服务名称 |
| url | TEXT | API URL |
| api_key | TEXT | API 密钥 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 🔌 API 端点

### GET /api/ai-config
获取所有 AI 配置

**响应示例：**
```json
[
  {
    "id": 1,
    "name": "Gemini 2.5",
    "url": "https://api.go-model.com/v1",
    "api_key": "your-api-key",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

### GET /api/ai-config?id={id}
获取单个 AI 配置

**响应示例：**
```json
{
  "id": 1,
  "name": "Gemini 2.5",
  "url": "https://api.go-model.com/v1",
  "api_key": "your-api-key",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### POST /api/ai-config
创建新的 AI 配置

**请求体：**
```json
{
  "name": "Gemini 2.5",
  "url": "https://api.go-model.com/v1",
  "api_key": "your-api-key"
}
```

**响应：** 201 Created，返回创建的配置对象

### PUT /api/ai-config?id={id}
更新 AI 配置

**请求体：**
```json
{
  "name": "Gemini 2.5 Pro",
  "url": "https://api.go-model.com/v1",
  "api_key": "updated-api-key"
}
```

**响应：** 200 OK，返回更新后的配置对象

### DELETE /api/ai-config?id={id}
删除 AI 配置

**响应：** 200 OK
```json
{
  "message": "删除成功",
  "id": 1
}
```

## 🔧 前端集成

使用 API 客户端：

```typescript
import { aiConfigAPI } from '@/api/aiConfig'

// 获取所有配置
const configs = await aiConfigAPI.getAll()

// 创建配置
const newConfig = await aiConfigAPI.create({
  name: 'My AI',
  url: 'https://api.example.com/v1',
  api_key: 'sk-xxx'
})

// 更新配置
await aiConfigAPI.update(1, {
  name: 'Updated AI',
  url: 'https://api.example.com/v1',
  api_key: 'sk-yyy'
})

// 删除配置
await aiConfigAPI.delete(1)
```

## 🛠️ 故障排除

### 数据库连接失败

1. 确认环境变量已正确设置
2. 检查 Netlify 部署日志
3. 验证数据库 URL 格式正确

### CORS 错误

API Functions 已配置 CORS 头，允许跨域访问。如果仍有问题，检查：
1. 请求 URL 是否正确
2. 浏览器控制台的具体错误信息

### 本地开发问题

使用 Netlify CLI 的 `netlify dev` 命令，它会自动：
- 加载 `.env` 文件
- 模拟 Netlify Functions 环境
- 提供热重载功能

## 📦 部署清单

在部署前确保：

- [x] 安装了所有依赖
- [x] 环境变量已在 Netlify 配置
- [x] netlify.toml 配置正确
- [x] 测试了所有 API 端点
- [x] 运行了数据库初始化

## 🔐 安全注意事项

1. **API Key 加密**：数据库中存储的 API Key 是明文，建议：
   - 使用 PostgreSQL 的加密功能
   - 或在应用层实现加密

2. **访问控制**：当前 API 没有认证，建议：
   - 添加 API Key 验证
   - 或集成 Netlify Identity

3. **环境变量**：确保敏感信息不要提交到 Git

## 📚 相关文档

- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Neon Database](https://neon.tech/docs/introduction)
- [@neondatabase/serverless](https://github.com/neondatabase/serverless)

