<template>
    <Modal title="删除文章" 
        :visible="modalIsVisible" 
        @modal-on-close="modalIsVisible = false" 
        @modal-on-confirm="deleteAndHide"
    >
        <p>确定要删除这篇文章吗？</p>
    </Modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
        <div class="img-show my-4">
            <img :src="currentImgUrl" alt="currentImgUrl" class="rounded-lg img-fluid" v-if="currentImgUrl">
        </div>
        <h2 class="mb-4">{{currentPost.title}}</h2>
        <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
            <div class=" col-12 col-md-6">
                <AuthorProfile v-if="typeof currentPost.author === 'object'"  :author="currentPost.author"></AuthorProfile>
            </div>
            <span class="text-muted col text-end font-italic block ms-2">发表于 {{currentPost.createdAt}}</span>
        </div>  
        
        <div v-html="currentHTML"></div>
        <div v-if="showEditArea" class="btn-group mt-5">
            <router-link :to="`/create?id=${currentPost._id}`" type="button" class="btn btn-primary">编辑</router-link>
            <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
        </div>
    </article>
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { PostProps, ImageProps, UserProps, ResponseType } from '../store'
    import { marked } from 'marked';

    // 组件
    import AuthorProfile from '../components/AuthorProfile.vue';
    import Modal from '../components/Modal.vue';
    import createMessage from '../components/CreatMessage';
    

    export default defineComponent({
        name: 'PostDetail',
        components: {
            AuthorProfile,
            Modal
        },
        setup() {
            const store = useStore();
            const route = useRoute();
            const router = useRouter();
            const modalIsVisible = ref(false);
            const postId = route.params.id;
            
            onMounted(() => {
                store.dispatch('fetchPost', postId);
            });

            const currentPost = computed<PostProps>(()=>{
                return store.getters.getPostById(postId);
            })
            const currentImgUrl = computed(() => {
                if(currentPost.value && currentPost.value.image && typeof currentPost.value.image !== 'string') {
                    const { image } = currentPost.value;
                    return (image as ImageProps).url;
                } else {
                    return undefined;
                }
            })
            
            // md to html
            const currentHTML = computed(() => {
                const { content, isHTML } = currentPost.value;
                if(currentPost.value && content) {
                    return isHTML ? content : marked.parse(content);
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

            // 删除
            const deleteAndHide = () => {
                modalIsVisible.value = false;
                store.dispatch('deletePost', postId).then((rawData: ResponseType<PostProps>) => {
                    createMessage('删除成功，2秒后跳转专栏首页', 'success', 2000);
                    setTimeout(()=>{
                        router.push(`/column/${rawData.data.column}`)
                    }, 2000);
                })
            }

            return {
                currentHTML,
                currentPost,
                currentImgUrl,
                showEditArea,
                modalIsVisible,
                deleteAndHide
            }
        }
    })
</script>

<style scoped>
    .img-show img{
        width: 100%;
        max-height: 360px;
        height: 100%;
        object-fit: cover;
    }
</style>