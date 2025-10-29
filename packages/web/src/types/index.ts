// 结构化输入数据类型
export interface StructuredInput {
  name: string          // 名称/主题
  features: string      // 核心卖点
  audience: string      // 适用人群
  scene: string         // 目标场景
  style: string         // 风格要求
  extra: string         // 额外要求
  customFields: CustomField[]  // 自定义字段
}

// 自定义字段类型
export interface CustomField {
  name: string
  value: string
}

// 模板类型
export interface Template {
  id: string
  name: string
  format: string
  selected?: boolean
}

// 生成结果类型
export interface GeneratedResult {
  id: string
  templateName: string
  content: string
  templateIndex: number
}

// AI配置类型
export interface AIConfig {
  name: string
  url: string
  apiKey: string
}

// 输入模式类型
export type InputMode = 'structured' | 'raw'

