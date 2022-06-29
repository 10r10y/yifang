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
    import { defineComponent, ref, watch } from 'vue';
    import useClickOutside from '../hooks/useClickOutside';

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