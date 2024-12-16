<template>
  <navigation-bar />
  <div class="search-results">
    <h2>搜索结果</h2>
    <movie-search />
    <movie-list :movies="movieSearched" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import MovieList from '@/components/MovieList.vue'
import MovieSearch from '@/components/MovieSearch.vue'

// 电影详细信息接口
interface MovieInfo {
  id: number
  title: string
  text: string
  rating: number
  releaseDate: string
  director: string
  duration: string
  language: string
  actors: string
  imageSrc: string
}

// 电影信息接口
interface Movie {
  id: string
  title: string
  imageSrc: string
  releaseDate: string
  rating: string
}

export default defineComponent({
  name: 'SearchResults',
  components: {
    NavigationBar,
    MovieList,
    MovieSearch
  },
  setup() {
    const route = useRoute()
    const { proxy } = getCurrentInstance() as any
    const query = route.query.q as string
    const movieSearchedInfo = ref<MovieInfo[]>([])
    const movieSearched = ref<Movie[]>([])

    // 获取检索的电影数据
    const fetchMoviesSearched = async () => {
      let data = {
        title: query
      }
      proxy.$post('/movies', data)
      .then((response: any) => {
        console.log(response)
        movieSearchedInfo.value = response
        movieSearchedInfo.value.forEach((m: MovieInfo) => {
          movieSearched.value.push({
            id: m.id.toString(),
            title: m.title,
            imageSrc: m.imageSrc,
            releaseDate: m.releaseDate,
            rating: m.rating.toString()
          })
        })
      })
    }

    onMounted(() => {
      fetchMoviesSearched()
    })

    return {
      movieSearched
    }
  }
})
</script>