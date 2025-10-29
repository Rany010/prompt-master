import type { InputMode, StructuredInput, Template } from '../types'

const GEMINI_API_KEY = 'AIzaSyDxim_2tjiL4f02Yf56yWiIYi3pl3I4iqM'
const GEMINI_MODEL = 'gemini-2.0-flash-exp'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export interface GeminiGenerationOptions {
  template: Template
  inputMode: InputMode
  structuredInput: StructuredInput
  rawText: string
}

interface GeminiSuccessResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

interface GeminiErrorResponse {
  error?: {
    message?: string
    status?: string
    code?: number
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

export const optimizePromptWithGemini = async (options: GeminiGenerationOptions): Promise<string> => {
  const prompt = buildGeminiPrompt(options)

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    })
  })

  const data = (await response.json()) as GeminiSuccessResponse & GeminiErrorResponse

  if (!response.ok) {
    const message = data.error?.message || `Gemini API 调用失败，状态码 ${response.status}`
    throw new GeminiError(message, data.error?.status, data.error?.code)
  }

  const candidate = data.candidates?.[0]
  const textPart = candidate?.content?.parts?.find(part => typeof part.text === 'string')

  if (!textPart?.text) {
    throw new GeminiError('Gemini API 未返回有效的文本内容')
  }

  return textPart.text.trim()
}


