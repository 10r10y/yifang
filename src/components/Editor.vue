<template>
    <div class="vue-easymde-editor">
        <textarea ref="textArea"></textarea>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps, defineEmits, ref, watch, onMounted, onUnmounted } from 'vue';
    import EasyMDE, { Options } from 'easymde';
    // 类型：属性以及事件
    interface EditorProps {
        modelValue?: string;
        options?:Options;
    }
    interface EditorEvents {
        (type: 'update:modelValue', value: string): void;
        (type: 'change', value: string): void;
        (type: 'blur'): void;
    }

    const props = defineProps<EditorProps>()
    const emit = defineEmits<EditorEvents>()

    // 有了模板，再来一些初始数据
    const textArea = ref<null | HTMLTextAreaElement>(null);
    let easyMDEInstance: EasyMDE | null = null;
    const innerValue = ref(props.modelValue || '');
    // 解决异步获取组件内容初始渲染为空的问题
    watch(()=> props.modelValue, newValue => {
        if(easyMDEInstance) {
            if(newValue !== innerValue.value) {
                easyMDEInstance.value(newValue || '');
            }
        }
    })
    onMounted(()=> {
        if(textArea.value) {
            // 组装 options (EasyMDE 配置项)
            const config: Options = {
                ...(props.options || {}),
                element: textArea.value,
                initialValue: innerValue.value,
                // 关闭图标 CDN 加载
                autoDownloadFontAwesome: false
            }

            // 创建实例
            easyMDEInstance = new EasyMDE(config)

            // 监控对应事件
            easyMDEInstance.codemirror.on('change', () => {
                if(easyMDEInstance) {
                    // 拿到当前输入框中值
                    const updateValue = easyMDEInstance.value();
                    innerValue.value = updateValue;
                    emit('update:modelValue', updateValue);
                    emit('change', updateValue);
                }
            })
            easyMDEInstance.codemirror.on('blur', () => {
                if(easyMDEInstance) {
                    emit('blur');
                }
            })
        }
    })

    // 销毁对应实例
    onUnmounted(() => {
        if( easyMDEInstance) {
            easyMDEInstance.cleanup();
        }
        easyMDEInstance = null;
    })

    // 暴露方法
    const getMDEInstance = () => {
        return easyMDEInstance;
    }

    // setup 语法糖中通过 编译器宏 来向外暴露实例或方法
    defineExpose({
        getMDEInstance
    })
    
</script>

<style scoped>

</style>