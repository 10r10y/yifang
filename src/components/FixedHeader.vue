<template>
    <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
        <router-link class="navbar-brand" to="/">一方</router-link>

        <!-- 未登录 -->
        <ul v-if="!user.isLogin" class="list-inline mb-0">
            <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link></li>
            <li class="list-inline-item"><router-link to="/signin" class="btn btn-outline-light my-2">注册</router-link></li>
        </ul>
        <!-- 已登录 -->
        <ul v-if="user.isLogin" class="list-inline mb-0">
            <li class="list-inline-item">
                <Dropdown :title="`你好 ${user.nickName}`">
                    <DropdownItem><router-link to="/create" class="dropdown-item">新建文章</router-link></DropdownItem>
                    <DropdownItem><router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link></DropdownItem>
                    <DropdownItem><router-link to="/edit/user" class="dropdown-item">编辑资料</router-link></DropdownItem>
                    <DropdownItem><router-link to="/" @click="logOut" class="dropdown-item">退出登陆</router-link></DropdownItem>
                </Dropdown>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { useStore } from 'vuex';
    import Dropdown from './Dropdown.vue';
    import DropdownItem from './DropdownItem.vue';
    import { UserProps } from '../store'
    import router from '../router';

    export default defineComponent({
        name: 'FixedHeader',
        props: {
            user: {
                type: Object as PropType<UserProps>,
                required: true
            }
        },
        components: {
            Dropdown,
            DropdownItem
        },
        setup(){
            const store = useStore();

            const logOut = () => {
                store.commit('logOut');
            }
            
            return {
                logOut
            }
        }
    })
</script>

<style scoped>

</style>