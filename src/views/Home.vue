
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Edit, Share, Delete } from '@element-plus/icons-vue'
import { useRouter, useRoute } from "vue-router";
import { UserService } from '@/services/api'
import { useI18n } from "vue-i18n";
const { t:_ } = useI18n();
const router = useRouter();

const users = ref([])

onMounted(async () => {
  try {
    console.log("加载完成");
    
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>

<template>
  <div class=" w-full h-full" style="height: 200vh;">
    <div> {{ $t('route.home.title') }}
    </div>
    <div>其他ui</div>

  </div>
</template>