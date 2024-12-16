<template>
  <navigation-bar />
  <div class="movie-container">
    <movie-detail :id="id"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import MovieDetail from '@/components/MovieDetail.vue';

export default defineComponent({
  name: 'Movie',
  components: {
    NavigationBar,
    MovieDetail
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
.movie-container {
  padding: 20px;
}
</style>