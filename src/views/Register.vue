<template>
  <div class="register-container">
    <h2>注册 TJMovies</h2>
    <user-register />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserRegister from '@/components/UserRegister.vue'

export default defineComponent({
  name: 'Register',
  components: {
    UserRegister
  }
})
</script>

<style scoped>
.register-container {
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