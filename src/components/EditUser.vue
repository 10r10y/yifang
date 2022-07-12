<template>
    <h2>编辑个人资料</h2>
    <Uploader
        action="/upload"
        class="d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
        
    >
        <template #default>
            <div class="defaultImg">
                
            </div>
        </template>
        <template #uploaded>
            200
        </template>
    </Uploader>
    <ValidateForm>
        <ValidateInput placeholder="请输入名称" v-model="nickName"></ValidateInput>
        <ValidateInput tag="textarea" rows="6">请输入简介信息</ValidateInput>
        <template #submit>
            <button class="btn btn-primary btn-large" @click="test">提交修改</button>
        </template>
    </ValidateForm>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { useStore } from 'vuex';
    import Uploader from '@/components/Uploader.vue';
    import ValidateForm from '@/components/ValidateForm.vue';
    import ValidateInput from '@/components/ValidateInput.vue';


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
            const userData = store.state.user;

            const nickName = userData.nickName;
            
            const test = () => {
                console.log(userData);
            }

            return {
                nickName,
                test
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