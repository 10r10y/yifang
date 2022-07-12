<template>
    <div>
        <router-link to="/edit/user" class="btn btn-light my-2" style="margin-right: 6px">编辑个人资料</router-link>
        <router-link to="/edit/column" class="btn btn-light my-2">修改专栏信息</router-link>
    </div>
    <router-view></router-view>
    
    
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'EditInformation',
    })
</script>

<style scoped>
</style>