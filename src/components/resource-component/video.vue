<template>
  <div>
    <video ref="videoRef" controls autoplay v-prevent-right-click>
      <source :src="course_url" type="video/mp4" />
    </video>
  </div>
</template>

<script setup>
import { defineProps, onUnmounted, ref } from "vue";
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

const videoRef = ref(null);

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause(); // 暂停视频播放
  }
});
</script>
