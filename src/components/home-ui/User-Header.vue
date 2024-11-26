<template>
    <div class=" flex">
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
    </div>
</template>

<script setup>
import {ref,computed} from 'vue'
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const router = useRouter();
const route = useRoute();
const { t} = useI18n();
// 获取路由数组,截取前3个作为导航路由
const routes = computed(() => router.options.routes.slice(0, 3));
// 检查路由是否激活
const isRouteActive = (path) => {
  return route.path === path;
};
</script>

<style lang="scss" scoped>
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