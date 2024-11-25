import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), //路径别名
    }
  },
  server:{
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端 API 地址
        changeOrigin: true, // 是否改变请求头中的 origin
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  },
  build: {
    // 添加这个配置
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html') //指定 Rollup 的入口点。这里设置为项目根目录下的 index.html 文件

    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as variables;`, //全局导入
        importer(url: string): { file: string } | null {
          if (url[0] !== '@') {
            return null;
          }
          return {
            file: `${path.resolve(__dirname, './src')}${url.slice(1)}`
          }
        }
      }
    }
  }
  // ... 其他配置
})