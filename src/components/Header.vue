<template>

  <div class="header_box bg-white dark:bg-gray-900" :class="{ 'fixed-header': isFixed, 'nav-hidden': hideNav }">
    <div class="nav_box" :class="{ 'nav-hidden': hideNav }">
      <NavView/> 
    </div>
    <div class="header">
      <!-- flex: 4 -->
      <router-link
      to="/"
      style="flex: 6; padding-left: 4vw"
      class="flex content-center items-center pointer"
    >
      <img
        v-if="isDark"
        style="width: 8.2vw; height: 3.2vw"
        src="#"
        alt=""
      />
      <img v-else style="width: 8.2vw; height: 3.2vw" src="#" alt="" />

      <span class="Title font-sans dark:text-white">
        {{ $t("title") }}
      </span>
    </router-link>
    <div style="flex: 1">
      <Aibutton
        :locale="currentLang"
        :endpoint="endpoint"
        :predefinedQuestions="predefinedQuestions"
      />
    </div>
    <!-- flex: 4; justify-end-->
    <div style="flex: 4" class="nav flex items-center text-2xl">
      <nav
        v-for="(i, v) in routes"
        :key="v"
        style="margin-left: 1vw"
        class="nav_title"
      >
        <router-link
          :to="i.path"
          class="nav_title"
          :class="{ active_nav_title: isRouteActive(i.path) }"
        >
          {{ $t(i?.meta?.titleKey) }}
        </router-link>
      </nav>
    </div>
    <div style="flex: 2" class="flex justify-end items-center pr-4">
      <!-- 语言切换组件 -->
      <LanguageSwitch />
      <!-- 主题切换组件 -->
      <!-- <ThemeToggle/> -->
      <div
      v-if="token"
        @click="Login_out"
        style="
          cursor: pointer;
          margin-left: 2vw;
          display: flex;
          align-items: center;
        "
      >
        <span>
          <svg
            t="1730772946685"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8482"
            width="30"
            height="30"
          >
            <path
              d="M573.2 646.5H309.8c-12.6 0-20.8-5.8-22.9-16.1-0.4-2.1-0.4-4.2-0.4-6.4V397.2c0-14.3 7.8-22 22.3-22H573.1v-6.9-201.8c0-9.3 4.4-16.6 11.9-19.5 8.6-3.3 16.2-1.8 22.7 5.1 3.7 3.9 7.8 7.5 11.6 11.4 48.2 48.1 96.3 96.2 144.5 144.2 61.9 61.7 123.7 123.4 185.6 185.2 10.3 10.3 10.4 21.1 0.2 31.2-88.5 88.4-177 176.8-265.6 265.1-25.2 25.1-50.5 50.1-75.7 75.2-6.5 6.5-13.7 9.3-22.5 6-8.6-3.3-12.6-10-12.6-20.7V646.5z m-159-497.3v76.4H212.9c-41 0-71.3 30.3-71.3 71.4 0 142.3 0.3 284.6-0.2 426.9-0.1 37.7 28.5 64.8 55 69.7 5.9 1.1 11.9 1.6 17.9 1.6 64.2 0.1 128.4 0.1 192.6 0.1h7.2v76c-0.9 0.2-2 0.6-3 0.6-68.2 0-136.5 0.7-204.7-0.3-66.7-1-125.7-51.6-138.5-117.1-1.8-9.2-2.7-18.8-2.7-28.2-0.2-143.8-0.5-287.7 0.1-431.5 0.3-60.1 30.1-103.2 82.2-131.2 18.4-9.9 38.7-14.4 59.6-14.4 67.7-0.2 135.3-0.1 203-0.1 1.1 0 2.3 0.1 4.1 0.1z m0 0"
              p-id="8483"
            ></path>
            </svg>
          </span>
        <span>{{ $t("LoginOut") }}</span>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
// import ThemeToggle from "@/components/ThemeToggle.vue";
import LanguageSwitch  from "@/components/LanguageSwitch.vue";
import Aibutton from "@/components/AI/Button.vue";
import Prompt_word from "@/utils/Promptword";
import Logo from "@/assets/xxx.png";
import Logo_dark from "@/assets/xxx.png";
import { ElNotification } from "element-plus";
import NavView from "@/components/Nav.vue"
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores/themeStore";
import { useLanguageStore } from "@/stores/languageStore";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed, ref, watch, onMounted, onUnmounted } from "vue";

const { t} = useI18n();
const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();
const languageStore = useLanguageStore();
const { isDark } = storeToRefs(themeStore);
const { currentLang } = storeToRefs(languageStore);
const token = localStorage.getItem('token'); // 从 localStorage 获取 token
// 获取路由数组,截取前3个作为导航路由
const routes = computed(() => router.options.routes.slice(0, 3));

// 检查路由是否激活
const isRouteActive = (path: string) => {
  return route.path === path;
};

//AI的api
const endpoint = computed(() => {
  return import.meta.env.VITE_ASK_BASEURL;
});

//AI提示词
const predefinedQuestions = ref([""]);

// 更新提示词的函数
const updatePredefinedQuestions = () => {
  if (currentLang.value === "zh-CN") {
    //生成随机3个问题
    let selected = Prompt_word.zh.sort(() => 0.5 - Math.random()).slice(0, 3);
    predefinedQuestions.value = selected;
  } else if (currentLang.value === "en-US") {
    //生成随机3个问题
    let selected = Prompt_word.en.sort(() => 0.5 - Math.random()).slice(0, 3);
    predefinedQuestions.value = selected;
  } else {
    //其他语言
    predefinedQuestions.value = [""]; // 或者设置一个默认值
  }
};

// 初始化提示词
updatePredefinedQuestions();

// 监听语言变化
watch(currentLang, () => {
  updatePredefinedQuestions();
});
//退出登录
const Login_out = async () => {
  console.log("退出登录")
  localStorage.removeItem("token");
  ElNotification({
      title: "Success",
      message: t("message.LoginOut"),
      type: "success",
    });
  window.location.href = "/login";
  } 

const isFixed = ref(false);
const hideNav = ref(false);
let lastScrollY = ref(0);
//滚动条
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const sixVhInPixels = window.innerHeight * 0.06;
  
  // 判断是否应该固定定位
  isFixed.value = currentScrollY > sixVhInPixels;
  
  // 判断滚动方向并更新导航栏显示状态
  if (currentScrollY > lastScrollY.value) {
    // 向下滚动
    hideNav.value = true;
  } else {
    // 向上滚动
    hideNav.value = false;
  }
  
  lastScrollY.value = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.header_box {
  width: 100%;
  height: 16vh;
  transition: all 0.3s ease;
  position: relative;
  
  &.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.95);
  }

  &.nav-hidden {
    height: 10vh;
  }
}

.nav_box {
  width: 100%;
  height: 6vh;
  display: flex;
  background: #000;
  color: #fff;
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  
  &.nav-hidden {
    transform: translateY(-100%);
  }
}

.header {
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  transition: all 0.3s ease;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

// 当header固定时的占位
.fixed-header + * {
  margin-top: 10vh;
  transition: margin-top 0.3s ease;
}

.Title {
  // font-size: 1.5vw;
  font-size: 1.4vw;
  font-weight: 600;
}
.nav_title {
  font-size: 1rem;
  padding: 0.2vw;
}
.nav_title:hover {
  color: variables.$primary-color;
}
.active_nav_title {
  color: variables.$primary-color;
}
</style>
