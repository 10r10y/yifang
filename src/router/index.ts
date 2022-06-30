import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import ColumnDetail from '../views/ColumnDetail.vue';
import CreatePost from '../views/CreatePost.vue';
import store from '../store/index';

const routerHistory = createWebHistory();

const router = createRouter({
    history: routerHistory,
    routes:[
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {   // 登录页面：如果已登录，重定向为首页
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                redirectAlreadyLogin: true
            }
        },
        {
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        },
        {   // 只有已登录才能创建
            path: '/create',
            name: 'create',
            component: CreatePost,
            meta: {
                requiredLogin: true
            }
        }
    ]
});

// 全局路由守卫
router.beforeEach((to, from, next)=>{
    if(to.meta.requiredLogin && !store.state.user.isLogin){
        // 如果要去创建，且未登陆，重定向为登陆页
        next(`/login`);
    } else if(to.meta.redirectAlreadyLogin && store.state.user.isLogin){
        // 如果要去登陆，且已经登陆，重定向为主页
        next(`/`);
    } else {
        next();
    }
});

export default router;