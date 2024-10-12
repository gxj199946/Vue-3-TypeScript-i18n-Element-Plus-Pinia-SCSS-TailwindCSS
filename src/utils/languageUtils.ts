import i18n  from '@/i18n'
import type { Language } from 'element-plus/es/locale'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export function switchLanguage(lang: 'zh-CN' | 'en-US') {
  i18n.global.locale.value = lang
  localStorage.setItem('language', lang)

  // 如果使用了 Element Plus 并配置了国际化
  let elementLang: Language
  if (lang === 'zh-CN') {
    elementLang = zhCn
  } else {
    elementLang = en
  }
  // 假设您已经将 Element Plus 实例存储在某个地方
  // 例如：app.config.globalProperties.$ELEMENT
  // @ts-ignore
  window.$ELEMENT.locale(elementLang)
}

export function initLanguage() {
    const savedLang = localStorage.getItem('language') as 'zh-CN' | 'en-US' | null
    if (savedLang) {
      switchLanguage(savedLang)
    }
  }