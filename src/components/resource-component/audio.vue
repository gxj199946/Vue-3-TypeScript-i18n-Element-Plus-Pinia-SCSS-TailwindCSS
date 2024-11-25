<template>
  <div>
    <audio :src="course_url" controls v-prevent-right-click></audio>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const prop = defineProps({
  course_url: {
    type: String,
    required: true,
    default: "默认值",
  },
  path_key: {
    type: String,
    required: false,
    default: "默认值",
  },
});
</script>

