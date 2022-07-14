<template>
    <h2>更新专栏信息</h2>
    <Uploader
        action="/upload"
        class="d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
        :beforeUpload="beforeUpload"
        :uploaded="uploadData"
        @file-uploaded="onFileUploaded"
    >
        <template #default>
            <div class="defaultImg">
                
            </div>
        </template>
        <template #uploaded>
            <img :src="uploadData.data + '?x-oss-process=image/resize,m_fill,h_200,w_200'">
        </template>
    </Uploader>
    <ValidateForm @form-submit="onFormSubmit">
        <ValidateInput 
            placeholder="请输入名称"
            v-model="columnTitle"
        ></ValidateInput>
        <ValidateInput 
            tag="textarea" rows="6"
            v-model="columnDescription"
        >请输入简介信息
        </ValidateInput>
        <template #submit>
            <button class="btn btn-primary btn-large">提交修改</button>
        </template>
    </ValidateForm>
</template>

<script lang="ts">
    import { defineComponent, onMounted, computed, ref, watch, nextTick } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router'
    import { ResponseType, ImageProps} from '../store';
    import Uploader from './Uploader.vue';
    import ValidateForm from './ValidateForm.vue';
    import ValidateInput from './ValidateInput.vue';
    import createMessage from './CreatMessage';
    import useUploadCheck from '../hooks/useUploadCheck'

    export default defineComponent({
        name: 'EditColumn',
        components: {
            Uploader,
            ValidateForm,
            ValidateInput
        },
        setup() {
            const store = useStore();
            const router = useRouter();
            // 获取当前登录 user : 通过 user 获取 column
            const userData = computed(()=> store.state.user);
            const columnId = computed(()=> userData.value.column);

            const columnData = computed(() => store.getters.getColumnById(columnId.value));
            const uploadData = ref();
            const columnTitle = ref();
            const columnDescription = ref();

            // 通过 cid 请求专栏信息
            onMounted(() => {
                const cid = userData.value.column;
                if (cid) {
                    store.dispatch('fetchColumn', cid).then(() => {
                        const newData = store.getters.getColumnById(columnId.value);
                        columnTitle.value = newData.title;
                        columnDescription.value = newData.description;
                    })
                }
            })

            watch(columnData, () => {
                if(columnData.value && columnData.value.avatar){
                    const { avatar } = columnData.value;
                    uploadData.value = { data: avatar.url}
                }
            })
        
            

            // 上传前的检查
            const beforeUpload = (file: File) => {
                const result = useUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1});
                const { passed, error } = result;
                if(error === 'format') {
                    createMessage('上传图片只能为 JPG 或 PNG 格式', 'error');
                }
                if(error === 'size') {
                    createMessage('上传图片大小不能超过 1M', 'error');
                }
                return passed;
            }

            let imageId = '';
            // 上传图片后，通过自定义事件，子组件返回上传图片的数据，获取图片ID，并加入到最后要提交的信息
            const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
                createMessage(`上传图片成功`, 'success', 2000);
                if(rawData.data._id) {
                    imageId = rawData.data._id;
                }
            }

            // 提交时，ValidateForm 组件会验证所有输入，并通过触发自定义事件，将验证结果返回
            // 验证结果为真时，这里需要打包数据并发送 patch 请求来更新信息
            const onFormSubmit = (result: boolean) => {
                if(result) {
                    const payload: any = {
                        _id: columnData.value._id,
                        title: columnTitle.value,
                        description: columnDescription.value
                    }
                    // 如果有上传图片，将图片 ID 传入 avatar
                    if(imageId) {
                        payload.avatar = imageId;
                    }

                    const sendData = {
                        id: columnData.value._id,
                        payload
                    }
                    store.dispatch('updateColumn', sendData).then(() => {
                        createMessage('修改成功，2秒后跳转到首页', 'success', 2000)
                        setTimeout(() => {
                            router.push('/')
                        }, 2000)
                    })
                }
            }
            
            return {
                columnTitle,
                columnDescription,
                uploadData,
                beforeUpload,
                onFileUploaded,
                onFormSubmit
            }
        }
    })
</script>

<style scoped>
    .defaultImg {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background-color: aquamarine;
    }
</style>    