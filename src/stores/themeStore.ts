import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
    },
    applyTheme() {
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    initTheme() {
      const isDark = localStorage.getItem('theme') === 'dark'
      this.isDark = isDark
      this.applyTheme()
    }
  }
})