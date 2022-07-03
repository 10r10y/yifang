<template>
    <div class="container">
    <ValidateForm @form-submit="onFormSubmit">
      <!-- 多个输入框插槽 -->
      <template #default>
        <div class="mb-3">
          <label class="form-label">邮箱地址</label>
          <ValidateInput 
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
            v-model="passwordVal"
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
    import { defineComponent, ref } from 'vue';
    import { useRouter } from 'vue-router';   // 定义路由行为钩子
    import { useStore } from 'vuex'
    import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
    import ValidateForm from '../components/ValidateForm.vue';
    import createMessage from '../components/CreatMessage';

    
    export default defineComponent({
      name: 'App',
      components: {
          ValidateForm,
          ValidateInput
      },
      setup(){
        const router = useRouter();
        const store = useStore();

        const inputRef = ref<any>();    // 获取子组件实例
        const emailVal = ref('');
        const passwordVal = ref('');
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
          // 如果输入验证成功
          if(result) {
            const payload = {
              email: emailVal.value,
              password: passwordVal.value
            }
            store.dispatch('loginAndFetch', payload).then(data => {
              console.log(data);
              createMessage('恭喜您，登陆成功', 'success', 2000);
              // 2s后路由跳转到首页
              setTimeout(() => {
                router.push(`/`);
              }, 2000);
            }).catch(e => {
              console.log(e);
              
            })
          }
        }

        return {
          emailRules,
          passwordRules,
          emailVal,
          passwordVal,
          onFormSubmit,
        }
      }
    })
</script>

<style scoped>

</style>