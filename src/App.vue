<template>

    <div
      :class="{ dark: isDark }"
      class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 ease-in-out"
    >
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ title }}
        </h1>
        <!-- 语言切换组件 -->
      <LanguageSwitch />
        <!-- 主题切换组件 -->
        <ThemeToggle class="mt-4" />
        <router-view></router-view>

        <div>
          <el-button type="primary" @click="increment"
      >Count is: {{ count }}</el-button
    >
    <div class="container mx-auto p-4">
      <h1>{{ $t("hello") }}</h1>
      <p>{{ $t("welcome") }}</p>
      
    </div>
        </div>
      </div>
    </div>
  
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useCounterStore } from "./stores/counter";
import ThemeToggle from "@/components/ThemeToggle.vue";
import LanguageSwitch from '@/components/LanguageSwitch.vue'
import { useThemeStore } from "@/stores/themeStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/stores/languageStore";
const { t,locale} = useI18n();
const languageStore = useLanguageStore();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
import { useRoute } from 'vue-router'
const route = useRoute()

// 在组件挂载时初始化语言
onMounted(() => {
  languageStore.initLanguage();
});
const title = ref("Vue 3 + TS + Element Plus + Pinia + SCSS + Tailwind CSS");
const store = useCounterStore();

const count = computed(() => store.count);
const increment = () => store.increment();
const updateTitle = (title: string) => {
  document.title = `Vite + Vue + TS | ${title}`
}

const pageTitle = computed(() => {
  if (route.meta.titleKey) {
    return t(route.meta.titleKey as string)
  }
  return '默认标题'
})
// 监听路由变化
watch(() => route.meta.titleKey, () => {
  updateTitle(pageTitle.value)
}, { immediate: true })
// 监听语言变化
watch(locale, () => {
  updateTitle(pageTitle.value)
}, { immediate: true })
</script>

<style scoped lang="scss">
h1 {
  color: $primary-color;
}

</style>
