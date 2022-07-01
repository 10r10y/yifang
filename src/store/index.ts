import { createStore } from 'vuex';
import axios from 'axios';

interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number;
    columnId?: string;
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
export interface GlobalDataProps {
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}

const store = createStore<GlobalDataProps>({
    state: {
        columns: [],
        posts: [],
        user: { isLogin: true, name: 'Cricle', columnId: '1' }
    },
    // 异步操作需要放到 actions
    actions: {
        async fetchColumns(context) {
            const { data } = await axios.get('/columns');
            context.commit('fetchColumns', data);
            /* axios.get('columns').then(resp => {
                // commit: actions -> mutations
                context.commit('fetchColumns', resp.data)
            }) */
        },
        // 获取专栏内部信息，包括 posts 列表
        fetchColumn({ commit }, cid) {      // { commit } 直接从 context 中取出 commit 方法
            axios.get(`columns/${cid}`).then(resp => {
                commit('fetchColumn', resp.data)
            })
        },
        // 获取专栏文章列表文章
        fetchPosts({ commit }, cid) {
            axios.get(`columns/${cid}/posts`).then(resp => {
                commit('fetchPosts', resp.data);
            })
        },

    },
    mutations: {
        login(state) {
            state.user = { ...state.user, isLogin: true, name: 'Circle'}
        },
        createPost(state, newPost){
            state.posts.push(newPost);
        },
        fetchColumns(state, rawData){
            state.columns = rawData.data.list;
        },
        fetchColumn(state, rawData){
            state.columns = [rawData.data];
        },
        fetchPosts(state, rawData){
            state.posts = rawData.data.list
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