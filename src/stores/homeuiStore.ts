import { defineStore } from 'pinia'

export const useHomeUiStore = defineStore('homeui', {
  state: () => ({ 
    page:"UserHome"
  }),
  actions: {
    PageUiAction(Page:any) {
            this.page = Page 
            console.log(this.page);
            
      }
  },
  persist: {
    paths:['page']
  }
})