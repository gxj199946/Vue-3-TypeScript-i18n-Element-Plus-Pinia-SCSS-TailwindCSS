import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import 'element-plus/dist/index.css'
import i18n from './i18n'
import { initLanguage } from './utils/languageUtils'
import { useThemeStore } from './stores/themeStore'
import { lightenColor, darkenColor } from './utils/colorUtils'
import './styles/themes.css'
import './index.css'

initLanguage()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

const themeStore = useThemeStore()

app.use(ElementPlus,{
    locale: i18n.global.locale.value === 'zh-CN' ? zhCn : en,

})
app.use(i18n)
app.use(router)
app.provide('themeStore', themeStore)
app.provide('lightenColor', lightenColor)
app.provide('darkenColor', darkenColor)

app.mount('#app')