<template>
  <div class="post-list-section">
    <h2>所有帖子</h2>

    <!-- 搜索框 -->
    <input
        v-model="searchQuery"
        @input="filterPosts"
        type="text"
        placeholder="搜索帖子..."
        class="search-input"
    />

    <!-- 帖子列表 -->
    <div class="post-list">
      <div v-for="post in filteredPosts" :key="post.id" class="post-item" @click="goToPost(post)">
        <h3>{{ post.title }}</h3>
        <p>{{ post.text }}</p>
        <p><strong>用户:</strong> {{ post.userId }}</p>
        <p><strong>发布日期:</strong> {{ formatDate(post.post_date) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "PostList",
  data() {
    return {
      posts: [], // 所有帖子
      filteredPosts: [], // 搜索过滤后的帖子
      searchQuery: "", // 搜索内容
    };
  },
  created() {
    this.fetchPosts(); // 获取帖子
  },
  methods: {
    // 获取所有帖子
    async fetchPosts() {
      try {
        const response = await axios.get("http://localhost:9000/api/post");
        this.posts = response.data.post || [];
        console.log(this.posts); // 调试输出
        this.filteredPosts = this.posts; // 初始化时显示所有帖子
      } catch (error) {
        console.error("获取帖子失败:", error);
      }
    },

    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      };
      return date.toLocaleDateString("en-US", options);
    },

    // 搜索过滤帖子
    filterPosts() {
      this.filteredPosts = this.posts.filter(post => {
        return (
            post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            post.text.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },

    // 点击帖子时跳转到 CommunityForum 页面，并传递多个字段
    goToPost(post) {
      console.log('Navigating with params:', {
        postId: post.id,
        postTitle: post.title,
        postText: post.text,
        postDate: post.post_date,
        postUser: post.userId,
        postMovie: post.movie_id,
      });
      this.$router.push({
        name: 'CommunityForum',
        query: {
          postId: post.id,
          postTitle: post.title,
          postText: post.text,
          postDate: post.post_date,
          postUser: post.userId,
          postMovie: post.movie_id,
        },
      });
    }
  },
};
</script>

<style scoped>
.post-list-section {
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.post-list {
  display: flex;
  flex-direction: column; /* 每个帖子在一列中 */
  gap: 20px; /* 帖子之间的间距 */
}

.post-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer; /* 鼠标悬停时显示为可点击 */
}

.post-item h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.post-item p {
  margin-bottom: 10px;
}
</style>
