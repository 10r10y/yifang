<template>
    <div class="user-profile-component">
        <div class="d-flex align-items-center">
            <img :src="fitUrl" :alt="author.nickName" class="rounded-circle img-thumbnail">
            <div class="detail ml-4 block">
                <h5 class="mb-0">{{author.nickName}}</h5>
                <span class="text-truncate text-muted">{{author.description}}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { UserProps } from '../store';
    import { defineComponent, computed, PropType } from 'vue';
    import { addColumnAvatar } from '../hooks/useHandleImg';

    export default defineComponent({
        name: 'AuthorProfile',
        props:{
            author: {
                type: Object as PropType<UserProps>,
                required: true
            }
        },
        setup(props) {
            const fitUrl = computed(() => {
                addColumnAvatar(props.author, 50, 50);
                const { avatar } = props.author;
                return avatar && avatar.fitUrl
            });

            return {
                fitUrl
            }
        }
    })
</script>

<style scoped>
    .user-profile-component {
        width: 50px;
        height: 50px;
    }
</style>