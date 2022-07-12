import { useStore } from 'vuex';
import { ref, computed, ComputedRef} from 'vue';

interface LoadParams {
    currentPage?: number;
    pageSize?: number;
    [key: string]: any;
}
const useLoadMorePage = (actionName: string, total: ComputedRef<number>, 
    params: LoadParams = {}) => {
        const store = useStore();
        const currentPage = ref(params.currentPage || 1);
        const pageSize = ref(params.pageSize || 5);
        // 发送请求时需要的对象
        const requestParams = computed(() => {
            return {
                ...params,
                currentPage: currentPage.value + 1
            }
            
        })
        // 暴露方法
        // 1.请求更多页
        const loadMorePage = () => {
            store.dispatch(actionName, requestParams.value).then(() => {
                currentPage.value ++;
            })
        }
        // 2.是否到底
        const isLastPage = computed(() => {
            return Math.ceil(total.value / pageSize.value) < currentPage.value;
        })

        return  {
            loadMorePage,
            isLastPage,
            currentPage
        }
}

export default useLoadMorePage;