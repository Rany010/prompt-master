/**
 * 本地存储服务
 * 用于持久化保存用户创建的模板和配置
 */

import type { Template } from '../types'

export const STORAGE_KEYS = {
  TEMPLATES: 'prompt_master_templates',
  AI_CONFIG: 'prompt_master_ai_config',
  APP_CONFIG: 'prompt_master_app_config'
} as const

/**
 * 保存模板列表到本地存储
 */
export function saveTemplates(templates: Template[]): void {
  try {
    // 只保存用户创建的模板（非默认模板）
    const userTemplates = templates.filter(t => !t.isDefault)
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(userTemplates))
  } catch (error) {
    console.error('保存模板失败:', error)
    throw new Error('保存模板失败，可能是存储空间不足')
  }
}

/**
 * 从本地存储加载模板列表
 */
export function loadTemplates(): Template[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES)
    if (!data) return []
    return JSON.parse(data)
  } catch (error) {
    console.error('加载模板失败:', error)
    return []
  }
}

/**
 * 删除单个模板
 */
export function deleteTemplate(templateId: string, templates: Template[]): Template[] {
  const updatedTemplates = templates.filter(t => t.id !== templateId)
  saveTemplates(updatedTemplates)
  return updatedTemplates
}

/**
 * 保存应用配置
 */
export function saveAppConfig(config: any): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(config))
  } catch (error) {
    console.error('保存配置失败:', error)
  }
}

/**
 * 加载应用配置
 */
export function loadAppConfig(): any {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APP_CONFIG)
    if (!data) return null
    return JSON.parse(data)
  } catch (error) {
    console.error('加载配置失败:', error)
    return null
  }
}

/**
 * 保存AI配置
 */
export function saveAIConfig(config: any): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(config))
  } catch (error) {
    console.error('保存AI配置失败:', error)
    throw new Error('保存AI配置失败')
  }
}

/**
 * 加载AI配置
 */
export function loadAIConfig(): any {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AI_CONFIG)
    if (!data) {
      // 兼容旧的存储键名
      const oldData = localStorage.getItem('aiConfig')
      if (oldData) {
        const config = JSON.parse(oldData)
        // 迁移到新的键名
        saveAIConfig(config)
        localStorage.removeItem('aiConfig')
        return config
      }
      return null
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('加载AI配置失败:', error)
    return null
  }
}

/**
 * 清空所有存储数据
 */
export function clearAllStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES)
    localStorage.removeItem(STORAGE_KEYS.AI_CONFIG)
    localStorage.removeItem(STORAGE_KEYS.APP_CONFIG)
  } catch (error) {
    console.error('清空存储失败:', error)
  }
}

/**
 * 导出所有数据（用于备份）
 */
export function exportAllData(): string {
  try {
    const data = {
      templates: loadTemplates(),
      appConfig: loadAppConfig(),
      aiConfig: loadAIConfig(),
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    }
    
    // 尝试 JSON 序列化，捕获循环引用错误
    return JSON.stringify(data, (key, value) => {
      // 移除可能导致问题的循环引用
      if (key === 'selected') {
        return undefined
      }
      return value
    }, 2)
  } catch (error) {
    console.error('导出数据时发生错误:', error)
    // 返回最小化的安全数据
    return JSON.stringify({
      templates: [],
      appConfig: null,
      aiConfig: null,
      exportTime: new Date().toISOString(),
      version: '1.0.0',
      error: 'Export failed: ' + (error as Error).message
    }, null, 2)
  }
}

/**
 * 导入数据结果
 */
export interface ImportResult {
  success: boolean
  error?: string
  imported: {
    templates: number
    templatesSkipped: number
    aiConfig: boolean
    appConfig: boolean
  }
}

/**
 * 导入数据（从备份恢复）- 合并模式
 * @param jsonData JSON 格式的备份数据
 * @param merge 是否合并数据（true=追加，false=覆盖）
 */
export function importData(jsonData: string, merge: boolean = true): ImportResult {
  const result: ImportResult = {
    success: false,
    imported: {
      templates: 0,
      templatesSkipped: 0,
      aiConfig: false,
      appConfig: false
    }
  }

  try {
    const data = JSON.parse(jsonData)
    
    // 验证数据格式
    if (!data || typeof data !== 'object') {
      throw new Error('无效的数据格式')
    }
    
    // 验证是否是本应用导出的数据
    if (!data.version) {
      throw new Error('不是有效的备份文件')
    }
    
    // 导入模板
    if (data.templates && Array.isArray(data.templates)) {
      if (merge) {
        // 合并模式：追加新模板，避免重复
        const existingTemplates = loadTemplates()
        const existingIds = new Set(existingTemplates.map(t => t.id))
        const existingNames = new Set(existingTemplates.map(t => t.name))
        
        const newTemplates: Template[] = []
        let skipped = 0
        
        for (const template of data.templates) {
          // 检查是否已存在（通过ID或名称）
          if (existingIds.has(template.id)) {
            skipped++
            continue
          }
          
          // 如果名称重复，修改ID和名称
          if (existingNames.has(template.name)) {
            template.id = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            template.name = `${template.name} (导入)`
          }
          
          newTemplates.push(template)
        }
        
        const mergedTemplates = [...existingTemplates, ...newTemplates]
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(mergedTemplates))
        result.imported.templates = newTemplates.length
        result.imported.templatesSkipped = skipped
      } else {
        // 覆盖模式：直接替换
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data.templates))
        result.imported.templates = data.templates.length
      }
    }
    
    // 导入应用配置（总是覆盖）
    if (data.appConfig) {
      localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(data.appConfig))
      result.imported.appConfig = true
    }
    
    // 导入AI配置（总是覆盖）
    if (data.aiConfig) {
      localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(data.aiConfig))
      result.imported.aiConfig = true
      // 清除旧的AI配置键名
      localStorage.removeItem('aiConfig')
    }
    
    result.success = true
    return result
  } catch (error) {
    console.error('导入数据失败:', error)
    result.error = error instanceof Error ? error.message : '未知错误'
    return result
  }
}

