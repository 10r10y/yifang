<template>
    <div class="filr-upload">
        <input 
            type="file" 
            class="file-input d-none" 
            ref="fileInput"
            @change.prevent="handleFileChange"
        >
        <button class="btn btn-primary" @click="triggerUpload">
            <span v-if="fileStatus === 'ready'">点击上传</span>
            <span v-else-if="fileStatus === 'success'">上传成功</span>
            <span v-else>正在上传</span>
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue';
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
            }
        },
        emits: ['file-uploaded','file-uploaded-error'],

        setup(props, context){
            const fileStatus = ref<UploadStatus>('ready');

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
                handleFileChange
            }
        }
    })
</script>

<style scoped>

</style>