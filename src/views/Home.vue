
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Edit, Share, Delete } from '@element-plus/icons-vue'

import { UserService } from '@/services/api'

const users = ref([])

onMounted(async () => {
  try {
    users.value = await UserService.getCourses()
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>

<template>
  <div>
    <nav>
    <router-link to="/about">About</router-link>
  </nav>
    <h1>Users</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.title }}</li>
    </ul>
    <el-icon><Edit /></el-icon>
  <el-icon><Share /></el-icon>
  <el-icon><Delete /></el-icon>
  </div>
</template>