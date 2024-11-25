<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4">{{ $t("login.title") }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="username">
            {{ $t("login.username") }}
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="password">
            {{ $t("login.password") }}
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {{ $t("login.submit") }}
          </button>
        </div>
        <div v-if="error" class="text-red-500 text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import { ulid } from "ulidx";

const { t } = useI18n();
const username = ref(""); // Changed from email to username
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await fetch("/api/login", {
      // 替换为您的登录API端点
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }), // Changed to username
    });

    if (!response.ok) {
      const data = await response.json();
      error.value = data.message || "登录失败";
    } else {
      // 登录成功，跳转到其他页面或执行其他操作
      console.log("登录成功!");
      ElNotification({
        title: "Success",
        message: t("message.Success"),
        type: "success",
      });

      localStorage.setItem("token", JSON.stringify(data?.token)); // 存储JWT令牌

      router.push("/");
    }
  } catch (err) {
    //测试
    localStorage.setItem("token", JSON.stringify(ulid())); // 存储JWT令牌
    window.location.href = "/";
    //
    
    error.value = "登录失败，请检查网络连接";
    ElNotification({
      title: "Error",
      message: t("message.Error"),
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>
