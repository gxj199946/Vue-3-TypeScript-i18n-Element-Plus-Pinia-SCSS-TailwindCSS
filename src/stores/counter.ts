import { defineStore } from 'pinia'
import i18n from '@/i18n'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
    someAction() {
        console.log(i18n.global.t('hello'))
      }
  },
})