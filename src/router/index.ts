import { createRouter, createWebHistory, RouteRecordRaw, useRouter } from 'vue-router'
import i18n from '@/i18n' // 导入你的 i18n 实例
import { useAuthStore } from '@/stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { titleKey: 'route.home.title', }
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
// router.beforeEach((to, from, next) => {
  
//   if (to.meta.titleKey) {
//     const title = i18n.global.t(to.meta.titleKey as string)
//     document.title = `Vite + Vue + TS | ${title}`
//   }

//   // 检查是否需要身份验证
//   if (to.meta.requiresAuth) {
//     const token = localStorage.getItem('token'); // 从 localStorage 获取 token
//     if (!token) {
//       next('/login'); // 如果没有 token，重定向到登录页面
//     } else {
//       next(); // 如果有 token，继续导航
//     }
//   } else {
//     next(); // 如果不需要身份验证，继续导航
//   }
// })


// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
    if (to.meta.titleKey) {
    const title = i18n.global.t(to.meta.titleKey as string)
    document.title = `Vite + Vue + TS | ${title}`
  }
  
  if (to.meta.requiresAuth) {
    const auth = JSON.parse(localStorage.getItem('auth')!);
    console.log(auth);
    
    if (!auth?.token) {      
      // 先添加查询参数
      router.replace({ 
        path: from.path,
        query: { ...from.query, authMode: 'login' }
      })
      // 然后显示登录框
      authStore.startAuth()
      // 阻止导航
      next(false)
      return
    }
    console.log('已登录',auth?.token);
    
  }
  next()

  // if (to.meta.requiresAuth) {
  //   const token = localStorage.getItem('token')
  //   if (!token && !authStore.isAuthenticating) {
  //     authStore.startAuth()
  //     next({
  //       path: to.path,
  //       query: { ...to.query, authMode: 'login' }
  //     })
  //     return
  //   }
  // }
  // next()
})

export default router