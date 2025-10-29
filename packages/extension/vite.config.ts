import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest })
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui-core': ['naive-ui/es/config-provider', 'naive-ui/es/message-provider', 'naive-ui/es/button', 'naive-ui/es/input', 'naive-ui/es/card', 'naive-ui/es/space', 'naive-ui/es/divider'],
          'naive-ui-icons': ['@vicons/ionicons5'],
          'vue': ['vue']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})