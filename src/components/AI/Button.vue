<script setup lang="ts">
import Dialog from './Dialog.vue';
import { ref } from 'vue'

export interface DocumateProps {
  locale:string;
  endpoint: string;
  buttonLabel?: string;
  placeholder?: string;
  predefinedQuestions?: string[];
}
const props = withDefaults(defineProps<DocumateProps>(), {
  locale:'',
  endpoint: '',
  buttonLabel: 'Ask AI',
  placeholder: 'Ask a question...',
  predefinedQuestions: () => [],
})

const isOpen = ref(false)

</script>

<template>
<button type="button" class="documate-button" aria-label="Ask AI" @click="isOpen=true" style="padding-right: 2%;border:1px solid #8e8888;border-radius:8px">
  <svg t="1722240968547" class="icon" viewBox="0 0 1920 1080" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3750" ><path d="M1004.8 915.2l-243.2-243.2c0 0-6.4-6.4-6.4-6.4C800 595.2 832 505.6 832 416 832 185.6 646.4 0 416 0S0 185.6 0 416 185.6 832 416 832c89.6 0 179.2-32 243.2-83.2 0 6.4 6.4 6.4 6.4 6.4l243.2 243.2c25.6 25.6 70.4 25.6 96 6.4C1030.4 979.2 1030.4 940.8 1004.8 915.2zM64 416C64 224 224 64 416 64S768 224 768 416 608 768 416 768 64 608 64 416z" fill="#515151" p-id="3751"></path></svg>  <span class="button-placeholder">{{'Ai'}}</span>
</button>

<Dialog v-if="isOpen" :endpoint="props.endpoint"
  :locale="props.locale"
  :placeholder="props.placeholder"
  :predefinedQuestions="props.predefinedQuestions"
  :open = "isOpen"
  @close="isOpen = false"></Dialog>
</template>

<style scoped>
.documate-button {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  padding-left: 0.75rem;
  padding-right: 0.75rem;
  height: var(--dm-button-height);
  transition: border-color 0.25s ease-in-out;
  cursor: pointer;

  .icon {
    height: 1rem;
    color: #000 ;
    scale: 1.2;
  }
}

@media (min-width: 768px) {
  .documate-button {
    /* font-size: var(--dm-button-font-size);
    color: var(--dm-color-hint);
    border: 1px solid transparent;
    margin-left: 2rem;
    border-radius: 0.5rem;
    background: var(--dm-color-bg-alt); */
    font-size: var(--dm-button-font-size);
    /* color: var(--dm-color-hint); */
    border: 1px solid transparent;
    margin-left: 2rem;
    border-radius: 0.5rem;
    background: none !important;
    color: #675f5f !important;
    font-weight: bold !important;
    width: 8rem !important;
    height: 3rem !important;
    border: 1px solid #8e8888;

    .icon {
      height: var(--dm-button-font-size);
      margin-right: 0.2rem;
    }
  }

  .documate-button:hover {
    border-color: var(--dm-color-brand);
  }
}
</style>