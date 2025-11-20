# 🚀 部署检查清单

## 准备工作 ✅

### 代码提交

- [ ] 所有更改已保存
- [ ] 运行测试确保没有错误
- [ ] 更新版本号（如需要）
- [ ] 提交代码到 Git

```bash
git add .
git commit -m "feat: 集成 Neon 数据库存储 AI 配置"
git push origin main
```

## Netlify 配置 ⚙️

### 环境变量检查

登录 Netlify 控制台，确认以下环境变量已设置：

- [ ] `NETLIFY_DATABASE_URL` - 由 Neon 扩展自动注入
- [ ] `NETLIFY_DATABASE_URL_UNPOOLED` - 由 Neon 扩展自动注入

### 构建配置

- [ ] `netlify.toml` 已正确配置
  - base: `packages/web`
  - command: `pnpm install && pnpm run build`
  - publish: `dist`
  - functions: `netlify/functions`

## 部署步骤 📦

### 1. 触发部署

代码推送后，Netlify 会自动开始构建：

- [ ] 检查构建日志，确认没有错误
- [ ] 等待部署完成（通常 2-5 分钟）
- [ ] 确认部署状态为 "Published"

### 2. 初始化数据库

首次部署后，需要初始化数据库表：

```bash
curl https://your-site.netlify.app/.netlify/functions/init-db
```

预期响应：
```json
{
  "success": true,
  "message": "数据库初始化成功，已创建示例配置",
  "count": 1
}
```

- [ ] 数据库初始化成功
- [ ] 返回成功消息

### 3. 测试 API 端点

测试所有 API 功能：

#### 获取配置列表
```bash
curl https://your-site.netlify.app/.netlify/functions/ai-config
```
- [ ] 返回配置数组
- [ ] 包含示例配置

#### 创建新配置
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/ai-config \
  -H "Content-Type: application/json" \
  -d '{"name":"Test AI","url":"https://api.test.com","api_key":"test-key"}'
```
- [ ] 返回 201 状态码
- [ ] 返回创建的配置对象（包含 id）

#### 更新配置
```bash
curl -X PUT "https://your-site.netlify.app/.netlify/functions/ai-config?id=2" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated AI","url":"https://api.test.com","api_key":"new-key"}'
```
- [ ] 返回 200 状态码
- [ ] 返回更新后的配置

#### 删除配置
```bash
curl -X DELETE "https://your-site.netlify.app/.netlify/functions/ai-config?id=2"
```
- [ ] 返回 200 状态码
- [ ] 返回删除成功消息

### 4. 测试前端功能

访问部署的网站，测试以下功能：

- [ ] 页面正常加载
- [ ] 点击"配置AI"按钮
- [ ] 填写 AI 配置信息
  - AI 名称
  - API URL  
  - API Key
- [ ] 点击"测试连接"（如果配置有效）
- [ ] 点击"保存配置"
- [ ] 刷新页面，确认配置已保存并自动加载
- [ ] 修改配置并再次保存
- [ ] 确认更新成功

## 验证清单 ✔️

### 数据库

- [ ] 数据库表已创建
- [ ] 可以查询数据
- [ ] 可以插入数据
- [ ] 可以更新数据
- [ ] 可以删除数据

### API Functions

- [ ] GET 端点正常工作
- [ ] POST 端点正常工作
- [ ] PUT 端点正常工作
- [ ] DELETE 端点正常工作
- [ ] 错误处理正常
- [ ] CORS 配置正确

### 前端应用

- [ ] 页面加载正常
- [ ] 配置模态框可以打开
- [ ] 可以创建新配置
- [ ] 可以更新现有配置
- [ ] 配置持久化（刷新后仍存在）
- [ ] 错误提示正常显示
- [ ] 成功提示正常显示

## 性能检查 ⚡

- [ ] 页面加载时间 < 3秒
- [ ] API 响应时间 < 1秒
- [ ] 没有控制台错误
- [ ] 没有网络错误

## 安全检查 🔒

- [ ] API Key 不在前端代码中暴露
- [ ] 环境变量未提交到 Git
- [ ] HTTPS 正常工作
- [ ] 数据库连接使用 SSL

## 监控设置 📊

- [ ] 在 Netlify 中启用分析
- [ ] 设置错误通知
- [ ] 检查 Functions 日志
- [ ] 监控数据库性能（在 Neon 控制台）

## 回滚计划 🔄

如果出现问题：

1. **Netlify 控制台**
   - 转到 Deploys → 找到上一个稳定版本
   - 点击 "Publish deploy"

2. **数据库回滚**
   - 如果需要，在 Neon 控制台创建数据库快照
   - 或手动删除有问题的数据

3. **代码回滚**
   ```bash
   git revert <commit-hash>
   git push
   ```

## 文档更新 📝

- [ ] 更新 README.md
- [ ] 更新 API 文档
- [ ] 记录已知问题
- [ ] 更新版本历史

## 后续任务 🔜

- [ ] 添加用户认证
- [ ] 实现 API Key 加密
- [ ] 添加配置备份功能
- [ ] 优化数据库查询性能
- [ ] 添加使用统计

---

## 🎉 部署完成！

如果所有检查项都通过，恭喜你！部署成功了！

记得：
- 📝 记录部署时间和版本
- 📊 持续监控应用性能
- 🐛 及时修复发现的问题
- 🔄 定期更新依赖

**遇到问题？**
- 查看 [DATABASE_SETUP.md](DATABASE_SETUP.md)
- 查看 [QUICK_START.md](packages/web/QUICK_START.md)
- 检查 Netlify Functions 日志
- 检查 Neon 数据库状态

