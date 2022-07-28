<template>
    <!-- 此处 dropdownRef 用来获取整个下拉组件，以判断是否收回 -->
    <div class="dropdown" ref="dropdownRef">    
        <!-- .prevent 防止 a 链接默认行为 -->
        <a href="#" @click.prevent = "toggleOpen" class="btn btn-outline-light my-2">
            {{title}}
        </a>
        
        <ul class="dropdown-menu" v-if="isOpen" aria-labelledby="dropdownMenuButton1" :style="{display : 'block'}">
            <slot></slot>
        </ul>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, onUnmounted } from 'vue';
    import useClickOutside from '../hooks/useClickOutside';
    import mitt from 'mitt';

    // 注册并暴露 EventBus 让子组件能够触发自定义事件，继而父组件触发 callback 从而隐藏
    export const emitter = mitt();

    export default defineComponent({
        name: 'Dropdown',
        props: {
            title: {
                type: String,
                required: true
            }
        },
        setup(){
            const isOpen = ref(false);
            const toggleOpen = () => {
                isOpen.value = !isOpen.value;
            };

            const dropdownRef = ref<HTMLElement | null>(null);
            const isClickOutside = useClickOutside(dropdownRef);

            

            // 监听isClickOutside 响应式对象的变化，防止只调用一次
            watch(isClickOutside, () => {
                // 点击收回下拉菜单
                if(isClickOutside.value && isOpen.value){
                    isOpen.value = false;
                }
            });

            // 实现点击 DropdownItme 跳转后隐藏 Dropdown
            // callback
            const dropdownItemClicked = () => {
                toggleOpen();
            };
            // 创建自定义事件并挂载到 emitter 上
            emitter.on('dropdown-item-clicked', dropdownItemClicked);
            // 组件卸载后移除
            onUnmounted(() => {
                emitter.off('dropdown-item-clicked', dropdownItemClicked);
            });

            return {
                isOpen,
                toggleOpen,
                dropdownRef
            }
        }
    })
</script>

<style scoped>

</style>