# 🚀 快速开始 - 数据库集成

## 📝 概述

AI 配置信息现在存储在 Netlify Neon PostgreSQL 数据库中，不再使用 localStorage。

## ✅ 已完成的工作

### 1. 数据库表结构
- ✅ 创建 `ai_configs` 表
- ✅ 字段：id, name, url, api_key, created_at, updated_at
- ✅ 创建索引以提高查询性能

### 2. Netlify Functions API
- ✅ `GET /api/ai-config` - 获取所有配置
- ✅ `GET /api/ai-config?id={id}` - 获取单个配置
- ✅ `POST /api/ai-config` - 创建配置
- ✅ `PUT /api/ai-config?id={id}` - 更新配置
- ✅ `DELETE /api/ai-config?id={id}` - 删除配置
- ✅ `POST /api/init-db` - 初始化数据库（一次性操作）

### 3. 前端 API 客户端
- ✅ 创建 `src/api/aiConfig.ts`
- ✅ 封装所有数据库操作
- ✅ 统一错误处理

## 🚀 部署步骤

### 步骤 1: 推送代码

```bash
git add .
git commit -m "feat: 集成 Neon 数据库存储 AI 配置"
git push
```

### 步骤 2: 部署到 Netlify

代码推送后，Netlify 会自动构建和部署。

### 步骤 3: 初始化数据库

部署完成后，访问以下 URL 初始化数据库：

```
https://your-site.netlify.app/.netlify/functions/init-db
```

应该看到类似的响应：

```json
{
  "success": true,
  "message": "数据库初始化成功，已创建示例配置",
  "count": 1
}
```

### 步骤 4: 测试 API

```bash
# 获取所有配置
curl https://your-site.netlify.app/.netlify/functions/ai-config

# 创建配置
curl -X POST https://your-site.netlify.app/.netlify/functions/ai-config \
  -H "Content-Type: application/json" \
  -d '{"name":"My AI","url":"https://api.example.com/v1","api_key":"sk-xxx"}'

# 更新配置
curl -X PUT "https://your-site.netlify.app/.netlify/functions/ai-config?id=1" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated AI","url":"https://api.example.com/v1","api_key":"sk-yyy"}'

# 删除配置
curl -X DELETE "https://your-site.netlify.app/.netlify/functions/ai-config?id=1"
```

## 💻 本地开发

### 1. 配置环境变量

从 Netlify 复制数据库连接字符串：

```bash
# 在 packages/web 目录下创建 .env 文件
cat > .env << 'EOL'
NETLIFY_DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
EOL
```

### 2. 安装 Netlify CLI（可选）

```bash
npm install -g netlify-cli
```

### 3. 运行开发服务器

```bash
# 使用 Netlify CLI（推荐，会自动加载环境变量）
netlify dev

# 或使用 Vite（需要手动设置环境变量）
pnpm dev
```

### 4. 初始化本地数据库

访问：http://localhost:8888/.netlify/functions/init-db

## 📁 文件结构

```
packages/web/
├── netlify/
│   └── functions/
│       ├── ai-config.ts      # AI 配置 CRUD API
│       └── init-db.ts         # 数据库初始化
├── src/
│   ├── api/
│   │   └── aiConfig.ts        # API 客户端
│   └── views/
│       └── Home.vue            # 主页面（需集成 API）
└── db/
    ├── schema.sql              # 数据库 schema
    └── init.ts                 # 初始化脚本
```

## 🔧 前端集成示例

在 Vue 组件中使用：

```typescript
import { aiConfigAPI } from '@/api/aiConfig'

// 组件中
const loadConfig = async () => {
  try {
    const configs = await aiConfigAPI.getAll()
    if (configs.length > 0) {
      aiConfig.value = {
        name: configs[0].name,
        url: configs[0].url,
        apiKey: configs[0].api_key
      }
    }
  } catch (error) {
    message.error('加载配置失败')
  }
}

const saveConfig = async () => {
  try {
    const configData = {
      name: aiConfig.value.name,
      url: aiConfig.value.url,
      api_key: aiConfig.value.apiKey
    }
    
    if (currentConfigId.value) {
      await aiConfigAPI.update(currentConfigId.value, configData)
      message.success('更新成功')
    } else {
      const result = await aiConfigAPI.create(configData)
      currentConfigId.value = result.id
      message.success('创建成功')
    }
  } catch (error) {
    message.error('保存失败')
  }
}
```

## ⚠️ 注意事项

### 安全性
1. **API Key 存储**：当前是明文存储，生产环境建议加密
2. **API 认证**：当前 API 无认证，任何人都可以访问
3. **CORS**：已配置允许所有来源，生产环境建议限制

### 后续改进
1. 添加用户认证（Netlify Identity）
2. API Key 加密存储
3. 添加访问日志
4. 实现配置版本管理
5. 添加配置导入/导出功能

## 📚 相关文档

- [DATABASE_SETUP.md](../../DATABASE_SETUP.md) - 详细的数据库设置文档
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Neon Serverless](https://neon.tech/docs/serverless/serverless-driver)

## 🆘 故障排除

### 问题：无法连接数据库

**解决方案：**
1. 检查环境变量 `NETLIFY_DATABASE_URL` 是否正确设置
2. 在 Netlify 控制台查看部署日志
3. 确认 Neon 数据库实例正在运行

### 问题：API 返回 500 错误

**解决方案：**
1. 查看 Netlify Functions 日志
2. 检查数据库表是否已创建（运行 init-db）
3. 验证请求参数格式是否正确

### 问题：本地开发无法访问 Functions

**解决方案：**
1. 确保使用 `netlify dev` 而不是 `vite dev`
2. 检查 `.env` 文件是否存在且正确
3. 确认 8888 端口没有被占用

## ✅ 部署检查清单

- [ ] 代码已推送到 Git
- [ ] Netlify 已完成构建
- [ ] 访问 init-db 端点初始化数据库
- [ ] 测试所有 API 端点
- [ ] 在前端界面测试创建/更新配置
- [ ] 检查数据库中的数据

---

**祝部署顺利！** 🎉

如有问题，请查看详细文档或提交 Issue。

