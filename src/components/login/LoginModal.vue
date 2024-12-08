<template>
  <el-dialog
    v-model="visible"
    :title="isLogin ? $t('login.title') : $t('register.title')"
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
          {{ isLogin ? $t("login.welcomeBack") : $t("register.welcome") }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{
            isLogin ? $t("login.pleaseLogin") : $t("register.pleaseRegister")
          }}
        </p>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
         @keyup.enter="handleSubmit"
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
            @keyup.enter="handleSubmit"
            prefix-icon="Lock"
            show-password
            class="login-input"
          />
        </el-form-item>

        <div class="flex justify-between items-center mb-6">
          <el-checkbox
            v-if="isLogin"
            v-model="formData.remember"
            class="remember-me"
          >
            {{ $t("login.rememberMe") }}
          </el-checkbox>
          <el-link v-if="isLogin" type="primary" class="forgot-password">
            {{ $t("login.forgotPassword") }}
          </el-link>
        </div>

        <div class="flex justify-end mb-4">
          <el-button link type="primary" @click="toggleMode">
            {{ isLogin ? $t("login.goToRegister") : $t("register.goToLogin") }}
          </el-button>
        </div>

        <div class="flex justify-end gap-3">
          <el-button @click="handleClose" class="cancel-btn">
            {{ $t("common.cancel") }}
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit"
            class="submit-btn"
          >
            {{ isLogin ? $t("login.submit") : $t("register.submit") }}
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { ElNotification, FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import { User, Lock } from "@element-plus/icons-vue";
import { ulid } from "ulidx";
import JSEncrypt from "jsencrypt";
import forge from "node-forge";
import { useAuthStore } from "@/stores/auth";
import { UserService } from "@/services/api";
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref<FormInstance>();
const visible = ref(authStore.showLoginModal);
const loading = ref(false);
const isLogin = ref(true);

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

// 切换登录/注册模式
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  formRef.value?.resetFields();
};

//加密密码
const ForgePublicKey_util = async (password: any) => {
  try {
    // 1. 先获取服务器的公钥
    const pubKey = await UserService.AuthpublicKey();
    //2.将 base64 编码的公钥转换为 forge 公钥对象
    const publicKey = forge.pki.publicKeyFromPem(pubKey?.publicKey);
    //3.加密
    const encrypted = publicKey.encrypt(password, "RSA-OAEP", {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    });
    //4.转换为base64 并返回
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error("Password encryption failed:", error);
    throw error;
  }
};
// 修改提交处理
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      if (isLogin.value) {
        // 原有的登录逻辑
        const encryptedPassword = await ForgePublicKey_util(formData.password);
        // 5.构建登录请求数据
        const loginData = {
          username: formData.username,
          password: encryptedPassword, // 使用加密后的密码
        };
        //5.请求登录
        const response = await UserService.AuthLogin(loginData);
        console.log(response);

        if (response && response?.token) {
          console.log("登录成功", response);
          //缓存token
          authStore.TokenAuth(response.token);

          ElNotification({
            title: "Success",
            message: t("message.Success"),
            type: "success",
          });

          // 如果选择了记住我，可以保存用户名
          if (formData.remember) {
            localStorage.setItem("rememberedUsername", formData.username);
          }

          // 调用登录成功处理方法
          authStore.startAuth();

          // // 登录成功后
          emit("login-success");

          visible.value = false;
          // // router.push('/')
          router.go(0);
        } else {
          ElNotification({
            title: "Error",
            message: response.message || t("message.Error"),
            type: "error",
          });
        }
      } else {
        // 注册逻辑
        
        const encryptedPassword = await ForgePublicKey_util(formData.password);
        const registerData = {
          username: formData.username,
          password: encryptedPassword,
        };

        const response = await UserService.AuthRegister(registerData);
        console.log(response);

        if (response && response.message) {
          ElNotification({
            title: "Success",
            message: t("message.RegisterSuccess"),
            type: "success",
          });
          // 注册成功后切换到登录
          isLogin.value = true;
          formRef.value?.resetFields();
        } else {
          ElNotification({
            title: "Error",
            message: response.message || t("message.RegisterError"),
            type: "error",
          });
        }
      }
    } catch (err) {
      console.log(err);
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
        Object.entries(currentRoute.query).filter(([key]) => key !== "authMode")
      ),
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
