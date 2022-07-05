<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
        <Uploader 
            action="/upload" :beforeUpload="uploadChecker"
            @file-uploaded="handleFileUploaded"
            class="file-upload-container d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
        >
            <!-- default -->
            <h2>点击上传头图</h2>

            <!-- loading -->
            <template #loading>
                <div class="d-flex">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h2> 正在上传</h2>
                </div>
            </template>

            <!-- uploaded -->
            <template #uploaded="dataProps">
                <img :src="dataProps.uploadedData.data.url" class="img-uploaded">
            </template>
        </Uploader>
        <ValidateForm @form-submit="onFormSubmit">
            <template #default>
                <label >文章标题：</label>
                <ValidateInput
                    placeholder="请输入文章标题"
                    :rules="titleRules"
                    v-model="titleVal"
                    type="text"
                ></ValidateInput>
                <label >文章详情：</label>
                <ValidateInput
                    tag="textarea"
                    rows="10"
                    placeholder="请输入文章详情"
                    :rules="contentRules"
                    v-model="contentVal"
                    type="textarea"
                ></ValidateInput>
            </template>
            <template #submit>
                <button type="submit" class="btn btn-primary">创建</button>
            </template>
        </ValidateForm>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';

    import ValidateForm from '../components/ValidateForm.vue';
    import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
    import Uploader from '../components/Uploader.vue';
    import createMessage from '../components/CreatMessage';
    import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store';
    // 引入检查函数
    import beforeUploadCheck from '../hooks/useUploadCheck'


    export default defineComponent({
        name: 'CreatePost',
        components: {
            ValidateForm,
            ValidateInput,
            Uploader
        },
        setup() {
            const titleVal = ref('');
            const contentVal = ref('');
            let imageId = '';
            const titleRules: RulesProp = [
                { type: 'required', message: '文章标题不为空' }
            ];
            const contentRules: RulesProp = [
                { type: 'required', message: '文章详情不为空' }
            ];

            const router = useRouter();
            const store = useStore<GlobalDataProps>();

            const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
                if(rawData.data._id) {
                    imageId = rawData.data._id;
                }
            }
            const onFormSubmit = (result: boolean) => {
                if(result){
                    const { column, _id } = store.state.user;
                    if(column){
                        const newPost: PostProps = {
                            title: titleVal.value,
                            content: contentVal.value,
                            column,
                            author: _id
                        }
                        if(imageId) {
                            newPost.image = imageId;
                        }
                        store.dispatch('createPost', newPost).then(() => {
                            createMessage('发表成功，2 秒后跳转到文章', 'success', 2000);
                            setTimeout(() => {
                                router.push({ name: 'column', params: { id: column }})
                            }, 2000);
                        });
                        store.commit('createPost', newPost);
                        router.push(`/column/${column}`);
                    }
                    
                }
            }

            // 对上传内容进行验证 
            const uploadChecker = (file: File) => {
                const result = beforeUploadCheck(file,{ format: ['image/jpeg', 'image/png'], size: 1});
                const { passed, error } = result;
                if(error === 'format') {
                    createMessage('上传图片只能为 JPG 或 PNG 格式', 'error');
                }
                if(error === 'size') {
                    createMessage('上传图片大小不能超过 1M', 'error');
                }
                return passed
            }

            return {
                titleVal,
                contentVal,
                titleRules,
                contentRules,
                onFormSubmit,
                uploadChecker,
                handleFileUploaded
            }
        }
    })
</script>

<style>
    .create-post-page .file-upload-container {
        height: 200px;
        cursor: pointer;
    }

    .create-post-page .img-uploaded {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>