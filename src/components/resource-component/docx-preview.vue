<template>
    <div ref="container" class="docx-container"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { renderAsync } from 'docx-preview';
  
  const props = defineProps({
    course_url: {
      type: String,
      required: true
    }
  });
  
  const container = ref<HTMLElement | null>(null);
  
  async function loadDocument() {
    try {
      const response = await fetch(props.course_url);
      const blob = await response.blob();
      if (container.value) {
        await renderAsync(blob, container.value);
      }
    } catch (error) {
      console.error('文档加载失败：', error);
    }
  }
  
  onMounted(() => {
    loadDocument();
  });
  </script>
  
  <style scoped>
  .docx-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  </style>