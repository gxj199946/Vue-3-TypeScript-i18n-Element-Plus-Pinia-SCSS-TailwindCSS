<template>
  <div
    :class="{ dark: isDark }"
    class="app-container bg-[#f6f9ff] dark:bg-gray-900 transition-colors duration-200 ease-in-out"
  >
    <Headerview v-if="token" id="header" class="header" />
    <div class="content-wrapper">
      <main id="main" class="main-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        
      </main>

      <Footerview id="footer" class="footer" />
    </div>
    <!-- 返回顶部按钮 -->
      <el-backtop  :right="40" :bottom="200"  />

  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import Headerview from "@/components/Header.vue"
import Footerview from "@/components/Footer.vue"
import { useThemeStore } from "@/stores/themeStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/stores/languageStore";
import { useRoute } from "vue-router";

const { t, locale } = useI18n();
const languageStore = useLanguageStore();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
const route = useRoute();
const token = localStorage.getItem('token'); // 从 localStorage 获取 token

// 在组件挂载时初始化语言
onMounted(() => {
  languageStore.initLanguage();
});

const updateTitle = (title: string, website_title: string) => {
  document.title = `${website_title} | ${title}`;
};

const website_title = computed(() => t("title"));
const pageTitle = computed(() => {
  if (route.meta.titleKey) {
    return t(route.meta.titleKey as string);
  }
  return "默认标题";
});

// 监听路由变化
watch(
  () => route.meta.titleKey,
  () => {
    updateTitle(pageTitle.value, website_title.value);
  },
  { immediate: true }
);

// 监听语言变化
watch(
  locale,
  () => {
    updateTitle(pageTitle.value, website_title.value);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 8vh; // 与 Header.vue 中的高度一致
}

.content-wrapper {
  padding-top: 8vh; // 为固定定位的 header 腾出空间
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 2vh;
  
}

.footer {
  // 如果需要，在这里添加 footer 的样式
}

.dark {
  @apply bg-gray-900 text-white;
}

h1 {
  color: variables.$primary-color;
}
</style>
