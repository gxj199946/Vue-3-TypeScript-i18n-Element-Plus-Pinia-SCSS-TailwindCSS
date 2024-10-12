import { defineStore } from 'pinia'
import i18n  from '@/i18n'
import type { Language } from 'element-plus/es/locale'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLang: 'zh-CN' as 'zh-CN' | 'en-US'
  }),
  actions: {
    switchLanguage(lang: 'zh-CN' | 'en-US') {
      this.currentLang = lang
      i18n.global.locale.value = lang

      // 如果使用了 Element Plus 并配置了国际化
      let elementLang: Language = lang === 'zh-CN' ? zhCn : en
      // 更新 Element Plus 的语言设置
      if (window.$ELEMENT) {
        window.$ELEMENT.locale(elementLang)
      }
    },
    initLanguage() {
      const savedLang = this.currentLang
      if (savedLang) {
        this.switchLanguage(savedLang)
      }
    }
  },
  persist: {
    key: 'language-store',
    storage: localStorage,
  }
})