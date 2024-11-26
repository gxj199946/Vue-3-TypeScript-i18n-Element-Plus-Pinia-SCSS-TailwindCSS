import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({ 
    showLoginModal: false,
    isAuthenticating: false
  }),
  actions: {
    setShowLoginModal(show: boolean) {
      this.showLoginModal = show
      if (!show) {
        this.isAuthenticating = false
      }
    },
    startAuth() {
      this.isAuthenticating = true
      this.showLoginModal = true
    }
  }
})