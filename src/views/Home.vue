<template>
    <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，一方天地</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
      @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted } from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import ColumnList from '../components/ColumnList.vue';
    import { useStore } from 'vuex';
    import { GlobalDataProps, ResponseType } from '../store';
    import createMessage from '../components/CreatMessage';
    import useLoadMorePage from '../hooks/useLoadMorePage';
import { stringTypeAnnotation } from '@babel/types';

    export default defineComponent({
    name: 'App',
    components: {
        ColumnList
    },
    setup(){
        const store = useStore<GlobalDataProps>();
        // 文章总数，用于更多页
        const total = computed(() => store.state.columns.total);
        const currentPage = computed(() => store.state.columns.currentPage);

        // 发送请求获取专栏列表
        onMounted(() => {
          store.dispatch('fetchColumns', { pageSize: 3});
        })

        const list = computed(() => store.getters.getColumns);
        const { loadMorePage, isLastPage } = useLoadMorePage('fetchColumns', total, {pageSize: 3, currentPage: (currentPage.value ? currentPage.value + 1 : 2)});

        return {
            list,
            isLastPage,
            loadMorePage
        }
    }
    })
</script>

<style scoped>

</style>