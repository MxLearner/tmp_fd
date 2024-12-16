<template>
  <navigation-bar />
  <movie-intro :id="id"/>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import MovieIntro from '@/components/MovieDetail.vue';

export default defineComponent({
  name: 'Movie',
  components: {
    NavigationBar,
    MovieIntro
  },
  setup() {
    const route = useRoute()
    const id = computed(() => route.params.id as string)

    return {
      id
    }
  }
})
</script>

<style scoped>

</style>