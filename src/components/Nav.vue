<template>
  <div class="nav_box">
    &nbsp;&nbsp;
    <div
      @click="handlePageHome('UserHome')"
      :class="{ active: HomeUiStore.page === 'UserHome' }"
    >
      学生
    </div>
    &nbsp;&nbsp;
    <div
      @click="handlePageHome('SchoolHome')"
      :class="{ active: HomeUiStore.page === 'SchoolHome' }"
    >
      学校
    </div>
  </div>
</template>

<script setup>
import {useHomeUiStore} from "@/stores/homeuiStore";
const HomeUiStore = useHomeUiStore();
const handlePageHome = (Page) => {
  HomeUiStore.PageUiAction(Page);
};
</script>

<style lang="scss" scoped>
.nav_box {
  width: 100%;
  height: 6vh;
  display: flex;
  background: #000;
  color: #fff;

  div {
    cursor: pointer;
    padding: 0 10px;

    &.active {
      color: #your-active-color; // 可以设置选中状态的样式
    }
  }
}
</style>
