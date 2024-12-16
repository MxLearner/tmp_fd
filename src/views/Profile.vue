<template>
  <navigation-bar />
  <div class="profile-container">
    <h1>个人信息</h1>
    <user-profile />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import UserProfile from '@/components/UserProfile.vue'

export default defineComponent({
  name: 'Profile',
  components: {
    NavigationBar,
    UserProfile
  }
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}
</style>