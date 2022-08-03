<template>
    <teleport to='#back'>
        <div class="loading-container" :style="{backgroundColor: background || ''}">
            <div class="loading-content">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">{{text || 'Loading...'}} </span>
                </div>
                <p v-if="text" class="text-primary small">{{text}}</p>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import useDOMCreate from '../hooks/useDOMCreate';

    export default defineComponent({
        name: 'Loading',
        props: {
            text: {
                type: String
            },
            background: {
                type: String
            }
        },
        setup(){
            useDOMCreate('back');
        }
    })
</script>

<style scoped>
    .loading-container {
        background: rgba(200, 200, 200, 0.8);
        z-index: 100;
        position: fixed;
        width: 100%;
        height:100%;
        top: 0;
        left: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>