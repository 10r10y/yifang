<template>
    <div>
        <router-link to="/edit/user">编辑个人资料</router-link>
        <router-link to="/edit/column">修改专栏信息</router-link>
    </div>
    <router-view></router-view>
    <button>提交修改</button>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'EditInformation',
    })
</script>

<style scoped>

</style>