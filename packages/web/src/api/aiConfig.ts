// AI 配置 API 客户端

export interface AIConfigData {
  id?: number
  name: string
  url: string
  api_key: string
  created_at?: string
  updated_at?: string
}

const API_BASE = '/.netlify/functions'

export const aiConfigAPI = {
  // 获取所有配置
  async getAll(): Promise<AIConfigData[]> {
    const response = await fetch(`${API_BASE}/ai-config`)
    if (!response.ok) {
      throw new Error('获取配置失败')
    }
    return response.json()
  },

  // 获取单个配置
  async getById(id: number): Promise<AIConfigData> {
    const response = await fetch(`${API_BASE}/ai-config?id=${id}`)
    if (!response.ok) {
      throw new Error('获取配置失败')
    }
    return response.json()
  },

  // 创建配置
  async create(config: AIConfigData): Promise<AIConfigData> {
    const response = await fetch(`${API_BASE}/ai-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '创建配置失败')
    }
    return response.json()
  },

  // 更新配置
  async update(id: number, config: AIConfigData): Promise<AIConfigData> {
    const response = await fetch(`${API_BASE}/ai-config?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '更新配置失败')
    }
    return response.json()
  },

  // 删除配置
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/ai-config?id=${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '删除配置失败')
    }
  }
}

