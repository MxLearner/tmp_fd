import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/views/Index.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import SearchResults from '@/views/SearchResults.vue';
import Movie from '@/views/Movie.vue';
import Profile from '@/views/Profile.vue';
import Forum from '@/views/Forum.vue';
import CommunityForum from '@/components/CommunityForum.vue';  // 引入 CommunityForum.vue

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/searchResults',
        name: 'SearchResults',
        component: SearchResults
    },
    {
        path: '/movie/:id',
        name: 'Movie',
        component: Movie,
        props: true
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/forum',
        name: 'Forum',
        component: Forum
    },
    {
        path: '/communityforum', // 动态路由，接受 post
        name: 'CommunityForum',
        component: CommunityForum,

    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
