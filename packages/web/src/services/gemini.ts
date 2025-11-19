import type { InputMode, StructuredInput, Template } from '../types'

// 默认配置（当用户未配置时使用）
const DEFAULT_API_KEY = 'sk-ZKH4qKC3KU1as2WYzvIUU3aHakzdy1xqy9Zx5TI4i4V3nE8F'
const DEFAULT_BASE_URL = 'https://api.go-model.com/v1'
const DEFAULT_MODEL = 'gemini-2.5-flash'

// 你的服务商实际可用的模型列表（按优先级排序）
const AVAILABLE_MODELS = [
  'gemini-2.5-flash',           // ⭐ 推荐：最新 Gemini 2.5，速度快
  'gemini-2.5-pro',             // 🧠 强大：更高质量的输出
  'gemini-2.5-flash[x2]',       // 并发加速版
  'gemini-2.5-pro[x3]',         // 并发加速版
  'concu/gemini-2.5-flash',     // concu 源
  'concu/gemini-2.5-pro',       // concu 源
  'omega/gemini-2.5-flash',     // omega 源
  'omega/gemini-2.5-pro',       // omega 源
  'stream/gemini-2.5-flash',    // stream 源
  'stream/gemini-2.5-pro',      // stream 源
  'Claude/C16/cs-claude-sonnet-4-20250514',  // Claude 4
  'OpenAI/C8/gpt-5',            // GPT-5
  'gemini-2.5-flash-lite',      // 轻量版
  'gemini-2.5-flash-preview-05-20'
]

// 运行时配置（可由用户动态配置）
let RUNTIME_API_KEY = DEFAULT_API_KEY
let RUNTIME_BASE_URL = DEFAULT_BASE_URL
let RUNTIME_MODEL = DEFAULT_MODEL

export interface GeminiGenerationOptions {
  template: Template
  inputMode: InputMode
  structuredInput: StructuredInput
  rawText: string
  // 可选：覆盖运行时配置
  apiKey?: string
  baseURL?: string
  model?: string
}

// OpenAI 格式的响应类型
interface OpenAISuccessResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
    finish_reason?: string
  }>
  model?: string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

interface OpenAIErrorResponse {
  error?: {
    message?: string
    type?: string
    code?: string | number
  }
}

const buildStructuredInputSummary = (structuredInput: StructuredInput): string => {
  const lines: string[] = []

  if (structuredInput.name?.trim()) {
    lines.push(`名称/主题: ${structuredInput.name.trim()}`)
  }
  if (structuredInput.features?.trim()) {
    lines.push(`核心卖点: ${structuredInput.features.trim()}`)
  }
  if (structuredInput.audience?.trim()) {
    lines.push(`适用人群: ${structuredInput.audience.trim()}`)
  }
  if (structuredInput.scene?.trim()) {
    lines.push(`目标场景: ${structuredInput.scene.trim()}`)
  }
  if (structuredInput.style?.trim()) {
    lines.push(`风格要求: ${structuredInput.style.trim()}`)
  }
  if (structuredInput.extra?.trim()) {
    lines.push(`额外要求: ${structuredInput.extra.trim()}`)
  }

  const customFields = structuredInput.customFields.filter(field => field.name?.trim() || field.value?.trim())
  if (customFields.length > 0) {
    lines.push('自定义字段:')
    customFields.forEach(field => {
      const name = field.name?.trim() || '未命名字段'
      const value = field.value?.trim() || '未提供内容'
      lines.push(`- ${name}: ${value}`)
    })
  }

  if (lines.length === 0) {
    return '未提供额外的结构化信息'
  }

  return lines.join('\n')
}

const buildGeminiPrompt = (options: GeminiGenerationOptions): string => {
  const { template, inputMode, structuredInput, rawText } = options

  if (inputMode === 'structured') {
    const summary = buildStructuredInputSummary(structuredInput)
    return `You are a professional Sora 2 video prompt expert specializing in cross-border e-commerce. Generate a high-quality, structured English prompt for Sora 2 AI video generation based on the product information provided.

## CRITICAL REQUIREMENTS
1. **OUTPUT LANGUAGE**: Must output in ENGLISH ONLY (Sora 2 performs best with English prompts)
2. **NO CHINESE**: Absolutely NO Chinese characters in the output
3. **STRUCTURED FORMAT**: Follow the exact structure template below
4. **VIDEO-FIRST THINKING**: Transform static product info into dynamic video scenes
5. **RICH DETAILS**: Include camera movement, lighting, environment, product angles
6. **COMMERCIAL FOCUS**: Emphasize selling points and create purchase desire
7. **TECHNICAL STANDARDS**: Follow Sora 2 best practices (shot descriptions, duration hints, style specification)

## TEMPLATE REFERENCE
Template Name: ${template.name}
Template Style: ${template.format}

## PRODUCT INFORMATION
${summary}

## OUTPUT STRUCTURE (Must follow this format)
Generate a prompt with this structure:

[SCENE DESCRIPTION]: Brief overview of the video scene (1 sentence)

[VISUAL DETAILS]: 
- Camera: [camera movement, angles, transitions]
- Lighting: [lighting style, color temperature, atmosphere]
- Environment: [setting, background, props]
- Product Focus: [how product is showcased]

[MOOD & STYLE]: [emotional tone, aesthetic style, target feeling]

[DURATION HINT]: [suggested video length, e.g., "5-10 seconds"]

Then combine all above into ONE COHESIVE PARAGRAPH (100-200 words) suitable for direct Sora 2 input.

## CINEMATOGRAPHY TERMS TO USE
tracking shot, crane shot, dolly zoom, rack focus, shallow depth of field, bokeh, soft lighting, golden hour, cinematic color grading, slow motion, dynamic composition

## EXAMPLE OUTPUT FORMAT:
A smooth tracking shot follows [product name] as it [action], revealing its [key feature]. Soft, warm lighting with shallow depth of field creates an intimate, premium feel. The camera slowly orbits the product at eye level, highlighting [selling point] from multiple angles. Background features [environment] with subtle bokeh effect. Cinematic color grading enhances the [mood]. Product appears in [context], demonstrating [benefit] for [target audience]. The shot transitions smoothly, creating a seamless, aspirational narrative perfect for e-commerce marketing. Duration: 8-12 seconds.

NOW GENERATE THE PROMPT IN ENGLISH:`
  }

  const original = rawText.trim() || '无原始提示词内容'
  return `You are a professional Sora 2 video prompt expert for cross-border e-commerce. Transform the user's description into a high-quality, structured English prompt suitable for Sora 2 AI video generation.

## CRITICAL REQUIREMENTS
1. **OUTPUT LANGUAGE**: ENGLISH ONLY (no Chinese characters)
2. **STRUCTURED FORMAT**: Use clear sections and formatting
3. **VIDEO TRANSFORMATION**: Convert text into dynamic video scenes
4. **TECHNICAL STANDARDS**: Follow Sora 2 prompt standards
5. **COMMERCIAL VALUE**: Optimize for e-commerce marketing

## TEMPLATE REFERENCE
Template Name: ${template.name}
Template Style: ${template.format}

## USER'S ORIGINAL CONTENT
${original}

## OUTPUT STRUCTURE
Provide:
1. [SCENE]: Brief scene overview
2. [VISUAL DETAILS]: Camera, lighting, environment, product focus
3. [MOOD]: Emotional tone and style
4. [DURATION]: Suggested length

Then combine into ONE COHESIVE PARAGRAPH (100-200 words) in English for direct Sora 2 use.

Use professional cinematography terms: tracking shot, soft lighting, shallow depth of field, bokeh, crane shot, cinematic color grading, etc.

NOW GENERATE THE PROMPT IN ENGLISH:`
}

export class GeminiError extends Error {
  public readonly status?: string
  public readonly code?: number

  constructor(message: string, status?: string, code?: number) {
    super(message)
    this.name = 'GeminiError'
    this.status = status
    this.code = code
  }
}

/**
 * 设置运行时 API 配置
 * @param apiKey API Key
 * @param baseURL Base URL (可选)
 * @param model 模型名称 (可选)
 */
export const setAPIConfig = (apiKey: string, baseURL?: string, model?: string): void => {
  RUNTIME_API_KEY = apiKey || DEFAULT_API_KEY
  RUNTIME_BASE_URL = baseURL || DEFAULT_BASE_URL
  RUNTIME_MODEL = model || DEFAULT_MODEL
}

/**
 * 获取当前运行时配置
 */
export const getAPIConfig = () => {
  return {
    apiKey: RUNTIME_API_KEY,
    baseURL: RUNTIME_BASE_URL,
    model: RUNTIME_MODEL
  }
}

/**
 * 获取预设的模型列表（本地）
 */
export const getPresetModels = (): string[] => {
  return [...AVAILABLE_MODELS]
}

/**
 * 获取可用的模型列表（从服务器）
 * @param apiKey 可选的 API Key，不提供则使用运行时配置
 * @param baseURL 可选的 Base URL，不提供则使用运行时配置
 * @returns 模型 ID 列表
 */
export const getAvailableModels = async (apiKey?: string, baseURL?: string): Promise<string[]> => {
  const useApiKey = apiKey || RUNTIME_API_KEY
  const useBaseURL = baseURL || RUNTIME_BASE_URL
  try {
    const response = await fetch(`${useBaseURL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${useApiKey}`
      }
    })

    if (!response.ok) {
      console.warn('获取模型列表失败，使用预设模型列表')
      return AVAILABLE_MODELS
    }

    const data = await response.json()
    
    // OpenAI 格式的模型列表
    if (data.data && Array.isArray(data.data)) {
      const models = data.data.map((model: any) => model.id || model.name).filter(Boolean)
      if (models.length > 0) {
        return models
      }
    }

    console.warn('响应格式不符合预期，使用预设模型列表')
    return AVAILABLE_MODELS
  } catch (error) {
    console.error('获取模型列表失败:', error)
    return AVAILABLE_MODELS
  }
}

/**
 * 设置当前使用的模型
 * @param model 模型名称
 */
export const setCurrentModel = (model: string): void => {
  RUNTIME_MODEL = model
}

/**
 * 测试 API 连接
 * @param apiKey API Key
 * @param baseURL Base URL
 * @param model 模型名称
 * @returns 测试结果
 */
export const testAPIConnection = async (
  apiKey: string, 
  baseURL: string, 
  model: string
): Promise<{ success: boolean; message: string; models?: string[] }> => {
  try {
    // 1. 测试获取模型列表
    const models = await getAvailableModels(apiKey, baseURL)
    
    if (models.length === 0) {
      return {
        success: false,
        message: '无法获取模型列表，请检查 API Key 和 URL 是否正确'
      }
    }
    
    // 2. 测试指定的模型是否可用
    const isModelAvailable = models.includes(model)
    
    if (!isModelAvailable) {
      return {
        success: false,
        message: `模型 "${model}" 不在可用列表中。可用模型：${models.slice(0, 5).join(', ')}${models.length > 5 ? ' 等' : ''}`,
        models
      }
    }
    
    // 3. 测试实际调用
    const testPrompt = 'Say OK'
    
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: testPrompt }],
        max_tokens: 100,
        temperature: 0.3
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      try {
        const error = JSON.parse(errorText)
        return {
          success: false,
          message: `API 调用失败（${response.status}）：${error.error?.message || errorText}`,
          models
        }
      } catch {
        return {
          success: false,
          message: `API 调用失败（${response.status}）：${errorText || '请检查配置'}`,
          models
        }
      }
    }
    
    const data = await response.json()
    
    // 检查响应格式
    const choice = (data as OpenAISuccessResponse).choices?.[0]
    const content = choice?.message?.content
    
    // 检查是否有有效的响应结构
    if (!choice || content === undefined) {
      return {
        success: false,
        message: `API 响应格式异常。响应数据: ${JSON.stringify(data).substring(0, 200)}...`,
        models
      }
    }
    
    // content 可能是空字符串（例如模型在思考但没输出文本）
    const finishReason = choice.finish_reason
    
    // 构建成功消息
    let successMessage = `连接成功！模型 "${model}" 工作正常。`
    
    if (content && content.trim()) {
      successMessage += ` 响应: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`
    } else if (finishReason === 'length') {
      successMessage += ` (模型达到 token 限制)`
    } else if (finishReason === 'stop') {
      successMessage += ` (模型正常完成)`
    }
    
    successMessage += `。共找到 ${models.length} 个可用模型。`
    
    return {
      success: true,
      message: successMessage,
      models
    }
  } catch (error) {
    console.error('测试失败:', error)
    return {
      success: false,
      message: `测试失败：${error instanceof Error ? error.message : String(error)}`
    }
  }
}

/**
 * 尝试使用指定模型调用 API
 */
const tryGenerateWithModel = async (
  model: string, 
  prompt: string, 
  apiKey: string, 
  baseURL: string
): Promise<string> => {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: false
    })
  })

  const data = (await response.json()) as OpenAISuccessResponse & OpenAIErrorResponse

  if (!response.ok) {
    const message = data.error?.message || `API 调用失败，状态码 ${response.status}`
    throw new GeminiError(message, data.error?.type, typeof data.error?.code === 'number' ? data.error.code : undefined)
  }

  const content = data.choices?.[0]?.message?.content

  if (!content || !content.trim()) {
    throw new GeminiError('API 未返回有效的文本内容')
  }

  return content.trim()
}

/**
 * 使用 OpenAI 兼容 API 优化提示词（支持自动切换模型）
 * @param options 生成选项
 * @returns 优化后的提示词文本
 */
export const optimizePromptWithGemini = async (options: GeminiGenerationOptions): Promise<string> => {
  const prompt = buildGeminiPrompt(options)
  
  // 使用选项中的配置或运行时配置
  const apiKey = options.apiKey || RUNTIME_API_KEY
  const baseURL = options.baseURL || RUNTIME_BASE_URL
  const model = options.model || RUNTIME_MODEL

  // 首先尝试使用指定模型
  try {
    const result = await tryGenerateWithModel(model, prompt, apiKey, baseURL)
    return result
  } catch (error) {
    const errorMessage = error instanceof GeminiError ? error.message : String(error)
    console.warn(`模型 ${model} 调用失败，尝试备用模型...`)
    
    // 如果当前模型失败，尝试其他模型
    for (const fallbackModel of AVAILABLE_MODELS) {
      if (fallbackModel === model) continue // 跳过已经失败的模型
      
      try {
        const result = await tryGenerateWithModel(fallbackModel, prompt, apiKey, baseURL)
        
        // 成功后更新运行时模型
        RUNTIME_MODEL = fallbackModel
        console.log(`已切换到备用模型: ${fallbackModel}`)
        
        return result
      } catch (retryError) {
        // 静默继续尝试下一个模型
        continue
      }
    }
    
    // 所有模型都失败了
    throw new GeminiError(
      `所有可用模型都调用失败。最后的错误: ${errorMessage}\n\n` +
      `建议：\n` +
      `1. 检查 API key 是否有效\n` +
      `2. 检查网络连接\n` +
      `3. 在配置页面测试连接\n` +
      `4. 联系服务商确认可用的模型列表`
    )
  }
}

// 导出供浏览器控制台使用的辅助函数
if (typeof window !== 'undefined') {
  ;(window as any).geminiAPI = {
    testGetModels: getAvailableModels,
    setModel: setCurrentModel,
    setConfig: setAPIConfig,
    getConfig: getAPIConfig,
    testConnection: testAPIConnection
  }
}
