<template>
  <div class="movie-intro">
    <div class="movie-content">
      <div class="movie-photo">
        <img :src="movie.photoUrl" :alt="movie.title" />
      </div>
      <div class="movie-details">
        <h2>{{ movie.title }}</h2>
        <p><strong>导演:</strong> {{ movie.director }}</p>
        <p><strong>演员:</strong> {{ movie.actor }}</p>
        <p><strong>上映日期:</strong> {{ movie.releaseDate }}</p>
        <p><strong>评分:</strong> {{ movie.rating }}</p>
        <p><strong>语言:</strong> {{ movie.language }}</p>
        <p><strong>时长:</strong> {{ movie.duration }}</p>
        <p><strong>电影编号:</strong> {{ movieId }}</p>
      </div>
    </div>
    <p class="movie-description"><strong>电影简介:</strong> <br>{{ movie.text }}</p>
    <div class="movie-comments">
      <hr class="movie-separator" />
      <h2>热门影评</h2>
      <div v-for="review in reviews" :key="review.review_id" class="review-block">
        <div class="user-review-row">
          <p><strong>用户:</strong> {{ review.userId }}</p>
          <div class="review-stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.round(review.score) }">★</span>
            <span class="review-score">({{ review.score }})</span>
          </div>
        </div>
        <p class="review-time">{{ formatDate(review.reviewDate) }}</p>
        <p class="review-comments">{{ review.text }}</p>
      </div>
    </div>
    <button @click="toggleShowReviewModal" class="review-open-modal">写评论</button>
    <div v-if="showReviewModal" class="modal">
      <div class="modal-content">
        <h2>写评论</h2>
        <input v-model="userName" type="text" placeholder="Your name" class="review-input" />
        <div class="rating">
          <input v-model.number="newReview.score" value="5" name="rate" id="star5" type="radio">
          <label title="5 stars" for="star5"></label>
          <input v-model.number="newReview.score" value="4" name="rate" id="star4" type="radio">
          <label title="4 stars" for="star4"></label>
          <input v-model.number="newReview.score" value="3" name="rate" id="star3" type="radio">
          <label title="3 stars" for="star3"></label>
          <input v-model.number="newReview.score" value="2" name="rate" id="star2" type="radio">
          <label title="2 stars" for="star2"></label>
          <input v-model.number="newReview.score" value="1" name="rate" id="star1" type="radio">
          <label title="1 star" for="star1"></label>
        </div>
        <textarea v-model="newReview.text" placeholder="Write your comments here..." class="review-textarea"></textarea>
        <div class="modal-actions">
          <button @click="submitReview" class="review-submit">Submit</button>
          <button @click="showReviewModal = false" class="review-cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useStore } from '@/store/index.ts';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "MovieIntro",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const movieId = props.id;
    const user = useStore();
    const userName = user.userName;
    const userId = user.userId;
    return {
      movieId,
      userName,
      userId,
    }
  },
  data() {
    return {
      movieId: this.id,
      movie: {}, // 动态绑定后端返回的电影信息
      reviews: [], // 动态绑定后端返回的影评信息
      newReview: {
        review_id:"",
        userId: "",
        reviewDate:"",
        score: "",
        text: "",
        movie_id: this.movieId,  // 新增的电影 ID
      },
      showReviewModal: false,
    };
  },
  created() {
    this.fetchMovieData();
    this.fetchMovieReview();
  },
  methods: {
    // 获取当前时间并格式化
    getCurrentDate() {
      const date = new Date();
      return date.toISOString(); // ISO 8601 格式，例如：2024-12-15T10:30:00.000Z
    },
    formatDate(dateString) {
      const date = new Date(dateString); // 创建日期对象
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      };
      return date.toLocaleDateString('en-US', options); // 格式化日期
    },
    toggleShowReviewModal() {
      if (!this.userName) {
        alert("请先登录后再写评论！");
        this.$router.push({ name: "Login" })
        return;
      }
      this.showReviewModal = true
    },
    async fetchMovieData() {
      try {
        const response = await axios.post("http://localhost:8080/api/details", {
          movie_id: this.movieId, // 示例电影 ID
        });

        // 检查后端响应内容
        if (response.data.movie && response.data.movie.length > 0) {
          this.movie = response.data.movie[0]; // 获取返回的第一个电影对象
          this.movie.photoUrl = response.data.movie[0].imageSrc; // 确保字段映射正确
        } else {
          this.movie = null;
        }
        this.message = response.data.message || "No data found"; // 显示后端消息
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
        this.message = "Failed to fetch movie data.";
      }
    },
    async fetchMovieReview() {
      try {
        const response = await axios.post("http://localhost:8080/api/reviews", {
          movie_id: this.movieId, // 示例电影 ID
        });

        // 检查后端响应内容
        if (response.data.review && response.data.review.length > 0) {
          this.reviews = response.data.review; // 正确处理返回的影评数组
        } else {
          this.reviews = [];
        }
        this.message = response.data.message || "No data found"; // 显示后端消息
      } catch (error) {
        console.error("Failed to fetch review data:", error);
        this.message = "Failed to fetch review data.";
      }
    },
    // 提交影评的方法
    async submitReview() {
      if (!this.userName || !this.newReview.score || !this.newReview.text) {
        alert("请填写所有必填字段后再提交！");
        return;
      }

      this.newReview.userId = this.userId;
      this.newReview.reviewDate = this.getCurrentDate();
      this.newReview.movie_id = this.movieId;
      console.log("准备发送的数据:", this.newReview); // 打印发送的数据

      try {
        const response = await axios.post("http://localhost:8080/api/new_review", this.newReview);

        if (response.data === "插入成功") {
          this.reviews.push({ ...this.newReview });
          this.newReview = { review_id: "", userId: "", score: "", text: "", movie_id: this.movieId, reviewDate: "" };
          this.showReviewModal = false;
        } else {
          alert("提交失败，请检查输入！");
        }
      } catch (error) {
        console.error("提交影评时发生错误:", error);
      }
    }

  },
})
</script>

<style scoped>
@import '@/css/score.css';
@import "@/css/model.css";
@import "@/css/movie.css";
@import "@/css/review.css";
</style>