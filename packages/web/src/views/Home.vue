<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <i class="fa fa-video-camera text-primary text-2xl"></i>
          <h1 class="text-xl md:text-2xl font-bold">Sora 2 视频提示词生成器</h1>
          <span class="hidden md:inline text-sm text-gray-500 ml-2">内部试用版</span>
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
            class="text-neutral hover:text-primary transition-colors"
            @click="exportData"
            title="导出模板数据"
          >
            <i class="fa fa-download"></i>
            <span class="hidden md:inline ml-1">导出</span>
          </button>
          <button 
            type="button"
            class="text-neutral hover:text-primary transition-colors"
            @click="triggerImport"
            title="导入模板数据"
          >
            <i class="fa fa-upload"></i>
            <span class="hidden md:inline ml-1">导入</span>
          </button>
          <input 
            ref="importFileInput"
            type="file" 
            accept=".json"
            style="display: none"
            @change="handleImport"
          />
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
              产品信息输入
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
                <span>AI 将基于您的描述，生成适合 Sora 2 的专业英文视频提示词</span>
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
                <i class="fa fa-film text-primary mr-2"></i>
                视频场景模板
              </h2>
              <button 
                type="button"
                class="text-sm text-primary hover:text-primary/80 transition-colors"
                @click="showTemplateModal = true"
              >
                <i class="fa fa-plus-circle mr-1"></i> 新建模板
              </button>
            </div>
            
            <p class="text-sm text-neutral mb-4">选择视频风格模板（可多选），AI 将生成适合 Sora 2 的英文提示词</p>
            
            <div class="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
              <div 
                v-for="template in templates" 
                :key="template.id"
                class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <label class="flex items-center flex-1 cursor-pointer">
                  <input 
                    v-model="template.selected"
                    type="checkbox" 
                    class="w-4 h-4 text-primary rounded focus:ring-primary/50"
                  />
                  <span class="ml-3">{{ template.name }}</span>
                  <span v-if="template.isDefault" class="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                    默认
                  </span>
                </label>
                <button
                  type="button"
                  class="ml-2 text-primary hover:text-primary/80 text-sm transition-colors"
                  @click="openEditTemplate(template)"
                  title="查看/编辑模板"
                >
                  <i class="fa fa-eye mr-1"></i>
                  查看
                </button>
                <button
                  v-if="!template.isDefault"
                  type="button"
                  class="ml-2 text-neutral hover:text-red-500 text-sm transition-colors"
                  @click="deleteTemplate(template)"
                  title="删除模板"
                >
                  <i class="fa fa-trash-o"></i>
                </button>
              </div>
            </div>
            
            <div class="mt-6">
              <button 
                type="button"
                class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                @click="generatePrompts"
                :disabled="generating"
              >
                <i v-if="!generating" class="fa fa-cog mr-2"></i>
                <i v-else class="fa fa-spinner fa-spin mr-2"></i>
                <span>{{ generating ? '生成中...' : '生成提示词' }}</span>
              </button>
            </div>
          </div>
        </section>
        
        <!-- 右侧：生成结果区域 -->
        <section class="lg:col-span-1">
          <div class="bg-white rounded-xl p-5 card-shadow h-full">
            <h2 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fa fa-code text-primary mr-2"></i>
              Sora 2 提示词
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
                <i class="fa fa-video-camera text-4xl mb-3 opacity-50"></i>
                <p>选择视频场景模板并点击生成</p>
                <p class="text-sm mt-1">AI 将生成适合 Sora 2 的英文提示词</p>
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
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="closeTemplateModal"
    >
      <div 
        class="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300"
        :class="modalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- 固定的头部 -->
        <div class="px-6 pt-6 pb-4 border-b border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">创建专业视频场景模板</h3>
            <button 
              type="button"
              class="text-neutral hover:text-dark"
              @click="closeTemplateModal"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <!-- 模式切换 -->
          <div class="flex border-b border-gray-200">
            <button 
              type="button"
              :class="['px-4 py-2 text-sm transition-all', templateMode === 'professional' ? 'tab-active' : 'text-neutral']"
              @click="templateMode = 'professional'"
            >
              <i class="fa fa-sliders mr-1"></i> 专业模式
            </button>
            <button 
              type="button"
              :class="['px-4 py-2 text-sm transition-all', templateMode === 'simple' ? 'tab-active' : 'text-neutral']"
              @click="templateMode = 'simple'"
            >
              <i class="fa fa-bolt mr-1"></i> 简单模式
            </button>
          </div>
        </div>
        
        <!-- 可滚动的内容区域 -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div class="space-y-4">
          <!-- 模板名称 -->
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">模板名称 *</label>
            <input 
              v-model="newTemplate.name"
              type="text" 
              placeholder="例如：科技产品特写展示" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            />
          </div>
          
          <!-- 简单模式 -->
          <div v-if="templateMode === 'simple'">
            <label class="block text-sm font-medium text-neutral mb-1">模板格式 *</label>
            <p class="text-xs text-neutral/70 mb-1" v-pre>使用 {{名称}}、{{核心卖点}}、{{适用人群}}、{{目标场景}} 表示用户输入的内容</p>
            <textarea 
              v-model="newTemplate.format"
              placeholder="例如：Close-up cinematic shot of {{名称}}, highlighting {{核心卖点}}, perfect for {{适用人群}} in {{目标场景}}." 
              rows="4"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            ></textarea>
          </div>
          
          <!-- 专业模式 -->
          <div v-if="templateMode === 'professional'" class="space-y-6">
            <p class="text-sm text-neutral/70 bg-blue-50 p-3 rounded-lg">
              <i class="fa fa-info-circle text-primary mr-1"></i>
              专业模式将根据5个维度自动生成高质量的Sora 2提示词。填写的内容会与用户输入（名称、卖点、人群、场景）智能结合。
            </p>
            
            <!-- 1. 情节与动作 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                情节与动作
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">时序与转场</label>
                  <input 
                    v-model="newTemplate.structured.plotAction.sequence"
                    type="text" 
                    placeholder="例如：产品特写 → 用户拿取 → 户外使用 → 品牌Logo渐出" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">主体运动</label>
                  <input 
                    v-model="newTemplate.structured.plotAction.subjectMotion"
                    type="text" 
                    placeholder="例如：产品从左下角平滑滑入屏幕中央" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">互动行为</label>
                  <input 
                    v-model="newTemplate.structured.plotAction.interaction"
                    type="text" 
                    placeholder="例如：手轻柔地触摸屏幕，快速点击并滑动" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 2. 摄影与运镜 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                摄影与运镜
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">景别</label>
                  <input 
                    v-model="newTemplate.structured.cinematography.shotSize"
                    type="text" 
                    placeholder="例如：特写 (Close-up)、中景 (Medium Shot)" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">机位与角度</label>
                  <input 
                    v-model="newTemplate.structured.cinematography.cameraAngle"
                    type="text" 
                    placeholder="例如：低角度仰拍、俯拍 (Top-down view)" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">运镜</label>
                  <input 
                    v-model="newTemplate.structured.cinematography.cameraMovement"
                    type="text" 
                    placeholder="例如：平稳的推镜头、缓慢的环绕镜头" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 3. 视觉风格与美学 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                视觉风格与美学
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">风格类型</label>
                  <input 
                    v-model="newTemplate.structured.visualStyle.styleType"
                    type="text" 
                    placeholder="例如：超写实主义、电影胶片质感、未来主义" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">光线与色彩</label>
                  <input 
                    v-model="newTemplate.structured.visualStyle.lightingColor"
                    type="text" 
                    placeholder="例如：柔和的自然光、高对比度戏剧性布光、暖色调" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">渲染品质</label>
                  <input 
                    v-model="newTemplate.structured.visualStyle.renderQuality"
                    type="text" 
                    placeholder="例如：8K分辨率、浅景深、电影级渲染" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 4. 情绪与氛围 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                情绪与氛围
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">情绪基调</label>
                  <input 
                    v-model="newTemplate.structured.emotionMood.moodTone"
                    type="text" 
                    placeholder="例如：平静而优雅、紧张刺激、充满活力" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">目标受众定位</label>
                  <input 
                    v-model="newTemplate.structured.emotionMood.targetAudience"
                    type="text" 
                    placeholder="例如：高端科技消费者、年轻时尚群体" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 5. 约束与排除 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">5</span>
                约束与排除
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">排除元素</label>
                  <input 
                    v-model="newTemplate.structured.constraints.exclusions"
                    type="text" 
                    placeholder="例如：排除任何水渍或灰尘、无水印" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">负面提示</label>
                  <input 
                    v-model="newTemplate.structured.constraints.negativePrompts"
                    type="text" 
                    placeholder="例如：无鬼影、无剧烈晃动、画面稳定" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        
        <!-- 固定的底部按钮 -->
        <div class="px-6 py-4 border-t border-gray-100">
          <div class="flex space-x-3">
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
    </div>
    
    <!-- 编辑模板模态框 -->
    <div 
      v-if="showEditTemplateModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="closeEditTemplateModal"
    >
      <div 
        class="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300"
        :class="editModalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- 固定的头部 -->
        <div class="px-6 pt-6 pb-4 border-b border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">查看/编辑模板</h3>
            <button 
              type="button"
              class="text-neutral hover:text-dark"
              @click="closeEditTemplateModal"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <!-- 模式显示（编辑时只读显示是简单还是专业模式） -->
          <div v-if="editingTemplate">
            <span class="text-sm text-neutral/70 bg-blue-50 px-3 py-1 rounded-full">
              <i class="fa fa-info-circle mr-1"></i>
              {{ editingTemplate.structured ? '专业模式模板' : '简单模式模板' }}
            </span>
          </div>
        </div>
        
        <!-- 可滚动的内容区域 -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div class="space-y-4">
          <template v-if="editingTemplate">
          <!-- 模板名称 -->
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">模板名称 *</label>
            <input 
              v-model="editingTemplate.name"
              type="text" 
              placeholder="例如：科技产品特写展示" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            />
          </div>
          
          <!-- 简单模式 -->
          <div v-if="!editingTemplate.structured">
            <label class="block text-sm font-medium text-neutral mb-1">模板格式 *</label>
            <p class="text-xs text-neutral/70 mb-1" v-pre>使用 {{名称}}、{{核心卖点}}、{{适用人群}}、{{目标场景}} 表示用户输入的内容</p>
            <textarea 
              v-model="editingTemplate.format"
              placeholder="例如：Close-up cinematic shot of {{名称}}, highlighting {{核心卖点}}, perfect for {{适用人群}} in {{目标场景}}." 
              rows="4"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus transition"
            ></textarea>
          </div>
          
          <!-- 专业模式 -->
          <div v-if="editingTemplate.structured" class="space-y-6">
            
            <!-- 1. 情节与动作 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                情节与动作
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">时序与转场</label>
                  <input 
                    v-model="editingTemplate.structured.plotAction.sequence"
                    type="text" 
                    placeholder="例如：产品特写 → 用户拿取 → 户外使用 → 品牌Logo渐出" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">主体运动</label>
                  <input 
                    v-model="editingTemplate.structured.plotAction.subjectMotion"
                    type="text" 
                    placeholder="例如：产品从左下角平滑滑入屏幕中央" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">互动行为</label>
                  <input 
                    v-model="editingTemplate.structured.plotAction.interaction"
                    type="text" 
                    placeholder="例如：手轻柔地触摸屏幕，快速点击并滑动" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 2. 摄影与运镜 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                摄影与运镜
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">景别</label>
                  <input 
                    v-model="editingTemplate.structured.cinematography.shotSize"
                    type="text" 
                    placeholder="例如：特写 (Close-up)、中景 (Medium Shot)" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">机位与角度</label>
                  <input 
                    v-model="editingTemplate.structured.cinematography.cameraAngle"
                    type="text" 
                    placeholder="例如：低角度仰拍、俯拍 (Top-down view)" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">运镜</label>
                  <input 
                    v-model="editingTemplate.structured.cinematography.cameraMovement"
                    type="text" 
                    placeholder="例如：平稳的推镜头、缓慢的环绕镜头" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 3. 视觉风格与美学 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                视觉风格与美学
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">风格类型</label>
                  <input 
                    v-model="editingTemplate.structured.visualStyle.styleType"
                    type="text" 
                    placeholder="例如：超写实主义、电影胶片质感、未来主义" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">光线与色彩</label>
                  <input 
                    v-model="editingTemplate.structured.visualStyle.lightingColor"
                    type="text" 
                    placeholder="例如：柔和的自然光、高对比度戏剧性布光、暖色调" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">渲染品质</label>
                  <input 
                    v-model="editingTemplate.structured.visualStyle.renderQuality"
                    type="text" 
                    placeholder="例如：8K分辨率、浅景深、电影级渲染" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 4. 情绪与氛围 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                情绪与氛围
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">情绪基调</label>
                  <input 
                    v-model="editingTemplate.structured.emotionMood.moodTone"
                    type="text" 
                    placeholder="例如：平静而优雅、紧张刺激、充满活力" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">目标受众定位</label>
                  <input 
                    v-model="editingTemplate.structured.emotionMood.targetAudience"
                    type="text" 
                    placeholder="例如：高端科技消费者、年轻时尚群体" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
            
            <!-- 5. 约束与排除 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-3 flex items-center">
                <span class="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">5</span>
                约束与排除
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-neutral mb-1">排除元素</label>
                  <input 
                    v-model="editingTemplate.structured.constraints.exclusions"
                    type="text" 
                    placeholder="例如：排除任何水渍或灰尘、无水印" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-neutral mb-1">负面提示</label>
                  <input 
                    v-model="editingTemplate.structured.constraints.negativePrompts"
                    type="text" 
                    placeholder="例如：无鬼影、无剧烈晃动、画面稳定" 
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg input-focus transition"
                  />
                </div>
              </div>
            </div>
          </div>
          </template>
          </div>
        </div>
        
        <!-- 固定的底部按钮 -->
        <div class="px-6 py-4 border-t border-gray-100">
          <div class="flex space-x-3">
            <button 
              type="button"
              class="flex-1 py-2 border border-gray-200 rounded-lg text-neutral hover:bg-gray-50 transition-colors"
              @click="closeEditTemplateModal"
            >
              取消
            </button>
            <button 
              type="button"
              class="flex-1 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              @click="saveEditedTemplate"
            >
              保存修改
            </button>
          </div>
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
import { optimizePromptWithGemini, GeminiError } from '../services/gemini'
import { saveTemplates, loadTemplates, exportAllData, importData, saveAIConfig as saveAIConfigToStorage, loadAIConfig as loadAIConfigFromStorage, type ImportResult } from '../services/storage'

const message = useMessage()

// 输入模式
const inputMode = ref<InputMode>('structured')

// 结构化输入数据
const structuredInput = ref<StructuredInput>({
  name: '',
  features: '',
  audience: '',
  scene: '',
  extra: '',
  customFields: [] // Initialize with empty array
})

// 原始提示词文本
const rawText = ref('')

// 模板列表 - 面向 Sora 2 视频生成的电商场景
const templates = ref<Template[]>([
  { 
    id: '1', 
    name: '📦 第一人称开箱体验', 
    format: '', 
    selected: false,
    isDefault: true,  // 标记为默认模板
    structured: {
      plotAction: {
        sequence: 'Opening package → Revealing product → First touch → Exploring features → Expressing delight',
        subjectMotion: 'Hands carefully opening packaging, lifting product out, rotating to examine',
        interaction: 'Natural hands-on interaction, tactile exploration, authentic reactions'
      },
      cinematography: {
        shotSize: 'First-person POV, close-up on hands and product, medium shots for context',
        cameraAngle: 'POV angle looking down at unboxing surface, slightly tilted for natural perspective',
        cameraMovement: 'Handheld feel with subtle camera shake for authenticity, smooth tracking of hand movements'
      },
      visualStyle: {
        styleType: 'Authentic lifestyle aesthetic with cinematic quality',
        lightingColor: 'Warm natural lighting creating inviting atmosphere, soft shadows',
        renderQuality: '4K resolution with realistic textures, natural color grading, slight film grain for authenticity'
      },
      emotionMood: {
        moodTone: 'Excitement and discovery, genuine enthusiasm, relatable joy',
        targetAudience: 'Real consumers experiencing the unboxing moment'
      },
      constraints: {
        exclusions: 'No overly staged setup, no artificial perfection, no watermarks',
        negativePrompts: 'No robotic movements, no sterile environment, stable framing with natural motion'
      }
    }
  }
])

// 生成结果
const results = ref<GeneratedResult[]>([])
const generating = ref(false)

// 已选择的模板数量
const selectedTemplatesCount = computed(() => {
  return templates.value.filter(t => t.selected).length
})

// 模态框状态
const showTemplateModal = ref(false)
const modalAnimating = ref(false)
const templateMode = ref<'simple' | 'professional'>('professional')
const newTemplate = ref({
  name: '',
  format: '',
  structured: {
    plotAction: {
      sequence: '',
      subjectMotion: '',
      interaction: ''
    },
    cinematography: {
      shotSize: '',
      cameraAngle: '',
      cameraMovement: ''
    },
    visualStyle: {
      styleType: '',
      lightingColor: '',
      renderQuality: ''
    },
    emotionMood: {
      moodTone: '',
      targetAudience: ''
    },
    constraints: {
      exclusions: '',
      negativePrompts: ''
    }
  }
})

// 编辑模板模态框状态
const showEditTemplateModal = ref(false)
const editModalAnimating = ref(false)
const editingTemplate = ref<Template | null>(null)

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

// 导入文件输入引用
const importFileInput = ref<HTMLInputElement | null>(null)

// 根据结构化模板构建专业提示词
const buildStructuredPrompt = (template: Template): string => {
  if (!template.structured) return ''
  
  const parts: string[] = []
  const s = template.structured
  const input = structuredInput.value
  
  // 首先添加用户输入的基础信息
  const baseParts: string[] = []
  if (input.name) baseParts.push(input.name)
  if (input.features) baseParts.push(`featuring ${input.features}`)
  if (input.scene) baseParts.push(`in ${input.scene}`)
  if (input.audience) baseParts.push(`for ${input.audience}`)
  
  if (baseParts.length > 0) {
    parts.push(baseParts.join(', '))
  }
  
  // 1. 情节与动作
  if (s.plotAction.sequence) parts.push(s.plotAction.sequence)
  if (s.plotAction.subjectMotion) parts.push(s.plotAction.subjectMotion)
  if (s.plotAction.interaction) parts.push(s.plotAction.interaction)
  
  // 2. 摄影与运镜
  if (s.cinematography.shotSize) parts.push(s.cinematography.shotSize)
  if (s.cinematography.cameraAngle) parts.push(s.cinematography.cameraAngle)
  if (s.cinematography.cameraMovement) parts.push(s.cinematography.cameraMovement)
  
  // 3. 视觉风格与美学
  if (s.visualStyle.styleType) parts.push(s.visualStyle.styleType)
  if (s.visualStyle.lightingColor) parts.push(s.visualStyle.lightingColor)
  if (s.visualStyle.renderQuality) parts.push(s.visualStyle.renderQuality)
  
  // 4. 情绪与氛围
  if (s.emotionMood.moodTone) parts.push(s.emotionMood.moodTone)
  if (s.emotionMood.targetAudience) {
    const audience = s.emotionMood.targetAudience.replace(/\{\{适用人群\}\}/g, input.audience || 'audience')
    parts.push(`targeting ${audience}`)
  }
  
  // 5. 约束与排除
  const constraints: string[] = []
  if (s.constraints.exclusions) constraints.push(s.constraints.exclusions)
  if (s.constraints.negativePrompts) constraints.push(s.constraints.negativePrompts)
  
  // 添加额外要求
  if (input.extra) parts.push(input.extra)
  
  let prompt = parts.join('. ').replace(/\.\s*\./g, '.')
  
  // 如果有约束，添加到末尾
  if (constraints.length > 0) {
    prompt += '. ' + constraints.join(', ')
  }
  
  return prompt
}

const buildFallbackContent = (template: Template): string => {
  if (inputMode.value === 'structured') {
    // 如果模板有结构化定义，使用专业模式构建
    if (template.structured) {
      return buildStructuredPrompt(template)
    }
    
    // 否则使用简单的字符串替换
    let content = template.format
      .replace(/\{\{名称\}\}/g, structuredInput.value.name || '产品')
      .replace(/\{\{核心卖点\}\}/g, structuredInput.value.features || '核心特点')
      .replace(/\{\{适用人群\}\}/g, structuredInput.value.audience || '用户')
      .replace(/\{\{目标场景\}\}/g, structuredInput.value.scene || '使用场景')

    if (structuredInput.value.extra) {
      content += `. ${structuredInput.value.extra}`
    }

    return content
  }

  const preview = rawText.value.substring(0, 30)
  const rawPreview = preview + (rawText.value.length > 30 ? '...' : '')
  return `根据"${template.name}"模板优化：基于"${rawPreview}"扩展细节，增强场景感和表现力，符合模板风格特点。原始内容：${rawText.value}`
}

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
const generatePrompts = async () => {
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
  generating.value = true
  
  try {
    for (let index = 0; index < selectedTemplates.length; index++) {
      const template = selectedTemplates[index]
      let content = ''
      
      try {
        // 使用 Gemini 优化提示词
        content = await optimizePromptWithGemini({
          template,
          inputMode: inputMode.value,
          structuredInput: structuredInput.value,
          rawText: rawText.value
        })
      } catch (error) {
        // Gemini 失败时使用降级逻辑
        console.warn(`Gemini 生成失败 (模板 ${template.name}):`, error)
        
        if (error instanceof GeminiError) {
          message.warning(`模板"${template.name}"使用 AI 生成失败，使用基础模板: ${error.message}`)
        } else {
          message.warning(`模板"${template.name}"使用 AI 生成失败，使用基础模板`)
        }
        
        content = buildFallbackContent(template)
      }
      
      results.value.push({
        id: `result-${Date.now()}-${index}`,
        templateName: template.name,
        content,
        templateIndex: index + 1
      })
    }
    
    message.success(`成功生成 ${results.value.length} 个提示词`)
  } catch (error) {
    console.error('生成提示词时发生错误:', error)
    message.error('生成提示词失败，请稍后重试')
  } finally {
    generating.value = false
  }
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

// 重置新模板数据
const resetNewTemplate = () => {
  newTemplate.value = {
    name: '',
    format: '',
    structured: {
      plotAction: {
        sequence: '',
        subjectMotion: '',
        interaction: ''
      },
      cinematography: {
        shotSize: '',
        cameraAngle: '',
        cameraMovement: ''
      },
      visualStyle: {
        styleType: '',
        lightingColor: '',
        renderQuality: ''
      },
      emotionMood: {
        moodTone: '',
        targetAudience: ''
      },
      constraints: {
        exclusions: '',
        negativePrompts: ''
      }
    }
  }
}

// 关闭模板模态框
const closeTemplateModal = () => {
  modalAnimating.value = false
  setTimeout(() => {
    showTemplateModal.value = false
    resetNewTemplate()
  }, 300)
}

// 保存新模板
const saveNewTemplate = () => {
  if (!newTemplate.value.name.trim()) {
    message.warning('请填写模板名称')
    return
  }
  
  // 简单模式：需要format字段
  if (templateMode.value === 'simple' && !newTemplate.value.format.trim()) {
    message.warning('请填写模板格式')
    return
  }
  
  // 专业模式：检查是否至少填写了一个字段
  if (templateMode.value === 'professional') {
    const structured = newTemplate.value.structured
    const hasAnyField = 
      structured.plotAction.sequence ||
      structured.plotAction.subjectMotion ||
      structured.plotAction.interaction ||
      structured.cinematography.shotSize ||
      structured.cinematography.cameraAngle ||
      structured.cinematography.cameraMovement ||
      structured.visualStyle.styleType ||
      structured.visualStyle.lightingColor ||
      structured.visualStyle.renderQuality ||
      structured.emotionMood.moodTone ||
      structured.emotionMood.targetAudience ||
      structured.constraints.exclusions ||
      structured.constraints.negativePrompts
    
    if (!hasAnyField) {
      message.warning('请至少填写一个专业维度字段')
      return
    }
  }
  
  const newTemplateData: Template = {
    id: `template-${Date.now()}`,
    name: newTemplate.value.name,
    format: newTemplate.value.format,
    selected: false
  }
  
  // 如果是专业模式，保存结构化数据
  if (templateMode.value === 'professional') {
    newTemplateData.structured = { ...newTemplate.value.structured }
  }
  
  templates.value.push(newTemplateData)
  
  // 持久化保存模板
  saveTemplates(templates.value)
  
  message.success('模板保存成功！')
  closeTemplateModal()
}

// 打开编辑模板
const openEditTemplate = (template: Template) => {
  // 深拷贝模板数据，避免直接修改原始数据
  editingTemplate.value = JSON.parse(JSON.stringify(template))
  showEditTemplateModal.value = true
  setTimeout(() => {
    editModalAnimating.value = true
  }, 50)
}

// 关闭编辑模板模态框
const closeEditTemplateModal = () => {
  editModalAnimating.value = false
  setTimeout(() => {
    showEditTemplateModal.value = false
    editingTemplate.value = null
  }, 300)
}

// 保存编辑后的模板
const saveEditedTemplate = () => {
  if (!editingTemplate.value) return
  
  if (!editingTemplate.value.name.trim()) {
    message.warning('请填写模板名称')
    return
  }
  
  // 简单模式：需要format字段
  if (!editingTemplate.value.structured && !editingTemplate.value.format.trim()) {
    message.warning('请填写模板格式')
    return
  }
  
  // 专业模式：检查是否至少填写了一个字段
  if (editingTemplate.value.structured) {
    const structured = editingTemplate.value.structured
    const hasAnyField = 
      structured.plotAction.sequence ||
      structured.plotAction.subjectMotion ||
      structured.plotAction.interaction ||
      structured.cinematography.shotSize ||
      structured.cinematography.cameraAngle ||
      structured.cinematography.cameraMovement ||
      structured.visualStyle.styleType ||
      structured.visualStyle.lightingColor ||
      structured.visualStyle.renderQuality ||
      structured.emotionMood.moodTone ||
      structured.emotionMood.targetAudience ||
      structured.constraints.exclusions ||
      structured.constraints.negativePrompts
    
    if (!hasAnyField) {
      message.warning('请至少填写一个专业维度字段')
      return
    }
  }
  
  // 找到并更新原始模板
  const index = templates.value.findIndex(t => t.id === editingTemplate.value!.id)
  if (index !== -1) {
    templates.value[index] = { ...editingTemplate.value }
    
    // 持久化保存模板
    saveTemplates(templates.value)
    
    message.success('模板更新成功！')
    closeEditTemplateModal()
  } else {
    message.error('找不到要更新的模板')
  }
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
  
  try {
    // 使用统一的存储函数保存AI配置
    saveAIConfigToStorage(aiConfig.value)
    message.success('AI配置保存成功！')
    closeAIConfigModal()
  } catch (error) {
    console.error('保存AI配置失败:', error)
    message.error('保存AI配置失败')
  }
}

// 显示帮助
const showHelp = () => {
  message.info('欢迎使用 Sora 2 视频提示词生成器！填写产品信息，选择视频场景模板，AI 将自动生成适合 Sora 2 的专业英文提示词。')
}

// 导出数据
const exportData = () => {
  try {
    const jsonData = exportAllData()
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-master-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('数据导出成功！')
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出数据失败')
  }
}

// 触发导入文件选择
const triggerImport = () => {
  importFileInput.value?.click()
}

// 处理导入
const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  try {
    const text = await file.text()
    
    // 解析数据预览
    let previewData: any
    try {
      previewData = JSON.parse(text)
    } catch {
      message.error('文件格式错误，请选择有效的 JSON 备份文件')
      input.value = ''
      return
    }
    
    // 显示导入预览和选项
    const templateCount = previewData.templates?.length || 0
    const hasAIConfig = !!previewData.aiConfig
    const hasAppConfig = !!previewData.appConfig
    
    const previewParts = []
    if (templateCount > 0) previewParts.push(`${templateCount} 个模板`)
    if (hasAIConfig) previewParts.push('AI配置')
    if (hasAppConfig) previewParts.push('应用配置')
    
    const previewText = previewParts.length > 0 
      ? `将导入：${previewParts.join('、')}` 
      : '文件中没有可导入的数据'
    
    // 确认导入操作
    const confirmMessage = `${previewText}\n\n模板将以追加方式导入，配置将覆盖现有配置。\n是否继续？`
    if (!confirm(confirmMessage)) {
      input.value = ''
      return
    }
    
    // 执行导入（合并模式）
    const result: ImportResult = importData(text, true)
    
    if (result.success) {
      // 重新加载模板
      const userTemplates = loadTemplates()
      // 清空当前非默认模板
      templates.value = templates.value.filter(t => t.isDefault)
      // 添加所有用户模板（包括新导入的）
      templates.value.push(...userTemplates)
      
      // 重新加载AI配置
      const importedAIConfig = loadAIConfigFromStorage()
      if (importedAIConfig) {
        aiConfig.value = importedAIConfig
      }
      
      // 生成详细的导入反馈
      const details: string[] = []
      if (result.imported.templates > 0) {
        details.push(`${result.imported.templates} 个新模板`)
      }
      if (result.imported.templatesSkipped > 0) {
        details.push(`${result.imported.templatesSkipped} 个重复模板已跳过`)
      }
      if (result.imported.aiConfig) {
        details.push('AI配置已更新')
      }
      if (result.imported.appConfig) {
        details.push('应用配置已更新')
      }
      
      const summary = details.length > 0 
        ? `导入成功：${details.join('、')}` 
        : '数据导入成功（无新数据）'
      
      message.success(summary, { duration: 5000 })
    } else {
      message.error(`导入失败：${result.error || '数据格式错误'}`)
    }
  } catch (error) {
    console.error('导入失败:', error)
    message.error('导入数据失败，请检查文件格式')
  } finally {
    // 清空文件输入
    input.value = ''
  }
}

// 监听模态框显示状态，添加动画
watch(showTemplateModal, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      modalAnimating.value = true
    }, 50)
  }
})

// 监听编辑模板模态框显示状态，添加动画
watch(showEditTemplateModal, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      editModalAnimating.value = true
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

// 删除模板
const deleteTemplate = (template: Template) => {
  if (template.isDefault) {
    message.warning('默认模板不能删除')
    return
  }
  
  if (!confirm(`确定要删除模板"${template.name}"吗？`)) {
    return
  }
  
  const index = templates.value.findIndex(t => t.id === template.id)
  if (index !== -1) {
    templates.value.splice(index, 1)
    // 持久化保存
    saveTemplates(templates.value)
    message.success('模板已删除')
  }
}

// 加载配置
onMounted(() => {
  // 加载用户创建的模板
  try {
    const userTemplates = loadTemplates()
    if (userTemplates.length > 0) {
      // 将用户模板添加到默认模板后面
      templates.value.push(...userTemplates)
      message.success(`已加载 ${userTemplates.length} 个自定义模板`)
    }
  } catch (err) {
    console.error('加载用户模板失败:', err)
  }
  
  // 加载AI配置（使用统一的存储函数）
  try {
    const savedAIConfig = loadAIConfigFromStorage()
    if (savedAIConfig) {
      aiConfig.value = savedAIConfig
    }
  } catch (err) {
    console.error('加载AI配置失败:', err)
  }
})
</script>
