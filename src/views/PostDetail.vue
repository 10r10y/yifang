<template>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
        <div class="img-show">
            <img :src="currentImgUrl" alt="currentImgUrl" class="rounded-lg img-fluid my-4" v-if="currentImgUrl">
        </div>
        <h2 class="mb-4">{{currentPost.title}}</h2>
        <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
            <div class=" col-12 col-md-6">
                <AuthorProfile v-if="typeof currentPost.author === 'object'"  :author="currentPost.author"></AuthorProfile>
            </div>
            <span class="text-muted col text-right font-italic block">发表于 {{currentPost.createdAt}}</span>
        </div>  
        
        <div v-html="currentHTML"></div>
        <div v-if="showEditArea" class="btn-group mt-5">
            <router-link :to="`/create?id=${currentPost._id}`" type="button" class="btn btn-primary">编辑</router-link>
            <button type="button" class="btn btn-danger">删除</button>
        </div>
    </article>
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import { PostProps, ImageProps, UserProps } from '../store'
    import MarkdownIt from 'markdown-it';

    // 组件
    import AuthorProfile from '../components/AuthorProfile.vue';

    

    export default defineComponent({
        name: 'PostDetail',
        components: {
            AuthorProfile
        },
        setup() {
            const store = useStore();
            const route = useRoute();
            const postId = route.params.id;
            
            onMounted(() => {
                store.dispatch('fetchPost', postId);
            });

            const currentPost = computed<PostProps>(()=>{
                return store.getters.getPostById(postId);
            })
            const currentImgUrl = computed(() => {
                if(currentPost.value && currentPost.value.image && typeof currentPost.value.image !== 'string') {
                    const { image } = currentPost.value
                    return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
                } else {
                    return undefined;
                }
            })
            
            // md to html
            const md = new MarkdownIt();
            const currentHTML = computed(() => {
                const { content, isHTML } = currentPost.value;
                if(currentPost.value && content) {
                    return isHTML ? content : md.render(content);
                } else {
                    return '';
                }
            });

            // 编辑删除权限
            const showEditArea = computed(() => {
                const { isLogin, _id } = store.state.user;
                // 首先判断存在
                if( currentPost.value && currentPost.value.author && isLogin) {
                    // 类型断言为唯一一种
                    const postAuthor = currentPost.value.author as UserProps;
                    return postAuthor._id === _id;
                } else {
                    return false;
                }
            })

            return {
                currentHTML,
                currentPost,
                currentImgUrl,
                showEditArea
            }
        }
    })
</script>

<style scoped>
    .img-show {
        height: 100%;
    }
    .img-show img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>