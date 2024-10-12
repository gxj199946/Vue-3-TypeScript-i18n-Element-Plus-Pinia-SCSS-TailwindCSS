<template>
  <div class="language-selector">
    <el-popover
      v-model:visible="popoverVisible"
      placement="bottom"
      :width="200"
      trigger="manual"
      popper-class="language-popover"
    >
      <template #reference>
        <div class="language-trigger" @click="togglePopover">
          <span class="language-icon"></span>
          {{ currentLanguageLabel }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
      </template>
      <div class="language-options">
        <div
          v-for="lang in languages"
          :key="lang.value"
          class="language-option"
          :class="{ 'is-active': lang.value === currentLang }"
          @click="handleLanguageClick(lang.value)"
        >
          <span :class="['flag-icon', `flag-icon-${lang.flag}`]"></span>
          {{ lang.label }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useLanguageStore } from "@/stores/languageStore";
import { ElPopover } from 'element-plus'

const languageStore = useLanguageStore();
const popoverVisible = ref(false);

const languages = [
  { value: 'zh-CN', label: '简体中文', flag: 'cn' },
  { value: 'en-US', label: 'English', flag: 'us' }
];

const currentLang = computed(() => languageStore.currentLang);

const currentLanguageLabel = computed(() => {
  return languages.find(lang => lang.value === currentLang.value)?.label || '选择语言';
});

const togglePopover = () => {
  popoverVisible.value = !popoverVisible.value;
  if (popoverVisible.value) {
    console.log('当前语言:', currentLang.value);
  }
};

const handleLanguageClick = (lang: "zh-CN" | "en-US") => {
  if (lang !== currentLang.value) {
    languageStore.switchLanguage(lang);
    popoverVisible.value = false;
  }
};

watch(popoverVisible, (newValue) => {
  if (newValue) {
    console.log('选择器已展开，当前语言:', currentLang.value);
  }
});

onMounted(() => {
  console.log('组件挂载时的当前语言:', currentLang.value);
  languageStore.initLanguage(); // 确保语言被正确初始化
});
</script>

<style lang="scss" scoped>
.language-selector {
  display: inline-block;
}

.language-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;

  &:hover {
    color: #409EFF;
  }

  i {
    margin-right: 5px;
  }
}

.language-options {
  .language-option {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;

    &:not(.is-active):hover {
      background-color: #f5f7fa;
    }

    .flag-icon {
      margin-right: 8px;
    }

    &.is-active {
      color: #409EFF;
      font-weight: bold;
      cursor: default;
      background-color: #ecf5ff;
    }
  }
}
.language-icon {
     width: 20px;
     height: 20px;
     margin-right: 5px;
     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
     background-size: contain;
     background-repeat: no-repeat;
     background-position: center;
   }
</style>

<style>
.language-popover {
  padding: 0;
}
</style>