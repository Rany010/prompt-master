import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Naive UI
import naive from 'naive-ui'

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/Home.vue')
    }
  ]
})

const app = createApp(App)
app.use(router)
app.use(naive)
app.mount('#app')