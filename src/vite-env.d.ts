/// <reference types="vite/client" />

//帮助 TypeScript 理解 .vue 文件的类型
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }