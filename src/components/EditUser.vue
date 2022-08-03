<template>
    <Uploader
        action="/upload"
        class="d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
        :uploaded="uploadedData"
        @file-uploaded="onFileUploaded"
    >
        <template #default>
            <div class="defaultImg"> </div>
        </template>
        <template #uploaded="dataProps">
            <img :src="dataProps.uploadedData.data.url + '?x-oss-process=image/resize,m_fill,h_200,w_200'">
        </template>
    </Uploader>
    <ValidateForm @form-submit="onFormSubmit">
        <ValidateInput placeholder="请输入名称" v-model="nickName"></ValidateInput>
        <ValidateInput tag="textarea" rows="6" v-model="description">请输入简介信息</ValidateInput>
        <template #submit>
            <button class="btn btn-outline-primary btn-large d-block mx-auto mb-3">提交修改</button>
        </template>
    </ValidateForm>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue';
    import { useStore } from 'vuex';
    import router from '@/router';
    import { ResponseType, ImageProps } from '../store';
    import Uploader from './Uploader.vue';
    import ValidateForm from './ValidateForm.vue';
    import ValidateInput from './ValidateInput.vue';
    import createMessage from './CreatMessage';


    export default defineComponent({
        name: 'EditUser',
        components: {
            Uploader,
            ValidateForm,
            ValidateInput
        },
        setup() {
            // 获取当前登录 user : 通过 user 获取 column
            const store = useStore();
            const userData = computed(() => store.state.user);
            const nickName = ref(userData.value.nickName);
            const description = ref(userData.value.description);
            const uploadedData = ref();
            if(userData.value && userData.value.avatar){
                uploadedData.value = { data: userData.value.avatar };
            }
            
            const imgId = ref('');
            const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
                createMessage('上传图片成功', 'success', 2000);
                if(rawData.data._id) {
                    imgId.value = rawData.data._id;
                }
            }

            const onFormSubmit = (result: boolean) => {
                if(result) {
                    // 要发送的信息包
                    const payload: any = {
                        nickName: nickName.value,
                        description: description.value
                    }
                    if(imgId.value) {
                        payload.avatar = imgId.value
                    }
                    const sendData = {
                        id: userData.value._id,
                        payload
                    }
                    store.dispatch('updateUser', sendData).then(() => {
                        createMessage('修改成功，2 秒后跳转首页', 'success', 2000);
                        setTimeout(() => {
                            router.push('/')
                        }, 2000);
                    })
                }
            }

            return {
                nickName,
                description,
                uploadedData,
                onFileUploaded,
                onFormSubmit
            }
        }
    })
</script>

<style>
    .defaultImg {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background-color: rgb(51, 62, 59);
    }

    .circle {
        width: 200px;
        height: 200px;
        border-radius: 200px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #efefef;
    }
</style>