# 提示词优化生成工具 (Prompt Master)

一个现代化的提示词优化生成工具，帮助用户快速生成和优化 AI 提示词。

## ✨ 功能特性

### 📝 提示词输入
- **结构化输入**：通过表单化方式输入提示词信息
  - 名称/主题
  - 核心卖点
  - 适用人群
  - 目标场景
  - 风格要求
  - 额外要求
  - 自定义字段（可动态添加）
- **原始提示词**：直接粘贴原始提示词内容

### 📋 模板选择
- 内置多个专业模板：
  - 产品特写 + 细节展示
  - 多角度旋转展示
  - 第一人称开箱体验
  - 户外运动场景展示
  - 使用前后对比
- 支持创建自定义模板
- 支持多选模板，一键生成多个提示词

### 🎯 生成结果
- 实时生成优化后的提示词
- 支持一键复制
- 清晰的结果展示
- 按模板分类显示

### 🤖 AI 配置
- 配置 AI 服务信息：
  - AI 名称
  - API URL
  - API Key（支持显示/隐藏）
- 测试连接功能，快速验证配置
- 本地存储，数据安全

### 💾 配置管理
- 自动保存用户配置到本地
- 刷新页面自动恢复上次状态
- 支持导入/导出配置

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
cd packages/web
pnpm dev
```

### 构建生产版本

```bash
cd packages/web
pnpm build
```

### 预览生产版本

```bash
cd packages/web
pnpm preview
```

## 📦 项目结构

```
prompt-master/
├── packages/
│   ├── web/              # Web 应用
│   │   ├── src/
│   │   │   ├── views/    # 页面组件
│   │   │   ├── types/    # TypeScript 类型定义
│   │   │   ├── App.vue   # 根组件
│   │   │   └── main.ts   # 入口文件
│   │   └── package.json
│   └── extension/        # 浏览器扩展（计划中）
├── netlify.toml         # Netlify 部署配置
└── README.md
```

## 🌐 部署到 Netlify

### 方式 1：通过 Git 部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 登录 [Netlify](https://app.netlify.com/)
3. 点击 "Add new site" → "Import an existing project"
4. 选择你的 Git 仓库
5. 构建设置会自动从 `netlify.toml` 读取
6. 点击 "Deploy site"

### 方式 2：通过 Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

### 环境要求

- Node.js 18 或更高版本
- pnpm 包管理器

## 🛠️ 技术栈

- **框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **UI 库**：Naive UI + Tailwind CSS
- **路由**：Vue Router
- **图标**：Font Awesome

## 📝 使用说明

1. **选择输入方式**
   - 结构化输入：按字段填写信息
   - 原始提示词：直接粘贴现有提示词

2. **填写信息**
   - 根据选择的输入方式填写相关信息
   - 可添加自定义字段以扩展信息

3. **选择模板**
   - 勾选需要应用的模板（支持多选）
   - 可创建自定义模板

4. **生成提示词**
   - 点击"生成提示词"按钮
   - 查看生成结果
   - 点击复制按钮使用生成的提示词

5. **配置 AI（可选）**
   - 点击右上角"配置AI"
   - 填写 AI 服务配置
   - 测试连接验证配置
   - 保存配置供后续使用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
