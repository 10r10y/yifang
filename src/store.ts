import { Commit, createStore } from 'vuex';
import axios from 'axios';

export interface UserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: number;
    column?: string;
    email?: string;
}
interface ImageProps {
    _id?: number;
    url?: string;
    createdAt?: string;
}
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}
export interface PostProps {
    _id: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: ImageProps;
    createdAt: string;
    column: string;
}
export interface GlobalErrorProps {
    status: boolean;
    message ?: string;
}
export interface GlobalDataProps {
    token: string;
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
    loading: boolean;
    error: GlobalErrorProps;
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await axios.get(url);
    commit (mutationName, data);
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await axios.post(url, payload);
    commit (mutationName, data);
    return data;
}

const store = createStore<GlobalDataProps>({
    // 初始化数据
    state: {
        token: localStorage.getItem('token') || '',
        columns: [],
        posts: [],
        user: { isLogin: false },
        loading: false,
        error: { status: false}
    },
    actions: {
        fetchColumns({ commit }) {
            getAndCommit('/columns', 'fetchColumns', commit);
        },
        // 获取专栏内部信息
        fetchColumn({ commit }, cid) { 
            getAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
        },
        // 获取专栏文章列表文章
        fetchPosts({ commit }, cid) { 
            getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit);
        },
        
        login({ commit }, payload) {
            return postAndCommit('/user/login', 'login', commit, payload);
        },
        // 获取当前用户信息
        fetchCurrentUser({ commit }) {
            getAndCommit('/user/current', 'fetchCurrentUser', commit);
        },

        // 组合 action：登录成功后获取用户信息
        loginAndFetch({dispatch}, loginData) {
            return dispatch('login', loginData).then(()=> {
                return dispatch('fetchCurrentUser');
            })
        }
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
            state.user.isLogin = false;
        },
        createPost(state, newPost) {
            state.posts.push(newPost);
        },
        fetchColumns(state, rawData) {
            state.columns = rawData.data.list;
        },
        fetchColumn(state, rawData) {
            state.columns = [rawData.data];
        },
        fetchPosts(state, rawData) {
            state.posts = rawData.data.list
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
        getColumnById:(state) => (id: string) => {
            return state.columns.find(c => c._id === id);
        },
        getPostsByCid:(state) => (cid: string) => {
            return state.posts.filter(post => post.column === cid)
        }
    }
    
})

export default store;