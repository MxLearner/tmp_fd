<template>
  <el-header style="background-color: #1E90FF; padding: 0;">
    <el-row type="flex" justify="space-between" align="middle">
      <!-- 左侧是TJMovies和返回主页 -->
      <el-col :span="8" class="nav-left">
        <div class="logo">TJMovies</div>
        <el-button class="back-btn" type="text" @click="goToIndex">返回主页</el-button>
      </el-col>

      <!-- 右侧是菜单 -->
      <el-col :span="8" :offset="8" class="nav-right">
        <el-button class="forum-btn" type="text" @click="goToForum" data-test="forum-link">社区论坛</el-button>

        <!-- 判断用户是否登录 -->
        <el-button class="login-btn" type="text" @click="goToLogin">{{  userLoggedIn ? userName + ' 退出登录' : '请登录'  }}</el-button>
        <el-button class="profile-btn" type="text" @click="goToProfile">个人中心</el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/index.ts';

export default defineComponent({
  name: 'NavigationBar',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    const userName = store.userName
    const userLoggedIn = userName !== null
    
    const goToIndex = () => {
      router.push({ name: 'Index' })
    }

    const goToForum = () => {
      router.push({ name: 'Forum' })
    }

    const goToLogin = () => {
      store.setUserName(null)
      store.setUserId(null)
      router.push({ name: 'Login' })
    }

    const goToProfile = () => {
      if (!userLoggedIn) {
        alert('请先登录')
        router.push({ name: 'Login' })
        return
      }
      router.push({ name: 'Profile' })
    }

    return {
      userName,
      userLoggedIn,
      goToIndex,
      goToForum,
      goToLogin,
      goToProfile
    }
  }
})
</script>

<style scoped>
.logo {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-left: 20px;
}

.nav-left {
  display: flex;
  align-items: center;
  text-align: left;
}

.nav-right {
  text-align: right;
}

.back-btn {
  color: white;
  margin-left: 15px;
}

.forum-btn,
.login-btn,
.profile-btn {
  color: white;
  margin-right: 15px;
}

.username {
  color: white;
  margin-right: 15px;
}
</style>