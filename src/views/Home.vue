<template>
    <div class="home-page">
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <img src="../assets/logo.svg" alt="logo" class="w-50"/>
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
        class="btn btn-outline-primary mt-5 mb-5 mx-auto d-block"
        @click="loadMorePage" v-if="!isLastPage"
      >
        加载更多
      </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted } from 'vue';
    import ColumnList from '../components/ColumnList.vue';
    import { useStore } from 'vuex';
    import { GlobalDataProps} from '../store';
    import useLoadMorePage from '../hooks/useLoadMorePage';

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
        const { loadMorePage, isLastPage } = useLoadMorePage('fetchColumns', total, {currentPage: (currentPage.value ? currentPage.value + 1 : 2), pageSize: 3});

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