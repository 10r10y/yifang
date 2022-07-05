import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import Login from './views/Login.vue';
import ColumnDetail from './views/ColumnDetail.vue';
import CreatePost from './views/CreatePost.vue';
import store from './store';
import SignIn from './views/SignIn.vue';
import axios from 'axios';
import PostDetail from './views/PostDetail.vue';

const routerHistory = createWebHistory();

const router = createRouter({
    history: routerHistory,
    routes:[
        {
            path: '/',
            name: 'home',
            component: Home
        },
        // 注册
        {  
            path: '/signin',
            name: 'signin',
            component: SignIn,
            meta: {
                
            }
        },
        // 登录
        {   // 如果已登录，重定向为首页
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                redirectAlreadyLogin: true
            }
        },
        // 专栏
        {
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        },
        // 文章
        {
            path: '/post/:id',
            name: 'post',
            component: PostDetail
        },
        // 创建文章
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
    /* if(to.meta.requiredLogin && !store.state.user.isLogin){
        // 如果要去创建，且未登陆，重定向为登陆页
        next(`/login`);
    } else if(to.meta.redirectAlreadyLogin && store.state.user.isLogin){
        // 如果要去登陆，且已经登陆，重定向为主页
        next(`/`);
    } else {
        next();
    } */
    const { user, token } = store.state;
    const { requiredLogin, redirectAlreadyLogin } = to.meta;

    // 已经登陆
    if(user.isLogin) {
        // 如果要去登陆页
        if(redirectAlreadyLogin) {
            next('/');
        } else {
            next();
        }
    } 
    // 未登录或刷新页面
    else {
        // 如果有 token
        if(token) {
            // 需要发请求获取用户信息
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            store.dispatch('fetchCurrentUser').then(() => {
                if (redirectAlreadyLogin) {
                    next('/');
                } else{
                    next();
                }
            }).catch(e => {
                // token 获取用户信息失败，清除 token， 跳转至登陆页面
                console.error(e)
                store.commit('logOut');
                next('login')
            });
        } 
        // 如果没有 token
        else {
            // 如果要去 create
            if(requiredLogin) {
                next('login');
            } else{
                next();
            }
        }
    }
});

export default router;