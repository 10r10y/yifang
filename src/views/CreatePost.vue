<template>
    <div class="create-post-page">
        <h4>{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
        <Uploader 
            action="/upload" 
            :uploaded="uploadedData"
            :beforeUpload="uploadChecker"
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
                <!-- 传入 options 关闭拼写检查 -->
                <Editor v-model="contentVal" 
                    @blur="checkEditor"
                    :options="editorOptions" 
                    ref="editorRef"
                    :class="{'is-invalid': !editorStatus.isValid}"
                ></Editor>
                <span v-if="!editorStatus.isValid" class="incalid-feedback mt-1">{{editorStatus.message}}</span>
                <!-- <ValidateInput
                    tag="textarea"
                    rows="10"
                    placeholder="请输入文章详情"
                    :rules="contentRules"
                    v-model="contentVal"
                    type="textarea"
                ></ValidateInput> -->
            </template>
            <template #submit>
                <button type="submit" class="btn btn-primary d-block mx-auto w-25 mb-3">{{isEditMode ? '更新文章' : '发表文章'}}</button>
            </template>
        </ValidateForm>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, reactive } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import EasyMDE, { Options } from 'easymde';

    import ValidateForm from '../components/ValidateForm.vue';
    import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
    import Uploader from '../components/Uploader.vue';
    import createMessage from '../components/CreatMessage';
    import Editor from '../components/Editor.vue';
    import beforeUploadCheck from '../hooks/useUploadCheck'
    import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store';

    interface EditorInstance {
        getMDEInstance: () => EasyMDE | null;
    }


    export default defineComponent({
        name: 'CreatePost',
        components: {
            ValidateForm,
            ValidateInput,
            Uploader,
            Editor
        },
        setup() {
            const uploadedData = ref();
            const titleVal = ref('');
            const contentVal = ref('');
            let imageId = '';
            const titleRules: RulesProp = [
                { type: 'required', message: '文章标题不为空' }
            ];
            const contentRules: RulesProp = [
                { type: 'required', message: '文章详情不为空' }
            ];

            const route = useRoute();
            const router = useRouter();
            const store = useStore<GlobalDataProps>();
            const textArea = ref<undefined | HTMLElement>(undefined);
            // easyMDE 配置项
            const editorOptions: Options = {
                spellChecker: false,
                // 关闭图标 CDN 加载
                // autoDownloadFontAwesome: false
            }
            const editorRef = ref<null | EditorInstance>();
            const editorStatus = reactive({
                isValid: true,
                message: ''
            })

            // 判断是否为编辑模式(只有编辑页点进来才会带文章 id)
            const isEditMode = !!route.query.id;

            // 对输入进行检查
            const checkEditor = () => {
                if(contentVal.value.trim() === ''){
                    editorStatus.isValid = false;
                    editorStatus.message = '文章详情不能为空'
                } else {
                    editorStatus.isValid = true;
                    editorStatus.message = ''
                }
            }

            onMounted(() => {
                // 待调整
                // if(editorRef.value) {
                //     // 尝试拿到 editor 暴露的实例
                //     console.log(editorRef.value.getMDEInstance())
                // }
                // 编辑模式发送异步请求获取填充内容
                if(isEditMode) {
                    store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
                        const currentPost = rawData.data;
                        if(currentPost.image) {
                            uploadedData.value = { data: currentPost.image};
                        }
                        titleVal.value = currentPost.title;
                        contentVal.value = currentPost.content || '';
                    });
                }
            })

            const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
                if(rawData.data._id) {
                    imageId = rawData.data._id;
                }
            }
            const onFormSubmit = (result: boolean) => {
                checkEditor();
                if(result && editorStatus.isValid){
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
                        const actionName = isEditMode ? 'updatePost' : 'createPost';
                        const sendData = isEditMode ? {
                            id: route.query.id,
                            payload: newPost
                        } : newPost;

                        store.dispatch(actionName, sendData).then(() => {
                            createMessage(isEditMode ? '更新成功，2 秒后跳转到专栏' : '发表成功，2 秒后跳转到专栏', 'success', 2000);
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
                uploadedData,
                isEditMode,
                textArea,
                editorOptions,
                editorRef,
                editorStatus,
                onFormSubmit,
                uploadChecker,
                handleFileUploaded,
                checkEditor
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

    .vue-easymde-editor.is-invalid {
        border: 1px solid #dc3545;
    }

</style>