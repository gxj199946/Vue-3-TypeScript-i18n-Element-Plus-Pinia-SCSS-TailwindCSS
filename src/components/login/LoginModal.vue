<template>
  <el-dialog
    v-model="visible"
    :title="$t('login.title')"
    width="400px"
    :close-on-click-modal="false"
    :show-close="true"
    @close="handleClose"
    center
    class="login-modal"
  >
    <div class="login-container">
      <div class="login-header mb-6 text-center">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
          {{ $t('login.welcomeBack') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ $t('login.pleaseLogin') }}
        </p>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
        class="login-form"
      >
        <el-form-item :label="$t('login.username')" prop="username">
          <el-input
            v-model="formData.username"
            :placeholder="$t('login.usernamePlaceholder')"
            prefix-icon="User"
            class="login-input"
          />
        </el-form-item>

        <el-form-item :label="$t('login.password')" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            :placeholder="$t('login.passwordPlaceholder')"
            prefix-icon="Lock"
            show-password
            class="login-input"
          />
        </el-form-item>

        <div class="flex justify-between items-center mb-6">
          <el-checkbox v-model="formData.remember" class="remember-me">
            {{ $t("login.rememberMe") }}
          </el-checkbox>
          <el-link type="primary" class="forgot-password">
            {{ $t("login.forgotPassword") }}
          </el-link>
        </div>

        <div class="flex justify-end gap-3">
          <el-button 
            @click="handleClose"
            class="cancel-btn"
          >
            {{ $t("common.cancel") }}
          </el-button>
          <el-button 
            type="primary" 
            :loading="loading" 
            @click="handleSubmit"
            class="submit-btn"
          >
            {{ $t("login.submit") }}
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElNotification, FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import { User, Lock } from "@element-plus/icons-vue";
import { ulid } from "ulidx";
import JSEncrypt from "jsencrypt";
import { useAuthStore } from "@/stores/auth";
import { UserService } from "@/services/api";
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref<FormInstance>();
const visible = ref(false);
const loading = ref(false);

// 表单数据
const formData = reactive({
  username: "",
  password: "",
  remember: false,
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: t("login.usernameRequired"), trigger: "blur" },
    { min: 3, message: t("login.usernameLength"), trigger: "blur" },
  ],
  password: [
    { required: true, message: t("login.passwordRequired"), trigger: "blur" },
    { min: 6, message: t("login.passwordLength"), trigger: "blur" },
  ],
};

// 在 script setup 中添加
watch(
  () => authStore.showLoginModal,
  (show) => {
    visible.value = show;
  }
);

// 打开登录框
const openLogin = () => {
  authStore.setShowLoginModal(true);
};
const emit = defineEmits(["login-success"]);

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      // 1. 先获取服务器的公钥
      const publicKey = await UserService.AuthpublicKey();
      // 2. 创建 JSEncrypt 实例
      const encrypt = new JSEncrypt();
      // 3. 设置公钥并加密
      encrypt.setPublicKey(publicKey?.publicKey);
      const encryptedPassword = encrypt.encrypt(formData.password);
      console.log(encryptedPassword);
      
      // 4. 构建登录请求数据
      const loginData = {
        username: formData.username,
        password: encryptedPassword, // 使用加密后的密码
      };      
      const response = await UserService.AuthLogin(loginData);
      console.log(response);

      if (!response.ok) {
        const data = await response.json();
        ElNotification({
          title: "Error",
          message: data.message || t("message.Error"),
          type: "error",
        });
      } else {
        const data = await response.json();
        console.log("登录成功", data);

        ElNotification({
          title: "Success",
          message: t("message.Success"),
          type: "success",
        });

        // localStorage.setItem('token', JSON.stringify(data?.token))

        // 如果选择了记住我，可以保存用户名
        if (formData.remember) {
          localStorage.setItem("rememberedUsername", formData.username);
        }

        // 调用登录成功处理方法
        // authStore.handleLoginSuccess();

        // // 登录成功后
        // emit("login-success");

        // visible.value = false;
        // // router.push('/')
        // router.go(0);
      }
    } catch (err) {
      // 测试用
      // localStorage.setItem("token", JSON.stringify(ulid()));
      // window.location.href = '/'
      //重新加载当前路由
      // router.go(0);
    } finally {
      loading.value = false;
    }
  });
};

// 修改关闭按钮的处理
const handleClose = async () => {
  // 先清除 URL 中的查询参数
  const currentRoute = router.currentRoute.value;
  if (currentRoute.query.authMode) {
    await router.replace({ 
      path: currentRoute.path,
      query: Object.fromEntries(
        Object.entries(currentRoute.query)
          .filter(([key]) => key !== 'authMode')
      )
    });
  }
  
  // 然后关闭模态框
  authStore.setShowLoginModal(false);
};

// 暴露方法给父组件
defineExpose({
  openLogin,
});
</script>

<style scoped>
.login-modal {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    background-color: white;
    position: relative;
    z-index: 2001;
  }

  :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px 20px 0;
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-overlay) {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }
}

.login-container {
  padding: 0 12px;
}

.login-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #374151;
    padding-bottom: 4px;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.3s ease;
    padding: 8px 12px;
  }

  :deep(.el-input__wrapper:hover) {
    border-color: #60a5fa;
  }

  :deep(.el-input__wrapper.is-focus) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
}

.remember-me {
  :deep(.el-checkbox__label) {
    color: #4b5563;
  }
}

.forgot-password {
  font-size: 0.875rem;
  color: #3b82f6;
  
  &:hover {
    color: #2563eb;
  }
}

.submit-btn {
  background-color: #3b82f6;
  border-color: #3b82f6;
  padding: 10px 24px;
  font-weight: 500;
  
  &:hover {
    background-color: #2563eb;
    border-color: #2563eb;
  }
}

.cancel-btn {
  padding: 10px 24px;
  font-weight: 500;
}
</style>
