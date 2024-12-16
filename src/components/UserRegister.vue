<template>
  <el-form
    ref="registerForm"
    :model="form"
    :rules="rules"
    label-width="100px"
    class="register-form"
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

    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
      />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input
         v-model="form.email"
         type="email"
         placeholder="请输入邮箱"
      />
    </el-form-item>

    <el-form-item>
      <el-row>
        <!-- 注册按钮 -->
        <el-col :span="12">
          <el-button type="primary" @click="handleRegister" :loading="loading">注册</el-button>
        </el-col>

        <!-- 返回登录按钮 -->
        <el-col :span="12">
          <el-button @click="goToLogin" style="width: 100%; margin-left: 20px">返回登录</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElRow, ElCol, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'UserRegister',
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
    const { proxy } = getCurrentInstance() as any
    const form = ref({
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    })
    const loading = ref(false)

    const rules = ref<FormRules>({
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: any) => {
            if (value && value !== form.value.password) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
    })

    // 注册请求处理
    const handleRegister = async () => {
      const { username, password, confirmPassword, email } = form.value
      if (!username || !password || !confirmPassword || !email) {
        return
      }

      loading.value = true
      let data = {
        username: username,
        password: password,
        email: email
      }
      proxy.$post('/register', data)
      .then((response: any) => {
        console.log(response)
        if (response.message === '注册成功!') {
          alert('注册成功!')
          router.push({ name: 'Login' }) // 跳转到登录页面
        }
      })
      .catch((error: any) => {
        console.log('Register Error:', error)
        alert(error.error)
      })
      .finally(() => {
        loading.value = false
      })
    }

    const goToLogin = () => {
      router.push({ name: 'Login' })
    }

    return {
      form,
      rules,
      loading,
      handleRegister,
      goToLogin
    }
  }
})
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>