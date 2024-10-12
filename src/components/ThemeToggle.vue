<template>
    <button @click="toggleTheme" class="px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
      bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
      {{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}
    </button>
  </template>
  
  <script setup lang="ts">
  import { useThemeStore } from '@/stores/themeStore'
  import { storeToRefs } from 'pinia'
  
  const themeStore = useThemeStore()
  const { isDark } = storeToRefs(themeStore)
  
  const toggleTheme = () => {
    themeStore.toggleTheme()
  }
  </script>