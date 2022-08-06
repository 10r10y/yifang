<template>
    <nav class="sticky-top navbar navbar-expand-sm navbar-light border-bottom">
        <!-- 自适应容器 -->
        <div class="container">
            <!-- Logo & Title -->
            <router-link class="navbar-brand" to="/">
                <img src="../assets/logoShort.png" height="36">
                <span class="ms-2 title">一方</span>
            </router-link>

            <!-- 未登录 -->
            <button v-if="!currentUser.isLogin" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div v-if="!currentUser.isLogin" class="collapse navbar-collapse" id="navmenu">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><router-link to="/login" class="nav-link ms-4 -me-4">登陆</router-link></li>
                    <li class="nav-item"><router-link to="/signin" class="nav-link ms-4">注册</router-link></li>
                </ul>
            </div>
            
            <!-- 已登录 -->
            <ul v-if="currentUser.isLogin" class="list-inline mb-0">
                <li class="list-inline-item">
                    <Dropdown :user="currentUser">
                        <template #show>
                            <img v-if="!currentUser.avatar" src="../assets/avatar.jpg" width="36" height="36" class="avatar rounded-circle me-2">
                            <img v-else :src="currentUser.avatar.url" width="36" height="36" class="avatar rounded-circle me-2">
                        </template>
                        <DropdownItem><router-link to="/create" class="dropdown-item">新建文章</router-link></DropdownItem>
                        <DropdownItem><router-link :to="`/column/${currentUser.column}`" class="dropdown-item">我的专栏</router-link></DropdownItem>
                        <DropdownItem><router-link to="/edit/user" class="dropdown-item">编辑资料</router-link></DropdownItem>
                        <DropdownItem><router-link to="/" @click="logOut" class="dropdown-item">退出登陆</router-link></DropdownItem>
                    </Dropdown>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script lang="ts">
    import { defineComponent, computed} from 'vue';
    import { useStore } from 'vuex';
    import Dropdown from './Dropdown.vue';
    import DropdownItem from './DropdownItem.vue';

    export default defineComponent({
        name: 'FixedHeader',
        components: {
            Dropdown,
            DropdownItem
        },
        setup(){
            const store = useStore();
            const currentUser = computed(() => store.state.user);

            const logOut = () => {
                store.commit('logOut');
            }
            
            return {
                currentUser,
                logOut
            }
        }
    })
</script>

<style scoped>
    .navbar {
        padding: 0;
        background-color: #fff;
    }
    .title {
        font-size: 16px;
    }
</style>