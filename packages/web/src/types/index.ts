// 结构化输入数据类型
export interface StructuredInput {
  name: string          // 名称/主题
  features: string      // 核心卖点
  audience: string      // 适用人群
  scene: string         // 目标场景
  style?: string        // 风格要求
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
  // 结构化的专业视频生成维度（可选，如果存在则优先使用）
  structured?: TemplateStructure
  isDefault?: boolean  // 标记是否为默认模板
}

// 模板的结构化定义
export interface TemplateStructure {
  // 1. 情节与动作
  plotAction: {
    sequence?: string                // 时序与转场
    subjectMotion?: string          // 主体运动
    interaction?: string            // 互动行为
  }
  // 2. 摄影与运镜
  cinematography: {
    shotSize?: string               // 景别
    cameraAngle?: string            // 机位与角度
    cameraMovement?: string         // 运镜
  }
  // 3. 视觉风格与美学
  visualStyle: {
    styleType?: string              // 风格类型
    lightingColor?: string          // 光线与色彩
    renderQuality?: string          // 渲染品质
  }
  // 4. 情绪与氛围
  emotionMood: {
    moodTone?: string               // 情绪基调
    targetAudience?: string         // 目标受众
  }
  // 5. 约束与排除
  constraints: {
    exclusions?: string             // 排除元素
    negativePrompts?: string        // 负面提示
  }
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

