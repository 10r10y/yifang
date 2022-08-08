<template>
    <div class="file-upload">
        <div class="file-upload-container" @click="triggerUpload" v-bind="$attrs">
            <slot v-if="fileStatus === 'ready'" name="default">
                <div style="font-size: 20px">点 击 上 传</div>
            </slot>
            <!-- 上传成功后通过自定义属性拿到值 -->
            <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
                <div style="font-size: 20px">上 传 成 功</div>
            </slot>
            <slot v-else  name="loading">
                <div style="font-size: 20px">正 在 上 传</div>
            </slot>
        </div>
        <input 
            type="file" 
            class="file-input d-none" 
            ref="fileInput"
            @change.prevent="handleFileChange"
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, watch } from 'vue';
    import axios from 'axios';


    // 保存上传的状态
    type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
    // 校验函数的类型
    type CheckFunction = (file: File) => boolean;

    export default defineComponent({
        name: 'Uploader',
        props: {
            // action：必填的接口 url
            action: {
                type: String,
                required: true
            },
            beforeUpload: {
                type: Function as PropType<CheckFunction>
            },
            // 是否已经上传成功（用于编辑页面）
            uploaded: {
                type: Object
            }
        },

        // 不希望组件的根元素继承其它特性，结合 $attrs 使用
        inheritAttrs: false,

        // 自定义事件
        emits: ['file-uploaded','file-uploaded-error'],

        setup(props, context){
            // 接收通过 props 传入的 uploadedData，并在上传成功插槽中传回
            const uploadedData = ref(props.uploaded);
            // 初始化时判断是创建页面还是编辑页面
            const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready');
            watch(() => props.uploaded, (newValue) => {
                if(newValue) {
                    fileStatus.value = 'success';
                    uploadedData.value = newValue;
                }
            })

            // 一个隐藏起来的 input-file
            const fileInput = ref<null | HTMLInputElement>(null);
            // 一波移花接木：点击自定义的按钮去触发隐藏的 input-file 的 click
            const triggerUpload = () => {
                if(fileInput.value) {
                    fileInput.value.click();
                }
            };
            
            // 当 input-file 内容发生改变时：
            const handleFileChange = (e: Event) => {
                const currentTarget = e.target as HTMLInputElement;
                if(currentTarget.files) {
                    // 获取 files 伪数组并转换为数组
                    const files = Array.from(currentTarget.files);

                    // 如果用户传入了自定义函数对文件进行验证
                    if(props.beforeUpload) {
                        const result = props.beforeUpload(files[0]);
                        if (!result) return;
                    }

                    // 改变状态
                    fileStatus.value = 'loading';
                    // 获取 FormData 实例
                    const formData = new FormData();
                    // 添加输入框中文件信息
                    formData.append('file', files[0]);
                    // 发送 post 请求
                    axios.post(props.action, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(resp => {
                        // 提供成功钩子
                        context.emit('file-uploaded', resp.data);
                        // 向父组件传递（Scoped Slots）
                        uploadedData.value = resp.data;
                        // 设置状态
                        fileStatus.value = 'success'
                    }).catch( e => {         
                        // 提供失败钩子
                        context.emit('file-uploaded-error', e.error);
                        // 设置状态
                        fileStatus.value = 'error'
                    }).finally(() => {      // 不论如何最后都要执行的：将 input-file 置空
                        if(fileInput.value) {
                            fileInput.value.value = '';
                        }
                    })


                }
            };



            return {
                fileInput,
                fileStatus,
                triggerUpload,
                handleFileChange,
                uploadedData
            }
        }
    })
</script>

<style scoped>

</style>