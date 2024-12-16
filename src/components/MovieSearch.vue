<template>
  <div class="movie-search">
    <el-input
      v-model="query"
      placeholder="请输入电影名称"
      @input="onSearchInput"
      clearable
      style="width: 300px"
    />
    <el-button @click="handleSearch" type="primary" icon="el-icon-search">搜索</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MovieSearch',
  setup() {
    const query = ref('')
    const router = useRouter()

    const handleSearch = () => {
      if (query.value.trim()) {
        router.push({ name: 'SearchResults', query: { q: query.value } })
      }
    }

    const onSearchInput = () => {
      // 可以做一些即时的输入过滤操作
    }

    return {
      query,
      handleSearch,
      onSearchInput
    }
  }
})
</script>

<style scoped>
.movie-search {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
</style>