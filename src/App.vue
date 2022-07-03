<template>
  <div class="container">
    <FixedHeader :user="currentUser"></FixedHeader>
    <Loading v-if="isLoading" text="正在努力加载中..." background="rgba(255, 255, 255, 0.8)"></Loading>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2022 一方清泉</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted, watch } from 'vue';
  import 'bootstrap/dist/css/bootstrap.min.css';  // bootstrap 全局引入
  // 引入插件的使用
  import { useStore } from 'vuex';
  import axios from 'axios';
  // 引入各组件
  import FixedHeader from './components/FixedHeader.vue';
  import Loading from './components/Loading.vue';

  // 引入函数
  import createMessage from './components/CreatMessage';

  // 引入类型
  import { GlobalDataProps } from './store/index';

  export default defineComponent({
    name: 'App',
    components: {
      FixedHeader,
      Loading,
    },
    setup(){
      const store = useStore<GlobalDataProps>();
      const currentUser = computed(() => store.state.user);
      const isLoading = computed(()=> store.state.loading);
      const token = computed(()=> store.state.token);
      const error = computed(() => store.state.error);

      onMounted(() => {
        // 判断 用户未登录， 且 token 存在
        if(!currentUser.value.isLogin && token.value){
          // 设置 Authorization 头，发送 fetchCurrentUser 请求
          axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
          store.dispatch('fetchCurrentUser');
        }
      });

      watch(() => error.value.status, () => {
        const {status, message } = error.value;
        if(status && message) {
          createMessage(message, 'error', 2000);
        }
      })

      return {
        currentUser,
        isLoading,
        error,
      }
    }
  })
</script>

<style>

</style>
