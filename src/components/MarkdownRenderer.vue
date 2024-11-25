<template>
    <div>
      <div v-html="renderedContent" class="prose !max-w-[70vw] mx-auto"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import MarkdownIt from 'markdown-it';
  import { componentPlugin } from '@mdit-vue/plugin-component';
  
  const { locale } = useI18n();
  const renderedContent = ref('');
  
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  }).use(componentPlugin);
  
  // 动态导入所有图片
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const srcIndex = token.attrIndex('src');
  if (srcIndex >= 0) {
    const src = token.attrs[srcIndex][1];
    token.attrs[srcIndex][1] = `/md/${locale.value}/${src.replace('./', '')}`;
  }
  return self.renderToken(tokens, idx, options);
};
  
// 使用 fetch 方法来加载文件，这可能会绕过 Vite 的导入机制
const loadMarkdownContent = async () => {
  try {
    const response = await fetch(`/md/${locale.value}/content.md`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    renderedContent.value = md.render(content);
  } catch (error) {
    console.error('Error loading markdown:', error);
    renderedContent.value = `Error loading content: ${error.message}`;
  }
};
  onMounted(loadMarkdownContent);
  watch(locale, loadMarkdownContent);
  </script>
  

<style scoped>
/* 样式保持不变 */
:deep(.help_center) {
  text-align: center;
}

:deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

:deep(h1, h2, p) {
  padding-left: 16%;
}

:deep(h1) {
  margin-top: 4%;
}

:deep(ol) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
