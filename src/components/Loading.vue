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
    import { defineComponent, onUnmounted } from 'vue';

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
            // 在挂载之前创建一个标记节点，供 teleport 定位
            const node = document.createElement('div');
            node.id = 'back';
            document.body.appendChild(node);

            // 组件卸载后清除节点
            onUnmounted(() => {
                document.body.removeChild(node);
            })
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