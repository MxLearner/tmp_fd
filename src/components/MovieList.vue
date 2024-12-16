<template>
  <div class="movie-list">
    <el-select v-model="sortBy" placeholder="排序" class="sort-select">
      <el-option label="评分升序" value="ratingAsc" />
      <el-option label="评分降序" value="ratingDesc" />
      <el-option label="上映日期升序" value="releaseDateAsc" />
      <el-option label="上映日期降序" value="releaseDateDesc" />
    </el-select>

    <!-- 没有搜索结果时显示提示信息和返回主页按钮 -->
    <div v-if="movies.length === 0" class="no-results">
      <el-card>
        <div class="no-results-message">
          <p>没有搜索结果...</p>
          <el-button @click="goToIndex" type="primary">返回主页</el-button>
        </div>
      </el-card>
    </div>

    <el-row :gutter="20">
      <el-col :span="6" v-for="movie in pagedMovies" :key="movie.id">
        <!-- 使用 router-link 进行跳转 -->
        <router-link :to="{ name: 'Movie', params: { id: movie.id } }">
          <el-card :body-style="{ padding: '20px', height: '100%' }" class="movie-card">
            <img :src="movie.imageSrc" class="movie-poster" />
            <div class="movie-title-container">
              {{ movie.title }}
            </div>

            <div class="movie-info-container">
              评分：{{ movie.rating }}
              <br />
              上映日期：{{ movie.releaseDate.slice(0, 10) }}
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>

    <el-pagination
      v-if="movies.length > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="movies.length"
      @current-change="handlePageChange"
      class="pagination"
    />


  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 电影信息接口
interface Movie {
  id: string
  title: string
  imageSrc: string
  releaseDate: string
  rating: string
}

export default defineComponent({
  name: 'MovieList',
  props: {
    movies: {
      type: Array as () => Movie[],
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    const currentPage = ref(1)
    const pageSize = ref(8)
    const sortBy = ref('ratingDesc')

    const sortedMovies = computed(() => {
      let sorted = [...props.movies];
      switch (sortBy.value) {
        case 'ratingAsc':
          sorted = sorted.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
          break;
        case 'ratingDesc':
          sorted = sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
        case 'releaseDateAsc':
          sorted = sorted.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
          break;
        case 'releaseDateDesc':
          sorted = sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
          break;
      }
      return sorted;
    })

    const pagedMovies = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return sortedMovies.value.slice(start, end)
    })

    const handlePageChange = (page: number) => {
      currentPage.value = page
    }

    const goToIndex = () => {
      router.push({ name: 'Index' })
    }

    return {
      currentPage,
      pageSize,
      sortBy,
      sortedMovies,
      pagedMovies,
      handlePageChange,
      goToIndex
    }
  }
})
</script>

<style scoped>
.sort-select {
  margin-bottom: 20px;
}

.movie-list {
  padding: 20px;
}

.movie-card {
  display: flex;
  margin-bottom: 10px;
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 10px;
}

.movie-title-container {
  height: 100px;
  font-size: 20px;
  font-weight: bold;
}

.movie-info-container {
  margin-top: 10px;
}

.pagination {
  margin-top: 20px;
}
</style>