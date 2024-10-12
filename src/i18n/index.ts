import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

const i18n = createI18n({
  legacy: false, // 使用Composition API模式
  locale: 'zh-CN', // 设置默认语言
  fallbackLocale: 'en-US', // 设置备用语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export default i18n