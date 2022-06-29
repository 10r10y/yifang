<template>
    <div class="container">
    <ValidateForm @form-submit="onFormSubmit">
      <!-- 多个输入框插槽 -->
      <template #default>
        <div class="mb-3">
          <label class="form-label">邮箱地址</label>
          <ValidateInput 
            ref="inputRef"
            :rules="emailRules" 
            v-model="emailVal"
            placeholder="请输入邮箱地址"
            type="text"
          ></ValidateInput>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Password</label>
          <ValidateInput 
            :rules="passwordRules"
            placeholder="请输入密码"
            type="password"
          ></ValidateInput>
        </div>
      </template>
      
      <!-- 按键插槽 -->
      <template #submit>
        <button type="submit" class="btn btn-primary">登录</button>
      </template>
      
    </ValidateForm>
  </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, ref } from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
    import ValidateForm from '../components/ValidateForm.vue';

    
    export default defineComponent({
    name: 'App',
    components: {
        ValidateForm,
        ValidateInput
    },
    setup(){
        const inputRef = ref<any>();    // 获取子组件实例
        let emailVal = ref('');
        let passwordVal = ref('');
        // 邮箱验证
        const emailRules: RulesProp = [
        {type: 'required', message: '邮箱地址不能为空'},
        {type: 'email', message: '请输入合法邮箱地址'}
        ]
        // 密码验证
        const passwordRules: RulesProp = [
        {type: 'required', message: '密码不能为空'},
        {type: 'range', message: '密码至少六位，且不能含有空格'}
        ]

        // 函数监听子组件自定义事件传回的结果
        const onFormSubmit = (result: boolean) => {
        inputRef.value.validateInput();
        }

        return {
        emailRules,
        passwordRules,
        emailVal,
        onFormSubmit,
        inputRef
        }
    }
    })
</script>

<style scoped>

</style>