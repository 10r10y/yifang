<template>
    <div class="post-list">
        <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
            <div class="card-body">
                <router-link :to="`/post/${post._id}`"><h4>{{post.title}}</h4></router-link>
                <div class="row my-3 align-items-center">
                    <div v-if="post.image && (typeof post.image !== 'string')" class="col-3">
                        <img :src="post.image.url" :alt="post.title" class="rounded-lg w-100">
                    </div>
                    <p :class="{'col-9': post.image}">{{post.excerpt}}</p>
                </div>
                <span class="text-muted">{{post.createdAt}}</span>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { PostProps } from '../store';

    export default defineComponent({
        name: 'PostList',
        props: {
            list: {
                required: true,
                type: Array as PropType<PostProps[]>
            }
        }
    })
</script>

<style scoped>

</style>