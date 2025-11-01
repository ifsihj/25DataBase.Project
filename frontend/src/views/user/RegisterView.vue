<template>
  <div class="register-container">
    <a-form
      :model="formState"
      name="register_form"
      class="register-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="用户名"
        name="username"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="邮箱"
        name="email"
        :rules="[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]"
      >
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        label="确认密码"
        name="confirm"
        :rules="[
          { required: true, message: '请再次输入密码' },
          { validator: validateConfirm },
        ]"
      >
        <a-input-password v-model:value="formState.confirm" />
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="register-form-button"
        >
          注册
        </a-button>
        <div class="or-text">
          已有账号，<a @click.prevent="goLogin">去登录</a>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { register } from "@/api/user";

interface FormState {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

const router = useRouter();

const formState = reactive<FormState>({
  username: "",
  email: "",
  password: "",
  confirm: "",
});

const validateConfirm = (_: any, value: string) => {
  if (value !== formState.password) {
    return Promise.reject(new Error("两次输入的密码不一致"));
  }
  return Promise.resolve();
};

const onFinish = async () => {
  try {
    const res: any = await register(
      formState.username,
      formState.password,
      formState.email
    );
    // backend returns 201 with message on success
    if (res && res.status === 201) {
      message.success("注册成功，请登录");
      router.push("/login");
    } else {
      // show backend message or generic
      const errMsg = res?.data?.error || res?.data?.message || "注册失败";
      message.error(errMsg);
    }
  } catch (err: any) {
    const errMsg = err?.response?.data?.error || err?.message || "注册请求失败";
    message.error(errMsg);
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const goLogin = () => {
  router.push("/login");
};

const disabled = computed(() => {
  return !(
    formState.username &&
    formState.email &&
    formState.password &&
    formState.confirm
  );
});
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}
.register-form {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.register-form-button {
  width: 100%;
  margin-bottom: 12px;
}
.or-text {
  text-align: center;
}
</style>
