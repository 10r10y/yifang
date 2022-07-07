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
    columns: ListProps<ColumnProps>;
    posts: ListProps<PostProps>;
    user: UserProps;
    loading: boolean;
    error: GlobalErrorProps;
}

// 响应信息接口
export interface ResponseType<P = Record<string, unknown>> {     // 为 data 设置泛型，默认值为空对象
    code: number;
    msg: string;
    data: P;
}

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get'}) => {
    const { data } = await axios(url, config);
    commit(mutationName, data);
    return data;
}

const store = createStore<GlobalDataProps>({
    // 初始化数据
    state: {
        token: localStorage.getItem('token') || '',
        columns: {},
        posts: {},
        user: { isLogin: false },
        loading: false,
        error: { status: false}
    },
    actions: {
        // 获取专栏列表
        fetchColumns({ commit }) {
            return asyncAndCommit('/columns', 'fetchColumns', commit);
        },
        // 获取专栏内部信息
        fetchColumn({ commit }, cid) { 
            return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
        },
        // 获取专栏文章列表文章
        fetchPosts({ commit }, id) { 
            return asyncAndCommit(`/columns/${id}/posts`, 'fetchPosts', commit);
        },
        // 获取文章内部信息
        fetchPost({ commit }, id) {
            return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit);
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
            state.posts[newPost._id] = newPost;
        },
        fetchColumns(state, rawData) {
            state.columns = arrToObj(rawData.data.list);
        },
        fetchColumn(state, rawData) {
            state.columns[rawData.data._id] = rawData.data;
        },
        fetchPosts(state, rawData) {
            state.posts = arrToObj(rawData.data.list);
        },
        fetchPost(state, rawData) {
            state.posts[rawData.data._id] = rawData.data;
        },
        deletePost(state, { data }) {
            delete state.posts[data._id];
        },
        updatePost(state, data) {
            state.posts[data._id] = data;
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
        setError(state, e: GlobalErrorProps) {
            state.error = e;
        }
    },
    getters: {
        getColumns: (state) => {
            return objToArray(state.columns);
        },
        getColumnById:(state) => (id: string) => {
            return state.columns[id];
        },
        getPostsByCid:(state) => (cid: string) => {
            return objToArray(state.posts).filter(post => post.column === cid);
        },
        getPostById:(state) => (id: string) => {
            return state.posts[id];
        }
    }
    
})

export default store;