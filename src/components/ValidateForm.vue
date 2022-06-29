<template>
    <form class="validate-from-container"  @submit.prevent="submitForm">
        <!-- 多个输入项的插槽 -->
        <slot name="default"></slot>
        <div class="submit-area">
            <!-- 按键插槽 -->
            <slot name="submit">
                <!-- 默认按键 -->
                <button type="submit" class="btn btn-primary">登陆</button>
            </slot>
        </div>
    </form>
</template>

<script lang="ts">
    import { defineComponent, onMounted, onUnmounted, onBeforeMount } from 'vue';
    // 外部库：自定义事件监听器 mitt
    import mitt from 'mitt';

    type ValidateFunc = () => boolean;

    // mitt 要求事件名称和类型一一对应
    type Events = {
        'form-item-created': ValidateFunc;
    }
    // 调用函数创建事件监听器
    export const emitter = mitt<Events>()
    

    export default defineComponent({
        name: 'ValidateForm',
        emits: ['form-submit'],
        setup(props, context){
            let funcArr: ValidateFunc[] = []
            // submit 按键需要触发的函数
            const submitForm = () => {
                // const result = funcArr.every(func => func())    // every 会在遇到第一个false就停止
                // 所以此处使用 map 先构建一个 boolean 的数组，再用 every 返回 result
                const result = funcArr.map(func => func()).every(result => result)
                context.emit('form-submit', result);
            }
            const callback = (func: ValidateFunc)=>{
                funcArr.push(func)
            }
            onBeforeMount(()=>{
                emitter.on('form-item-created', callback);
            })
            onUnmounted(()=>{
                emitter.off('form-item-created', callback);
                funcArr = [];
            })
            
            return {
                submitForm
            }
        }
    })

</script>

<style scoped>

</style>