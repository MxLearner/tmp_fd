<template>
  <div class="forum-section">

    <div class="forum-content">

      <div v-if="showPostModal" class="forum-modal">
        <div class="forum-modal-content">
          <h2>发表帖子</h2>
          <input v-model="newPost.title" type="text" placeholder="帖子标题" class="forum-post-input" />
          <textarea v-model="newPost.text" placeholder="写下你的帖子内容..." class="forum-post-textarea"></textarea>
          <div class="forum-modal-actions">
            <button @click="submitPost" class="forum-submit-button">提交</button>
            <button @click="showPostModal = false" class="forum-cancel-button">取消</button>
          </div>
        </div>
      </div>

      <div class="forum-details">
        <h2>{{ post.postTitle }}</h2>
        <div class="forum-user-row">
          <p><strong>用户:</strong>{{ post.postUser }}</p>
          <p class="forum-timestamp">{{ formatDate(post.postDate) }}</p>
        </div>

      </div>
      <p class="forum-description"><strong>帖子内容:</strong> <br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{{ post.postText }}</p>
    </div>
    <button @click="showPostModal = true" class="forum-post-button">发表帖子</button>
    <div class="forum-comments">
      <hr class="forum-divider" />
      <h2>热门评论</h2>
      <div v-for="comment in comments" :key="comment.review_id" class="forum-comment-block">
        <div class="forum-user-row">
          <p><strong>用户:</strong> {{ comment.userId }}</p>
          <p class="forum-timestamp">{{ formatDate(comment.comment_date) }}</p>
        </div>

        <p class="forum-comment-text">{{ comment.text }}</p>
      </div>
    </div>
    <button @click="showReviewModal = true" class="forum-review-button">写评论</button>
    <div v-if="showReviewModal" class="forum-modal">
      <div class="forum-modal-content">
        <h2>写评论</h2>
        <textarea v-model="newComment.text" placeholder="Write your comments here..." class="forum-review-textarea"></textarea>
        <div class="forum-modal-actions">
          <button @click="submitComment" class="forum-submit-button">提交</button>
          <button @click="showReviewModal = false" class="forum-cancel-button">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useStore } from '@/store/index.ts';
import { useRoute } from 'vue-router';
import {ref} from "vue";

export default {
  name: "CommunityForum",

  setup() {
    const route = useRoute();

    const post = ref({
      postId: route.query.postId || '', // 默认值为空字符串
      postTitle: route.query.postTitle || '',
      postText: route.query.postText || '',
      postDate: route.query.postDate || '',
      postUser: route.query.postUser || '',
      postMovie: route.query.postMovie || '',
    });
    console.log('Post Data:', post.value); // 调试输出传递的数据
    return { post };

  },
  data() {
    const user = useStore();
    return {
      //post: {},
      comments: [],
      newComment: {
        comment_id: "",
        userId: "",
        comment_date: "",
        post_id: "",
        text: "",
      },
      newPost: {
        post_id: "",
        userId: "",
        movie_id: "",
        title: "",
        text: "",
        post_date: "",
      },
      showReviewModal: false,
      showPostModal: false,
    };
  },
  created() {
    console.log(this.post.postTitle);
    //this.fetchPosts();
    this.fetchPostComment();
  },
  methods: {
    getCurrentDate() {
      const date = new Date();
      return date.toISOString();
    },
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
    async submitPost() {
      if (!this.newPost.title || !this.newPost.text) {
        alert("请填写所有必填字段后再提交！");
        return;
      }

      const user = useStore();
      if (!user.userId) {
        alert("用户未登录，请先登录！");
        return;
      }

      this.newPost.userId = user.userId;
      this.newPost.post_date = this.getCurrentDate();
      this.newPost.movie_id = "1";

      try {
        const response = await axios.post("http://localhost:9000/api/post", this.newPost);
        if (response.data.message === "发布成功") {
          alert("帖子已发布！");
          this.showPostModal = false;
          this.newPost = { post_id: "", userId: "", movie_id: "", title: "", text: "", post_date: "" };
          //this.fetchPosts();
        } else {
          alert("发布失败，请稍后重试！");
        }
      } catch (error) {
        console.error("发布帖子时发生错误:", error);
      }
    },

    async fetchPosts() {
      try {
        const response = await axios.get("http://localhost:9000/api/post");

        if (response.data.post && response.data.post.length > 0) {
          this.post = response.data.post[0];
        } else {
          this.post = {};
        }
      } catch (error) {
        console.error("获取帖子列表时发生错误:", error);
      }
    },

    async fetchPostComment() {
      console.log(this.post.postId);
        const response = await axios.post("http://localhost:9000/api/newcomments", {
          post_id: this.post.postId,
        });

        if (response.data.comment && response.data.comment.length > 0) {
          this.comments = response.data.comment;
        } else {
          this.comments = [];
        }
    },
    async submitComment() {
      const user = useStore();

      if (!user.userName || !this.newComment.text.trim()) {
        alert("请填写所有必填字段后再提交！");
        return;
      }
      this.newComment.userId = user.userId;
      this.newComment.post_id = this.post.postId; // 示例值，应动态绑定到当前帖子的 ID
      this.newComment.comment_date = this.getCurrentDate();
      console.log(this.newComment);
      try {
        const response = await axios.post("http://localhost:9000/api/comments", this.newComment);
        if (response.data.message === "评论成功") {
          this.comments.push({ ...this.newComment });
          this.newComment = { comment_id: "", userId: "", post_id: "", text: "", comment_date: "" };
          this.showReviewModal = false;
        } else {
          alert("评论失败，请稍后重试！");
        }
      } catch (error) {
        console.error("提交评论时发生错误:", error);
      }
    },

  },
};
</script>

<style scoped>
@import "@/css/score.css";
@import "@/css/model.css";
@import "@/css/forum.css";
/* 样式定义省略 */
</style>
