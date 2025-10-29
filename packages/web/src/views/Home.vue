<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <i class="fa fa-magic text-primary text-2xl"></i>
          <h1 class="text-xl md:text-2xl font-bold">提示词优化生成工具</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            type="button"
            class="text-neutral hover:text-primary transition-colors"
            @click="showHelp"
          >
            <i class="fa fa-question-circle"></i>
            <span class="hidden md:inline ml-1">帮助</span>
          </button>
          <button 
            type="button"
            class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
            @click="showAIConfigModal = true"
          >
            <i class="fa fa-cog mr-1"></i>
            <span class="hidden md:inline">配置AI</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- 左侧：输入区域 -->
        <section class="lg:col-span-1">
          <div class="bg-white rounded-xl p-5 card-shadow h-full">
            <h2 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fa fa-pencil-square-o text-primary mr-2"></i>
              提示词输入
            </h2>
            
            <!-- 输入方式切换标签 -->
            <div class="flex border-b border-gray-200 mb-4">
              <button 
                type="button"
                :class="['px-4 py-2 text-sm transition-all', inputMode === 'structured' ? 'tab-active' : 'text-neutral']"
                @click="inputMode = 'structured'"
              >
                结构化输入
              </button>
              <button 
                type="button"
                :class="['px-4 py-2 text-sm transition-all', inputMode === 'raw' ? 'tab-active' : 'text-neutral']"
                @click="inputMode = 'raw'"
              >
                原始提示词
              </button>
            </div>
            
            <!-- 结构化输入区域 -->
            <div v-show="inputMode === 'structured'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral mb-1">名称/主题</label>
                <input 
                  v-model="structuredInput.name"
                  type="text" 
                  placeholder="输入核心名称或主题" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-neutral mb-1">核心卖点</label>
                <textarea 
                  v-model="structuredInput.features"
                  placeholder="描述主要特点和优势，多个卖点用逗号分隔" 
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-neutral mb-1">适用人群</label>
                <input 
                  v-model="structuredInput.audience"
                  type="text" 
                  placeholder="例如：年轻人、专业人士、学生等" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-neutral mb-1">目标场景</label>
                <input 
                  v-model="structuredInput.scene"
                  type="text" 
                  placeholder="例如：办公室、户外、家庭聚会等" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-neutral mb-1">风格要求</label>
                <select 
                  v-model="structuredInput.style"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                >
                  <option value="">请选择风格</option>
                  <option value="简约">简约风格</option>
                  <option value="专业">专业风格</option>
                  <option value="生动">生动活泼</option>
                  <option value="正式">正式严谨</option>
                  <option value="创意">创意独特</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-neutral mb-1">额外要求</label>
                <textarea 
                  v-model="structuredInput.extra"
                  placeholder="其他需要补充的信息" 
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                ></textarea>
              </div>
              
              <!-- 自定义字段 -->
              <div v-for="(field, index) in structuredInput.customFields" :key="`field-${index}`" class="flex gap-2 items-start">
                <input 
                  v-model="field.name"
                  type="text" 
                  placeholder="字段名称" 
                  class="w-28 px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                />
                <input 
                  v-model="field.value"
                  type="text" 
                  placeholder="字段内容" 
                  class="flex-1 px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                />
                <button 
                  type="button"
                  class="text-neutral hover:text-red-500 p-2 flex-shrink-0"
                  @click="removeCustomField(index)"
                >
                  <i class="fa fa-times"></i>
                </button>
              </div>
              
              <button 
                type="button"
                class="w-full text-primary hover:text-primary/80 text-sm py-2 border border-dashed border-primary/30 rounded-lg transition-colors flex items-center justify-center"
                @click="addCustomField"
              >
                <i class="fa fa-plus mr-1"></i> 添加自定义字段
              </button>
            </div>
            
            <!-- 原始提示词输入区域 -->
            <div v-show="inputMode === 'raw'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral mb-1">
                  原始提示词内容
                  <span class="text-xs text-neutral/70 ml-1">(支持直接粘贴)</span>
                </label>
                <div class="relative">
                  <textarea 
                    v-model="rawText"
                    placeholder="粘贴您的原始提示词内容..." 
                    rows="8"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
                  ></textarea>
                  <button 
                    type="button"
                    class="absolute right-2 top-2 text-neutral hover:text-primary text-sm p-1"
                    @click="pasteFromClipboard"
                  >
                    <i class="fa fa-clipboard mr-1"></i> 粘贴
                  </button>
                </div>
              </div>
              
              <div class="bg-blue-50 p-3 rounded-lg text-sm">
                <i class="fa fa-info-circle text-primary mr-1"></i>
                <span>系统将基于您的原始提示词，结合所选模板进行优化生成</span>
              </div>
              
              <button 
                type="button"
                class="w-full text-primary hover:text-primary/80 text-sm py-2 border border-dashed border-primary/30 rounded-lg transition-colors flex items-center justify-center"
                @click="parseRawText"
              >
                <i class="fa fa-magic mr-1"></i> 解析为结构化信息
              </button>
            </div>
          </div>
        </section>
        
        <!-- 中间：模板选择区域 -->
        <section class="lg:col-span-1">
          <div class="bg-white rounded-xl p-5 card-shadow h-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fa fa-th-large text-primary mr-2"></i>
                模板选择
              </h2>
              <button 
                type="button"
                class="text-sm text-primary hover:text-primary/80 transition-colors"
                @click="showTemplateModal = true"
              >
                <i class="fa fa-plus-circle mr-1"></i> 新建模板
              </button>
            </div>
            
            <p class="text-sm text-neutral mb-4">选择需要应用的模板（可多选）</p>
            
            <div class="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
              <label 
                v-for="template in templates" 
                :key="template.id"
                class="flex items-center p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input 
                  v-model="template.selected"
                  type="checkbox" 
                  class="w-4 h-4 text-primary rounded focus:ring-primary/50"
                />
                <span class="ml-3">{{ template.name }}</span>
              </label>
            </div>
            
            <div class="mt-6">
              <button 
                type="button"
                class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
                @click="generatePrompts"
              >
                <i class="fa fa-cog mr-2"></i> 生成提示词
              </button>
            </div>
          </div>
        </section>
        
        <!-- 右侧：生成结果区域 -->
        <section class="lg:col-span-1">
          <div class="bg-white rounded-xl p-5 card-shadow h-full">
            <h2 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fa fa-file-text-o text-primary mr-2"></i>
              生成结果
            </h2>
            
            <div class="flex justify-between items-center mb-4">
              <p class="text-sm text-neutral">
                已选择 <span class="font-medium text-primary">{{ selectedTemplatesCount }}</span> 个模板
              </p>
              <button 
                type="button"
                class="text-sm text-neutral hover:text-red-500 transition-colors"
                @click="clearResults"
              >
                <i class="fa fa-trash-o mr-1"></i> 清空
              </button>
            </div>
            
            <div class="space-y-4 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
              <div v-if="results.length === 0" class="text-center py-12 text-neutral/70">
                <i class="fa fa-lightbulb-o text-4xl mb-3 opacity-50"></i>
                <p>选择模板并点击生成按钮</p>
                <p class="text-sm mt-1">将在这里展示生成的提示词</p>
              </div>
              
              <div 
                v-for="result in results" 
                :key="result.id"
                class="p-4 border border-gray-100 rounded-lg bg-gray-50"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-sm">{{ result.templateName }}</h4>
                  <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    模板 {{ result.templateIndex }}
                  </span>
                </div>
                <p class="text-sm text-gray-700 mb-3">{{ result.content }}</p>
                <button 
                  type="button"
                  class="text-xs text-primary hover:text-primary/80 transition-colors flex items-center"
                  @click="copyToClipboard(result.content, result.id)"
                >
                  <i class="fa fa-copy mr-1"></i> 
                  <span>{{ copiedId === result.id ? '已复制' : '复制' }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    
    <!-- 新建模板模态框 -->
    <div 
      v-if="showTemplateModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click.self="closeTemplateModal"
    >
      <div 
        class="bg-white rounded-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300"
        :class="modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">创建自定义模板</h3>
          <button 
            type="button"
            class="text-neutral hover:text-dark"
            @click="closeTemplateModal"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">模板名称</label>
            <input 
              v-model="newTemplate.name"
              type="text" 
              placeholder="例如：节日促销风格" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">模板格式</label>
            <p class="text-xs text-neutral/70 mb-1" v-text="'使用 {{字段名}} 表示结构化输入中的内容'"></p>
            <textarea 
              v-model="newTemplate.format"
              placeholder="例如：展示{{名称}}的{{核心卖点}}，突出适合{{适用人群}}的优势" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            ></textarea>
          </div>
        </div>
        
        <div class="mt-6 flex space-x-3">
          <button 
            type="button"
            class="flex-1 py-2 border border-gray-200 rounded-lg text-neutral hover:bg-gray-50 transition-colors"
            @click="closeTemplateModal"
          >
            取消
          </button>
          <button 
            type="button"
            class="flex-1 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            @click="saveNewTemplate"
          >
            保存模板
          </button>
        </div>
      </div>
    </div>
    
    <!-- AI配置模态框 -->
    <div 
      v-if="showAIConfigModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click.self="closeAIConfigModal"
    >
      <div 
        class="bg-white rounded-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300"
        :class="aiModalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">配置AI</h3>
          <button 
            type="button"
            class="text-neutral hover:text-dark"
            @click="closeAIConfigModal"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">AI名称</label>
            <input 
              v-model="aiConfig.name"
              type="text" 
              placeholder="例如：GPT-4、Claude、通义千问等" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">API URL</label>
            <input 
              v-model="aiConfig.url"
              type="text" 
              placeholder="例如：https://api.openai.com/v1/chat/completions" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">API Key</label>
            <div class="relative">
              <input 
                v-model="aiConfig.apiKey"
                :type="showApiKey ? 'text' : 'password'" 
                placeholder="输入您的API密钥" 
                class="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg input-focus transition"
              />
              <button 
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral hover:text-primary"
                @click="showApiKey = !showApiKey"
              >
                <i :class="showApiKey ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div class="bg-blue-50 p-3 rounded-lg text-sm">
            <i class="fa fa-info-circle text-primary mr-1"></i>
            <span>配置信息将保存在本地浏览器中，不会上传到服务器</span>
          </div>
        </div>
        
        <div class="mt-6 space-y-3">
          <button 
            type="button"
            class="w-full py-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            @click="testAIConnection"
            :disabled="testingConnection"
          >
            <i v-if="!testingConnection" class="fa fa-plug mr-2"></i>
            <i v-else class="fa fa-spinner fa-spin mr-2"></i>
            <span>{{ testingConnection ? '测试中...' : '测试连接' }}</span>
          </button>
          
          <div class="flex space-x-3">
            <button 
              type="button"
              class="flex-1 py-2 border border-gray-200 rounded-lg text-neutral hover:bg-gray-50 transition-colors"
              @click="closeAIConfigModal"
            >
              取消
            </button>
            <button 
              type="button"
              class="flex-1 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              @click="saveAIConfig"
            >
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import type { StructuredInput, Template, GeneratedResult, InputMode, AIConfig } from '../types'

const message = useMessage()

// 输入模式
const inputMode = ref<InputMode>('structured')

// 结构化输入数据
const structuredInput = ref<StructuredInput>({
  name: '',
  features: '',
  audience: '',
  scene: '',
  style: '',
  extra: '',
  customFields: [] // Initialize with empty array
})

// 原始提示词文本
const rawText = ref('')

// 模板列表
const templates = ref<Template[]>([
  { id: '1', name: '产品特写 + 细节展示', format: '展示{{名称}}的细节特写，突出{{核心卖点}}，适合{{适用人群}}使用', selected: false },
  { id: '2', name: '多角度旋转展示', format: '从多个角度展示{{名称}}，全方位呈现{{核心卖点}}', selected: false },
  { id: '3', name: '第一人称开箱体验', format: '以第一人称视角展示{{名称}}的开箱体验，强调{{核心卖点}}带来的惊喜感', selected: false },
  { id: '4', name: '户外运动场景展示', format: '在{{目标场景}}中展示{{名称}}，突出{{核心卖点}}在实际使用中的优势', selected: false },
  { id: '5', name: '使用前后对比', format: '通过使用前后对比展示{{名称}}的{{核心卖点}}，让{{适用人群}}一目了然', selected: false }
])

// 生成结果
const results = ref<GeneratedResult[]>([])

// 已选择的模板数量
const selectedTemplatesCount = computed(() => {
  return templates.value.filter(t => t.selected).length
})

// 模态框状态
const showTemplateModal = ref(false)
const modalAnimating = ref(false)
const newTemplate = ref({
  name: '',
  format: ''
})

// AI配置模态框状态
const showAIConfigModal = ref(false)
const aiModalAnimating = ref(false)
const showApiKey = ref(false)
const testingConnection = ref(false)
const aiConfig = ref<AIConfig>({
  name: '',
  url: '',
  apiKey: ''
})

// 复制状态
const copiedId = ref('')

// 添加自定义字段
const addCustomField = () => {
  structuredInput.value.customFields.push({ name: '', value: '' })
}

// 移除自定义字段
const removeCustomField = (index: number) => {
  structuredInput.value.customFields.splice(index, 1)
}

// 从剪贴板粘贴
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    rawText.value = text
    message.success('粘贴成功')
  } catch (err) {
    message.error('粘贴失败，请使用Ctrl+V或右键粘贴')
  }
}

// 解析原始提示词为结构化信息
const parseRawText = () => {
  if (!rawText.value.trim()) {
    message.warning('请先输入或粘贴原始提示词内容')
    return
  }
  
  // 这里可以添加更复杂的解析逻辑
  // 目前简单地将原始文本放入名称字段
  inputMode.value = 'structured'
  structuredInput.value.name = rawText.value.substring(0, 50)
  message.success('已尝试解析原始提示词到结构化字段中！')
}

// 生成提示词
const generatePrompts = () => {
  const selectedTemplates = templates.value.filter(t => t.selected)
  
  if (selectedTemplates.length === 0) {
    message.warning('请至少选择一个模板')
    return
  }
  
  const isStructured = inputMode.value === 'structured'
  
  // 验证输入
  if (isStructured && !structuredInput.value.name.trim()) {
    message.warning('请至少填写名称/主题')
    return
  }
  
  if (!isStructured && !rawText.value.trim()) {
    message.warning('请填写原始提示词内容')
    return
  }
  
  results.value = []
  
  selectedTemplates.forEach((template, index) => {
    let content = ''
    
    if (isStructured) {
      // 结构化输入：使用模板格式替换变量
      content = template.format
        .replace(/\{\{名称\}\}/g, structuredInput.value.name || '产品')
        .replace(/\{\{核心卖点\}\}/g, structuredInput.value.features || '核心特点')
        .replace(/\{\{适用人群\}\}/g, structuredInput.value.audience || '用户')
        .replace(/\{\{目标场景\}\}/g, structuredInput.value.scene || '使用场景')
      
      // 添加风格和额外要求
      if (structuredInput.value.style) {
        content += `，采用${structuredInput.value.style}风格`
      }
      if (structuredInput.value.extra) {
        content += `。${structuredInput.value.extra}`
      }
    } else {
      // 原始提示词：基于模板优化
      const rawPreview = rawText.value.substring(0, 30) + (rawText.value.length > 30 ? '...' : '')
      content = `根据"${template.name}"模板优化：基于"${rawPreview}"扩展细节，增强场景感和表现力，符合模板风格特点。原始内容：${rawText.value}`
    }
    
    results.value.push({
      id: `result-${Date.now()}-${index}`,
      templateName: template.name,
      content,
      templateIndex: index + 1
    })
  })
  
  message.success(`成功生成 ${results.value.length} 个提示词`)
}

// 清空结果
const clearResults = () => {
  results.value = []
  templates.value.forEach(t => t.selected = false)
  message.info('已清空所有结果')
}

// 复制到剪贴板
const copyToClipboard = async (text: string, id: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = id
    message.success('复制成功')
    setTimeout(() => {
      copiedId.value = ''
    }, 2000)
  } catch (err) {
    message.error('复制失败')
  }
}

// 关闭模板模态框
const closeTemplateModal = () => {
  modalAnimating.value = false
  setTimeout(() => {
    showTemplateModal.value = false
    newTemplate.value = { name: '', format: '' }
  }, 300)
}

// 保存新模板
const saveNewTemplate = () => {
  if (!newTemplate.value.name.trim() || !newTemplate.value.format.trim()) {
    message.warning('请填写完整的模板信息')
    return
  }
  
  templates.value.push({
    id: `template-${Date.now()}`,
    name: newTemplate.value.name,
    format: newTemplate.value.format,
    selected: false
  })
  
  message.success('模板保存成功！')
  closeTemplateModal()
}

// 关闭AI配置模态框
const closeAIConfigModal = () => {
  aiModalAnimating.value = false
  setTimeout(() => {
    showAIConfigModal.value = false
    showApiKey.value = false
  }, 300)
}

// 测试AI连接
const testAIConnection = async () => {
  // 验证配置
  if (!aiConfig.value.url.trim()) {
    message.warning('请先填写API URL')
    return
  }
  
  if (!aiConfig.value.apiKey.trim()) {
    message.warning('请先填写API Key')
    return
  }
  
  testingConnection.value = true
  
  try {
    // 发送测试请求
    const response = await fetch(aiConfig.value.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiConfig.value.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        max_tokens: 5
      })
    })
    
    if (response.ok) {
      await response.json()
      message.success('✓ 连接成功！AI配置正常')
    } else {
      const errorData = await response.json().catch(() => ({}))
      const errorMsg = errorData.error?.message || `连接失败 (${response.status})`
      message.error(`✗ ${errorMsg}`)
    }
  } catch (error: any) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      message.error('✗ 网络错误：无法连接到API服务器，请检查URL是否正确')
    } else {
      message.error(`✗ 连接失败：${error.message}`)
    }
  } finally {
    testingConnection.value = false
  }
}

// 保存AI配置
const saveAIConfig = () => {
  if (!aiConfig.value.name.trim()) {
    message.warning('请填写AI名称')
    return
  }
  
  if (!aiConfig.value.url.trim()) {
    message.warning('请填写API URL')
    return
  }
  
  if (!aiConfig.value.apiKey.trim()) {
    message.warning('请填写API Key')
    return
  }
  
  // 保存到本地存储
  localStorage.setItem('aiConfig', JSON.stringify(aiConfig.value))
  message.success('AI配置保存成功！')
  closeAIConfigModal()
}

// 显示帮助
const showHelp = () => {
  message.info('欢迎使用提示词优化生成工具！选择输入方式，填写信息，选择模板，即可生成优化的提示词。')
}

// 监听模态框显示状态，添加动画
watch(showTemplateModal, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      modalAnimating.value = true
    }, 50)
  }
})

// 监听AI配置模态框显示状态，添加动画
watch(showAIConfigModal, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      aiModalAnimating.value = true
    }, 50)
  }
})

// 加载配置
onMounted(() => {
  // 加载应用配置
  const savedConfig = localStorage.getItem('promptMasterConfig')
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      if (config.structuredInput) {
        structuredInput.value = config.structuredInput
      }
      if (config.templates) {
        // 合并保存的模板和默认模板
        config.templates.forEach((savedTemplate: Template) => {
          const existingIndex = templates.value.findIndex(t => t.id === savedTemplate.id)
          if (existingIndex !== -1) {
            templates.value[existingIndex] = savedTemplate
          } else {
            templates.value.push(savedTemplate)
          }
        })
      }
      if (config.inputMode) {
        inputMode.value = config.inputMode
      }
    } catch (err) {
      console.error('加载配置失败:', err)
    }
  }
  
  // 加载AI配置
  const savedAIConfig = localStorage.getItem('aiConfig')
  if (savedAIConfig) {
    try {
      const config = JSON.parse(savedAIConfig)
      aiConfig.value = config
      message.success('已加载AI配置')
    } catch (err) {
      console.error('加载AI配置失败:', err)
    }
  }
})
</script>
