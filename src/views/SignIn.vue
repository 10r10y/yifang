<template>
    <div class="mx-auto p-3" style="max-width: 330px">
        <div class="pt-3"></div>
        <ValidateForm @form-submit="onFormSubmit" class="border rounded p-3 w-100" style="background-color: #f6f8fa">
            <div class="mt-3">
                <label class="form-label">邮箱地址</label>
                <ValidateInput
                    :rules="emailRules"
                    v-model="formData.email"
                    placeholder="请输入邮箱地址"
                    type="text"
                ></ValidateInput>
            </div>
            <div>
                <label class="form-label">用户昵称</label>
                <ValidateInput
                    :rules="nickNameRules"
                    v-model="formData.nickName"
                    placeholder="请输入昵称"
                    type="text"
                ></ValidateInput>
            </div>
            <div>
                <label class="form-label">密码</label>
                <ValidateInput
                    :rules="passwordRules"
                    v-model="formData.password"
                    placeholder="请输入密码"
                    type="password"
                ></ValidateInput>
            </div>
            <div class="mb-3">
                <label class="form-label">重复密码</label>
                <ValidateInput
                    :rules=" repeatPasswordRules"
                    v-model="formData.repeatPassword"
                    placeholder="请重新输入密码"
                    type="password"
                ></ValidateInput>
            </div>

            <!-- 按键插槽 -->
            <template #submit>
                <button type="submit" class="btn btn-success w-100">注册</button>
            </template>
        </ValidateForm>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from 'vue';
    import { useRouter  } from 'vue-router';
    import axios from 'axios';
    // components
    import ValidateForm from '../components/ValidateForm.vue';
    import ValidateInput from '../components/ValidateInput.vue';
    // ts
    import { RulesProp } from '../components/ValidateInput.vue';
    import createMessage from '@/components/CreatMessage';


    export default defineComponent({
        name: 'SignIn',
        components: {
            ValidateForm,
            ValidateInput
        },
        setup() {
            const formData = reactive({
                email: '',
                nickName: '',
                password: '',
                repeatPassword: ''
            });
            const router = useRouter();

            // rules
            const emailRules: RulesProp = [
                {type: 'required', message: '邮箱地址不能为空'},
                {type: 'email', message: '请输入的合法邮箱地址'}
            ];
            const nickNameRules: RulesProp = [
                {type: 'required', message: '用户名不能为空'},
                
            ];
            const passwordRules: RulesProp = [
                {type: 'required', message: '密码不能为空'},
            ];
            const repeatPasswordRules: RulesProp = [
                {type: 'required', message: '密码不能为空'},
                {
                    type: 'custom',
                    message: '两次输入密码不相同',
                    validator: () => {
                        return formData.password === formData.repeatPassword
                    }
                }
            ];


            const onFormSubmit = async (result: boolean) => {
                if(result) {
                    const payload = {
                        email: formData.email,
                        password: formData.password,
                        nickName: formData.nickName
                    }
                    axios.post('/users', payload).then(() => {
                        createMessage('注册成功，正在跳转登录页面', 'success', 2000);
                        setTimeout(() => {
                            router.push('/login');
                        })
                        
                    }).catch((e)=> {
                        // 已添加全局错误拦截，错误信息会自动头部提示，不需要在 create
                        console.log(e)
                    })
                }
            }

            return {
                formData,
                emailRules,
                nickNameRules,
                passwordRules,
                repeatPasswordRules,
                onFormSubmit
            }
        }
    })
</script>

<style scoped>

</style>