<template>
  <div class="container">
    <HomeHeader :user="currentUser"></HomeHeader>
    <Login></Login>
    <Home></Home>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import HomeHeader, { UserProps } from './components/HomeHeader.vue';
  import Home from './views/Home.vue';
  import Login from './views/Login.vue'


  // 测试数据
  const currentUser: UserProps = {
    isLogin: true,
    name: 'viki',
    id: 1
  }

  export default defineComponent({
    name: 'App',
    components: {
      HomeHeader,
      Home,
      Login,
    },
    setup(){

      return {
        currentUser: currentUser,
      }
    }
  })
</script>

<style>

</style>
