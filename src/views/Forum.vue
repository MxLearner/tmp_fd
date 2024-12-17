<template>
  <navigation-bar />
  <!--<forum-section />-->
  <post-section />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import ForumSection from "@/components/CommunityForum.vue";
import PostSection from '@/components/Forums.vue';

export default defineComponent({
  name: 'Forum',
  components: {
    NavigationBar,
    //ForumSection,
    PostSection
  },

})
</script>

<style scoped>

</style>