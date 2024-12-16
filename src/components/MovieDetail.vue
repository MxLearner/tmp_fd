<template>
  <div class="movie-detail">
    <h1>电影编号：{{ movieId }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MovieDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const movieId = props.id;
    
    return {
      movieId
    }
  }
})
</script>

<style scoped>
.movie-detail {
  padding: 20px;
}
</style>