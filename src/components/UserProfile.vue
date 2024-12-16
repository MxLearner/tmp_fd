<template>
  <div class="user-profile">
    <!-- 用户基本信息 -->
    <el-card class="user-info-card">
      <div class="user-info">
        <div class="user-item">
          <span class="user-label">姓名：</span>{{  userName  }}
        </div>
        <div class="user-item">
          <span class="user-label">ID：</span>{{  userId  }}
        </div>
        <div class="user-item">
          <span class="user-label">邮箱：</span>{{  userEmail  }}
        </div>
      </div>
    </el-card>

    <!-- 修改密码 -->
    <el-card class="change-password-card">
      <div class="change-password">
        <h3>修改密码</h3>
        <el-form :model="passwordForm" ref="passwordForm" class="password-form">
          <el-form-item label="原密码" prop="oldPassword" :rules="oldPasswordRules">
            <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" :rules="newPasswordRules">
            <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword" :rules="confirmPasswordRules">
            <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSubmit">提交修改</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useStore } from '@/store/index.ts'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const store = useStore()
    const { proxy } = getCurrentInstance() as any

    const userName = store.userName
    const userId = store.userId
    const userEmail = store.userEmail

    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const loading = ref(false)

    const oldPasswordRules = [{ required: true, message: '请输入原密码', trigger: 'blur' }]
    const newPasswordRules = [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, message: '密码长度至少6位', trigger: 'blur' }
    ]
    const confirmPasswordRules = [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (rule: any, value: string, callback: any) => {
          if (value !== passwordForm.value.newPassword) {
            callback(new Error('确认密码与新密码不一致!'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]

    const handleSubmit = async () => {
      const { oldPassword, newPassword, confirmPassword } = passwordForm.value
      if (!oldPassword || !newPassword || !confirmPassword) {
        return
      }

      loading.value = true
      let data = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      }
      proxy.$post('/changePassword', data)
      .then((response :any) => {
        console.log('ChangePassword response: ', response)
        if (response === '修改成功!') {
          alert('密码修改成功!')
        }
      })
      .catch((error: any) => {
        console.log('ChangePassword error: ', error)
        alert(error)
      })
      .finally(() => {
        loading.value = false
      })
    }

    return {
      userName,
      userId,
      userEmail,
      passwordForm,
      oldPasswordRules,
      newPasswordRules,
      confirmPasswordRules,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.user-info-card,
.change-password-card {
  margin-bottom: 20px;
}

.user-item {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
}

.password-form {
  width: 400px;
}

.password-form .el-form-item {
  margin-bottom: 20px;
}
</style>