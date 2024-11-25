import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import i18n from '@/i18n' // 导入你的 i18n 实例

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { titleKey: 'route.home.title',requiresAuth: true }
  },
  {
    path: '/cource',
    name: 'Cource',
    component: () => import('@/views/Course.vue'),
    meta: { titleKey: 'route.cource.title',requiresAuth: true }
  },
  {
    path:'/components',
    name:'Components',
    component:()=>import('@/views/Components.vue'),
    meta: { titleKey: 'route.components.title',requiresAuth: true }

  },
  {
    path: "/help-center",
    name: "Help-center",
    component: () => import('@/views/Help-center.vue'),
    meta: { titleKey: 'route.help-center.title' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { titleKey: 'route.login.title' }
  }
  // 可以添加更多路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// 定义不需要验证的路由路径
const publicPaths: string[] = ['/login', '/register'];

// 添加全局前置守卫来设置动态标题
router.beforeEach((to, from, next) => {
  if (to.meta.titleKey) {
    const title = i18n.global.t(to.meta.titleKey as string)
    document.title = `Vite + Vue + TS | ${title}`
  }

  // 检查是否需要身份验证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token'); // 从 localStorage 获取 token
    if (!token) {
      next('/login'); // 如果没有 token，重定向到登录页面
    } else {
      next(); // 如果有 token，继续导航
    }
  } else {
    next(); // 如果不需要身份验证，继续导航
  }
})

export default router