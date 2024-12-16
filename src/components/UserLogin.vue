<template>
  <el-form
    ref="loginForm"
    :model="form"
    :rules="rules"
    label-width="100px"
    class="login-form"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
      />
    </el-form-item>

    <el-form-item>
      <el-row>
        <!-- 登录按钮 -->
        <el-col :span="12">
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">登录</el-button>
        </el-col>

        <!-- 注册按钮 -->
        <el-col :span="12">
          <el-button @click="goToRegister" style="width: 100%; margin-left: 20px">注册</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElRow, ElCol, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/index.ts';

export default defineComponent({
  name: 'UserLogin',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElRow,
    ElCol
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const { proxy } = getCurrentInstance() as any
    const form = ref({
      username: '',
      password: ''
    })
    const loading = ref(false)

    const rules = ref<FormRules>({
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    })

    // 登录请求处理
    const handleLogin = async () => {
      const { username, password } = form.value
      if (!username || !password) {
        return
      }
      
      loading.value = true
      let data = {
        username: username,
        password: password
      }
      proxy.$post('/login', data)
      .then((response: any) => {
        console.log('Login response: ', response)
        console.log(response.message);
        if (response.message === '登录成功!') {
          alert('登录成功')

          store.setUserName(username) // 设置用户名
          store.setUserId(response.userId) // 设置用户ID
          store.setUserEmail(response.email) // 设置用户邮箱

          router.push({ name: 'Index' }) // 跳转到主页
        }

      })
      .catch((error: any) => {
        console.log('Login error: ', error)
        alert(error.error)
      })
      .finally(() => {
        loading.value = false
      })
    }

    // 跳转到注册页面
    const goToRegister = () => {
      router.push({ name: 'Register' })
    }

    return {
      form,
      rules,
      loading,
      handleLogin,
      goToRegister
    }
  }
})
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>