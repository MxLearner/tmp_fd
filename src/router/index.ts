import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/login.vue';

export const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'index',
        path: '/index',
        component: () => import('../pages/index.vue')
    }
]
const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createWebHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    next();
});

export default router;