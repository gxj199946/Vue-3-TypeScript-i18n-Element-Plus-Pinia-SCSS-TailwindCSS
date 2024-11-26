<template>
  <div
    :class="{ dark: isDark }"
    class="app-container bg-[#f6f9ff] dark:bg-gray-900 transition-colors duration-200 ease-in-out"
  >
    <Headerview  id="header" />
    <div class="content-wrapper">
      <main id="main" class="main-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        <LoginModal ref="loginModalRef" @login-success="handleLoginSuccess" />

      </main>

      <Footerview id="footer" class="footer" />
    </div>
    <!-- 返回顶部按钮 -->
      <el-backtop  :right="40" :bottom="200"  />

  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, watch,ref } from "vue";
import Headerview from "@/components/Header.vue"
import Footerview from "@/components/Footer.vue"
import { useThemeStore } from "@/stores/themeStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/stores/languageStore";
import { useRoute,useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth'
import LoginModal from '@/components/login/LoginModal.vue'

const { t, locale } = useI18n();
const languageStore = useLanguageStore();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
const route = useRoute();
const router=useRouter()
const authStore = useAuthStore()
const loginModalRef = ref()
// 处理登录成功
const handleLoginSuccess = () => {
  authStore.setShowLoginModal(false)
  // 清除 URL 中的 authMode 参数
  if (router.currentRoute.value.query.authMode) {
    const query = { ...router.currentRoute.value.query }
    delete query.authMode
    router.replace({ 
      path: router.currentRoute.value.path, 
      query 
    })
  }
}

const auth = localStorage.getItem('auth'); // 从 localStorage 获取 token

// 在组件挂载时初始化语言
onMounted(() => {
  languageStore.initLanguage();
});

//更新title
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



.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 2vh;
  
}

#header{
  // height: 16vh;
}

.dark {
  @apply bg-gray-900 text-white;
}

h1 {
  color: variables.$primary-color;
}
</style>
