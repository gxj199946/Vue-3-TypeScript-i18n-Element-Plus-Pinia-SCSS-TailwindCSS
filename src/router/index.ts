import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import i18n from '@/i18n' // 导入你的 i18n 实例

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { titleKey: 'route.home.title' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { titleKey: 'route.about.title' }
  }
  // 可以添加更多路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加全局前置守卫来设置动态标题
router.beforeEach((to, from, next) => {
    if (to.meta.titleKey) {
      const title = i18n.global.t(to.meta.titleKey as string)
      document.title = `Vite + Vue + TS | ${title}`
    }
    next()
  })

export default router