<template>
  <div class="login-container">
    <h2>欢迎登录 TJMovies</h2>
    <user-login />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserLogin from '@/components/UserLogin.vue'

export default defineComponent({
  name: 'Login',
  components: {
    UserLogin
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>