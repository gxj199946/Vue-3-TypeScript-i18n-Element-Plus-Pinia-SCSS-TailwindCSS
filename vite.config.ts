import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), //路径别名
    },
    extensions: ['.ts', '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  build: {
    // 添加这个配置
    rollupOptions: {
      external: ['vue']
    }
  },
  optimizeDeps: {
    include: ['vue']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
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