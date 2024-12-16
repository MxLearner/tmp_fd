<template>
  <navigation-bar />
  <div class="index">
    <movie-search />
    <movie-list :movies="moviesAll" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import MovieSearch from '@/components/MovieSearch.vue'
import MovieList from '@/components/MovieList.vue'


// 电影信息接口
interface Movie {
  id: string
  title: string
  imageSrc: string
  releaseDate: string
  rating: string
}

export default defineComponent({
  name: 'Index',
  components: {
    NavigationBar,
    MovieSearch,
    MovieList
  },
  setup() {
    const { proxy } = getCurrentInstance() as any
    const moviesAll = ref<Movie[]>([]);

    // 获取所有电影数据
    const fetchMoviesAll = async () => {
      let data = {};
      proxy.$get('/movies', data)
      .then((response: any) => {
        console.log(response)
        moviesAll.value = response
      })
    }

    onMounted(() => {
      fetchMoviesAll();
    })

    return {
      moviesAll
    }
  }
})
</script>

<style scoped>
.index {
  padding: 20px;
}
</style>