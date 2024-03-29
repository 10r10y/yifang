import { Commit, createStore } from 'vuex';
import axios , { AxiosRequestConfig } from 'axios';
import arrToObj from './hooks/useArrayToObj';
import objToArray from './hooks/useObjToArray';

export interface UserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    email?: string;
    avatar?: ImageProps;
    description?: string;
}
export interface ImageProps {
    _id?: string;
    url?: string;
    createdAt?: string;
    fitUrl?: string;
}
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}
export interface PostProps {
    _id?: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: ImageProps | string;
    author?: string | UserProps;
    column: string;
    createdAt?: string;
    isHTML?: boolean;
}

// 扁平化后的 columns 和 posts 的泛型类型:
// 将数组变为对象，类似 map ，以 id 为索引， 原本对象为值
interface ListProps<P> {
    [id: string]: P;
}

export interface GlobalErrorProps {
    status: boolean;
    message ?: string;
}
export interface GlobalDataProps {
    token: string;
    columns: {
        data: ListProps<ColumnProps>;
        currentPage: number;
        total: number;
    }
    posts: {
        data: ListProps<PostProps>;
        loadedColumns: ListProps<{
            total?: number;
            currentPage?: number;
        }>;
    }
    user: UserProps;
    loading: boolean;
    error: GlobalErrorProps;
}

// 响应信息接口（上传文件接收的数据类型）
export interface ResponseType<P = Record<string, unknown>> {     // 为 data 设置泛型，默认值为空对象
    code: number;
    msg: string;
    data: P;
}

const asyncAndCommit = async (
        url: string, mutationName: string, commit: Commit, 
        config: AxiosRequestConfig = { method: 'get'}, extraData?: any) => {
    const { data } = await axios(url, config);
    if(extraData) {
        commit(mutationName, { data, extraData})
    } else {
        commit(mutationName, data);
    }
    return data;
}

const store = createStore<GlobalDataProps>({
    // 初始化数据
    state: {
        token: localStorage.getItem('token') || '',
        columns: { 
            data: {}, 
            currentPage: 0, 
            total: 0
        },
        posts: { 
            data: {}, 
            loadedColumns: {}
        },
        user: { isLogin: false },
        loading: false,
        error: { status: false}
    },
    actions: {
        // 获取专栏列表
        fetchColumns({ state, commit }, params = {}) {
            // 从 params 中获取页数和每页展示数，默认值为 1 和 6
            const { currentPage = 1, pageSize = 6} = params;
            // 小于时发送
            if(state.columns.currentPage < currentPage) {
                return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit);
            }
        },
        // 获取专栏内部信息
        fetchColumn({ state, commit }, cid) { 
            if(!state.columns.data[cid]) {
                return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
            }
        },
        // 获取专栏文章列表文章
        fetchPosts({ state, commit }, params = {}) { 
            const { cid, currentPage = 1, pageSize = 2 } = params;
            const { loadedColumns } = state.posts;
            const loadedCurrentPage = (loadedColumns[cid] && loadedColumns[cid].currentPage) || 0;
            if(!Object.keys(loadedColumns).includes(cid) || loadedCurrentPage < currentPage) {
                return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
                'fetchPosts', commit, { method: 'get' }, cid);
            }
        },
        // 更新专栏信息
        updateColumn({ commit }, { id, payload}) {
            return asyncAndCommit(`columns/${id}`, 'updateColumn', commit, {
                method: 'patch',
                data: payload
            });
        },
        // 获取文章内部信息
        fetchPost({ state, commit }, id) {
            // 需要判断有无 content， 因为获取列表时不返回 content 等详细内容
            const currentPost = state.posts.data[id];
            if(!currentPost || !currentPost.content){
                return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit);
            } else {    // 因为编辑页面获取数据是在then后调用，所有需要返回一个 Promise
                return Promise.resolve({ data: currentPost })
            }
        },
        // 更新文章内容
        updatePost({ commit }, { id, payload}) {
            return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
                method: 'patch',
                data: payload
            })
        },
        // 删除文章
        deletePost({ commit }, id) {
            return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
        },
        login({ commit }, payload) {
            return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload});
        },
        // 获取当前用户信息
        fetchCurrentUser({ commit }) {
            return asyncAndCommit('/user/current', 'fetchCurrentUser', commit);
        },
        // 更新用户信息
        updateUser({ commit }, { id, payload }) {
            return asyncAndCommit(`/user/${id}`, 'updateUser', commit, { method:'patch', data: payload});
        },
        // 组合 action：登录成功后获取用户信息
        loginAndFetch({dispatch}, loginData) {
            return dispatch('login', loginData).then(()=> {
                return dispatch('fetchCurrentUser');
            })
        },

        // 创建文章
        createPost({ commit }, payload) {
            return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload});
        },
    },
    mutations: {
        login(state, rawData) {
            const { token } = rawData.data;
            state.token = token;
            localStorage.setItem('token', token);
            // HTTP 请求的头信息中添加 token
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        },
        logOut(state) {
            // state.user.isLogin = false;
            state.token = '';
            state.user = { isLogin: false };
            localStorage.removeItem('token');
            delete axios.defaults.headers.common.Authorization;
        },
        createPost(state, newPost) {
            // posts[]
            state.posts.data[newPost._id] = newPost;
        },
        fetchColumns(state, rawData) {
            const { data } = state.columns;
            const { list, count, currentPage } = rawData.data;
            state.columns = {
                data: { ...data, ...arrToObj(list)},
                total: count,
                currentPage: currentPage * 1
            }
        },
        fetchColumn(state, rawData) {
            state.columns.data[rawData.data._id] = rawData.data;
        },
        updateColumn(state, data) {
            state.columns.data[data._id] = data;
        },
        fetchPosts(state, {data: rawData, extraData}) { // 解构赋值同时使用别名
            const { data, loadedColumns } = state.posts;
            const { list, count, currentPage } = rawData.data;
            const listData = list as PostProps[];
            state.posts.data = { ...data, ...arrToObj(listData)};
            loadedColumns[extraData] = {
                total: count,
                currentPage
            }
        },
        fetchPost(state, rawData) {
            state.posts.data[rawData.data._id] = rawData.data;
        },
        deletePost(state, { data }) {
            delete state.posts.data[data._id];
        },
        updatePost(state, data) {
            state.posts.data[data._id] = data;
            /* state.posts = state.posts.map(post => {
                if(post._id === data._id) {
                    return data;
                } else {
                    return post;
                }
            }) */
        },
        setLoading(state, status) {
            state.loading = status
        },
        fetchCurrentUser(state, rawData) {
            state.user = {
                isLogin: true,
                ...rawData.data,
            }
        },
        updateUser(state, rawData) {
            state.user = rawData.data
        },
        setError(state, e: GlobalErrorProps) {
            state.error = e;
        }
    },
    getters: {
        getColumns: (state) => {
            return objToArray(state.columns.data).filter(data => data._id !== '5f3e86d62c56ee13bb83096c');
        },
        getColumnById:(state) => (id: string) => {
            return state.columns.data[id];
        },
        getPostsByCid:(state) => (cid: string) => {
            return objToArray(state.posts.data).filter(post => post.column === cid);
        },
        getPostById:(state) => (id: string) => {
            return state.posts.data[id];
        },
        getPostsTotalByCid:(state) => (cid: string) => {
            if(state.posts.loadedColumns[cid])
                return state.posts.loadedColumns[cid].total;
            else
                return 0;
        },
        getPostsCurrentPageByCid:(state) => (cid: string) => {
            if(state.posts.loadedColumns[cid])
                return state.posts.loadedColumns[cid];
            else
                return 0;
        }
    }
    
})

export default store;