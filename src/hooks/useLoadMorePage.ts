import { useStore } from 'vuex';
import { ref, computed, ComputedRef} from 'vue';

interface LoadParams {
    currentPage: number;
    pageSize: number;
}
const useLoadMorePage = (actionName: string, total: ComputedRef<number>, 
    params: LoadParams = { currentPage: 2, pageSize: 5}) => {
        const store = useStore();
        const currentPage = ref(params.currentPage);
        // 发送请求时需要的对象
        const requestParams = computed(() => ({
            currentPage: currentPage.value,
            pageSize:params.pageSize
        }))
        // 暴露方法
        // 1.请求更多页
        const loadMorePage = () => {
            store.dispatch(actionName, requestParams.value).then(() => {
                currentPage.value ++;
            })
        }
        // 2.是否到底
        const isLastPage = computed(() => {
            return Math.ceil(total.value / params.pageSize) < currentPage.value;
        })

        return  {
            loadMorePage,
            isLastPage,
            currentPage
        }
}

export default useLoadMorePage;