<template>
  <n-config-provider>
    <n-message-provider>
      <div class="w-[400px] h-[600px] p-4 bg-gray-50">
        <n-card title="Prompt Master" class="h-full">
          <template #header-extra>
            <n-button quaternary circle size="small">
              <n-icon><settings-outline /></n-icon>
            </n-button>
          </template>
          <n-space vertical size="large">
            <div class="text-gray-600">
              <div class="text-base font-medium">Welcome to Prompt Master Extension</div>
              <div class="text-sm mt-1 text-gray-400">Your AI assistant for prompt management</div>
            </div>
            <div class="flex space-x-2">
              <n-input type="text" placeholder="Enter your prompt..." round class="flex-1" />
              <n-button type="primary" round>
                Send
              </n-button>
            </div>
            <n-divider />
            <div class="flex-1 overflow-auto">
              <div class="text-center text-gray-400 pt-8">
                No prompts yet
              </div>
            </div>
          </n-space>
        </n-card>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NCard, NButton, NInput, NSpace, NDivider, NIcon } from 'naive-ui'
import { SettingsOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

const message = useMessage()
</script>

<style>
body {
  margin: 0;
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>