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
  const data = {
    templates: loadTemplates(),
    appConfig: loadAppConfig(),
    exportTime: new Date().toISOString()
  }
  return JSON.stringify(data, null, 2)
}

/**
 * 导入数据（从备份恢复）
 */
export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    if (data.templates) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data.templates))
    }
    if (data.appConfig) {
      localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(data.appConfig))
    }
    return true
  } catch (error) {
    console.error('导入数据失败:', error)
    return false
  }
}

