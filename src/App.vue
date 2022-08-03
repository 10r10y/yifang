<template>
  <div class="container-fluid px-0 d-flex flex-column" style="min-height: 100vh;">
    <FixedHeader></FixedHeader>
    <Loading v-if="isLoading" text="正在努力加载中..." background="rgba(255, 255, 255, 0.8)"></Loading>
    <div class="container pt-4 pb-4">
      <router-view></router-view>
    </div>
    <footer class="text-center py-4 text-secondary bg-light mt-auto">
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
  import { defineComponent, computed, watch } from 'vue';
  import './custom.scss';  // bootstrap 全局引入
  import 'bootstrap/dist/js/bootstrap.min.js';  
  // 引入插件的使用
  import { useStore } from 'vuex';
  // 引入各组件
  import FixedHeader from './components/FixedHeader.vue';
  import Loading from './components/Loading.vue';

  // 引入函数
  import createMessage from './components/CreatMessage';

  // 引入类型
  import { GlobalDataProps } from './store';

  export default defineComponent({
    name: 'App',
    components: {
      FixedHeader,
      Loading,
    },
    setup(){
      const store = useStore<GlobalDataProps>();
      const isLoading = computed(()=> store.state.loading);
      const error = computed(() => store.state.error);

      watch(() => error.value.status, () => {
        const {status, message } = error.value;
        if(status && message) {
          createMessage(message, 'error', 2000);
        }
      })

      return {
        isLoading,
        error,
      }
    }
  })
</script>

<style>
  
</style>
