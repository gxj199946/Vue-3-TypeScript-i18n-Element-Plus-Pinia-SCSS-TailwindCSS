import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    showLoginModal: false,
    isAuthenticating: false,
    publicKey: "",
    token: ""
  }),
  persist: {
    paths:['publicKey','token','showLoginModal']
  },
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
    },
    publicKeyAuth(publicKey: string) {
      this.publicKey = publicKey
    },
    TokenAuth(token: string) {
      this.token = token
    }
  }
})