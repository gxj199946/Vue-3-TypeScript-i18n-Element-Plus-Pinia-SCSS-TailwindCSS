<template>
    <div class=" h-48 w-screen  bg-black text-white text-2xl text-center flex flex-col justify-center items-center">
       <div  class="w-full flex justify-center items-center">
        <img v-if="!isDark" src="#" style="width:10.2vw;height: 3.2vw;" class=" mb-3" alt="">
        <img v-else src="#" class=" mb-3" style="width:10.2vw;height: 3.2vw;"  alt="">
        <!-- <span class=" ml-2">{{ $t('title') }}</span> -->
       </div>
        <p>{{$t('footer.title')  }}</p>
        <p>{{ $t('footer.entitle') }}</p>
    </div>
</template>

<script setup lang="ts">
// import Logo2 from "@/assets/xxx.png"
// import Logo22 from "@/assets/xxx.png"
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores/themeStore";
const themeStore = useThemeStore();

const { isDark } = storeToRefs(themeStore);

import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

</script>

<style lang="scss" scoped>

</style>