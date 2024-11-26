
<script setup lang="ts">
import { ref, onMounted,defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { UserService } from '@/services/api';
import {useHomeUiStore} from "@/stores/homeuiStore";
import { useI18n } from "vue-i18n";
const { t:_ } = useI18n();
const HomeUiStore = useHomeUiStore();
// 动态导入组件
const SchoolHomeView = defineAsyncComponent(() => 
  import("@/components/home-ui/School-Home.vue")
)
const UserHomeView = defineAsyncComponent(() => 
  import('@/components/home-ui/User-Home.vue')
)
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
  <div class=" w-full h-full" >
    <div>
      <UserHomeView v-if="HomeUiStore.page=='UserHome'"/>
      <SchoolHomeView v-if="HomeUiStore.page=='SchoolHome'"/>
    </div>
    <div v-for="(i,v) in Array(200)" key="v"> {{ $t('route.home.title') }}
    </div>
    

  </div>
</template>