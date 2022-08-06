<template>
    <div class="column-detail-page w-75 mx-auto container-lg">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img :src="column.avatar && column.avatar.fitUrl" class="rounded-circle border">
            </div>
            <div class="col-9">
                <h4>{{column.title}}</h4>
                <p class="text-muted">{{column.description}}</p>
            </div>
        </div>
        <PostList :list="list"></PostList>
        <button v-if="!isLastPage"
            @click="loadMorePage"
            class="btn btn-outline-primary mt-2 mb-5 mx-auto d-block"
        >
            获取更多
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';  // 获取路由信息钩子
    import store, { ColumnProps } from '../store';
    import PostList from '../components/PostList.vue';
    import { addColumnAvatar } from '../hooks/useHandleImg';
    import useLoadMorePage from '../hooks/useLoadMorePage';
    

    export default defineComponent({
        name: 'ColumnDetail',
        components:{
            PostList
        },
        setup() {
            const route = useRoute();
            let currentId = ref(route.params.id);

            onMounted(() => {
                store.dispatch('fetchColumn', currentId.value);
                store.dispatch('fetchPosts', { cid: currentId.value });
            })
            
            // 检测变化
            watch(() => route.params, (toParams) => {
                // 确保要变化的路径是进入到用户的专栏
                if ((toParams && toParams.id) === store.state.user.column) {
                    // 重新发送请求，在 store 中有对应的缓存设置
                    store.dispatch('fetchColumn', toParams.id);
                    store.dispatch('fetchPosts', toParams.id);
                    // 重新赋值，这样 computed 会变化
                    currentId.value = toParams.id;
                }
            })

            const column = computed(() => {
                const selectColumn = store.getters.getColumnById(currentId.value) as ColumnProps | undefined;
                if (selectColumn) {
                    addColumnAvatar(selectColumn, 100, 100);
                }
                return selectColumn;
            });
            const list = computed(() => store.getters.getPostsByCid(currentId.value));

            // 获取更多
            const total = computed(() => store.getters.getPostsTotalByCid(currentId.value));
            const currentPage = computed(() => store.getters.getPostsCurrentPageByCid(currentId.value)); 
            const { loadMorePage, isLastPage} = useLoadMorePage('fetchPosts', total, {currentPage: currentPage.value, cid: currentId.value, pageSize: 3});

            return {
                column,
                list,
                isLastPage,
                loadMorePage
            }
        }
    })
</script>

<style scoped>
.column-detail-page {
    max-width: 720px;
}
</style>