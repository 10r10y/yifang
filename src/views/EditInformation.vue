<template>
    <div class="edit-page">
        <div class="link-box">
            <router-link to="/edit/user" class="btn">编辑个人资料</router-link>
            <router-link to="/edit/column" class="btn ">修改专栏信息</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'EditInformation',
    })
</script>

<style scoped>
.edit-page {
    max-width: 680px;
    margin: auto;
}

.link-box {
    border-bottom: 1px solid rgba(206, 212, 218);
    margin: 16px 0 50px 0;
}
.btn {
    margin-bottom: -1px;
    border-radius: 6px 6px 0 0;
}

.btn:hover {
    margin-bottom: -1px;
    border-radius: 6px 6px 0 0;
    border: 1px solid rgba(206, 212, 218);
}
.router-link-active {
    margin-bottom: -1px;
    border: 1px solid rgba(206, 212, 218) !important;
    border-bottom: 1px solid #fff !important;
}
</style>