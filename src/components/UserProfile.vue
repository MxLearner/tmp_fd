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
        <el-form
          :model="form"
          :rules="rules"
          ref="passwordForm"
          class="password-form"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="form.oldPassword" type="password" placeholder="请输入原密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" />
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
import { ElForm, ElFormItem, ElInput, ElButton, FormRules } from 'element-plus'

export default defineComponent({
  name: 'UserProfile',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    const store = useStore()
    const { proxy } = getCurrentInstance() as any

    const userName = store.userName
    const userId = store.userId
    const userEmail = store.userEmail

    const form = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const loading = ref(false)

    const rules = ref<FormRules>({
      oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: any) => {
            if (value === form.value.oldPassword) {
              callback(new Error('新密码不能与旧密码相同!'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: any) => {
            if (value !== form.value.newPassword) {
              callback(new Error('确认密码与新密码不一致!'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    })

    const handleSubmit = async () => {
      const { oldPassword, newPassword, confirmPassword } = form.value
      // if (!oldPassword || !newPassword || !confirmPassword) {
      //   return
      // }
      if (newPassword !== confirmPassword) {
        alert('新密码和确认密码不一致!')
        return
      }
      loading.value = true
      let data = {
        username: userName,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }
      proxy.$post('/changePassword', data)
      .then((response :any) => {
        console.log('ChangePassword response: ', response)
        if (response === '密码修改成功!') {
          alert(response)
        }
      })
      .catch((error: any) => {
        console.log('ChangePassword error: ', error)
        alert('原密码错误!')
      })
      .finally(() => {
        loading.value = false
      })
    }

    return {
      userName,
      userId,
      userEmail,
      form,
      rules,
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
  max-width: 400px;
  margin: 0 auto;
}

.password-form .el-form-item {
  margin-bottom: 20px;
}
</style>