<template>
    <div class="docx-container">
      <div v-if="loading">加载中...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else v-html="content" class="docx-content"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import mammoth from 'mammoth';
  
  const props = defineProps({
    course_url: {
      type: String,
      required: true
    }
  });
  
  const content = ref('');
  const loading = ref(true);
  const error = ref('');
  
  async function loadDocument() {
    try {
      loading.value = true;
      // 获取文档
      const response = await fetch(props.course_url);
      const arrayBuffer = await response.arrayBuffer();
      
      // 转换文档
      const result = await mammoth.convertToHtml({ arrayBuffer });
      content.value = result.value;
    } catch (err) {
      error.value = '文档加载失败：' + (err as Error).message;
    } finally {
      loading.value = false;
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
    padding: 32px;
    overflow-y: auto;
    background-color: #f5f6f8;
  }
  
  .docx-content {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* 标题样式 */
  .docx-content :deep(h1) {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #1a1a1a;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 12px;
  }
  
  .docx-content :deep(h2) {
    font-size: 24px;
    font-weight: 500;
    margin: 20px 0 16px;
    color: #2c3e50;
  }
  
  .docx-content :deep(h3) {
    font-size: 20px;
    font-weight: 500;
    margin: 16px 0 12px;
    color: #34495e;
  }
  
  /* 段落样式 */
  .docx-content :deep(p) {
    margin-bottom: 16px;
    line-height: 1.8;
    color: #333;
    font-size: 16px;
  }
  
  /* 图片样式 */
  .docx-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 16px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* 列表样式 */
  .docx-content :deep(ul), 
  .docx-content :deep(ol) {
    margin: 16px 0;
    padding-left: 24px;
  }
  
  .docx-content :deep(li) {
    margin-bottom: 8px;
    line-height: 1.6;
    color: #333;
  }
  
  /* 表格样式 */
  .docx-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  }
  
  .docx-content :deep(th),
  .docx-content :deep(td) {
    border: 1px solid #e0e0e0;
    padding: 12px;
    text-align: left;
  }
  
  .docx-content :deep(th) {
    background-color: #f5f6f8;
    font-weight: 500;
  }
  
  /* 加载状态样式 */
  .docx-container > div[v-if="loading"] {
    text-align: center;
    padding: 40px;
    color: #666;
    font-size: 16px;
  }
  
  /* 错误状态样式 */
  .docx-container > div[v-else-if="error"] {
    text-align: center;
    padding: 40px;
    color: #dc3545;
    font-size: 16px;
  }
  </style>