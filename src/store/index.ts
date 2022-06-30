import { createStore } from 'vuex';
import axios from 'axios';

interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number;
    columnId?: number;
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
    content: string;
    image?: string;
    createdTime: string;
    columnId: string;
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
        user: { isLogin: true, name: 'Cricle', columnId: 1 }
    },
    actions: {
        fetchColumns(context) {
            axios.get('/columns').then(resp => {
                context.commit('fetchColumns', resp.data)
            })
        }
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
        }
    }
    
})

export default store;