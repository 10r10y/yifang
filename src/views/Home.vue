<template>
    <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，一方天地</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted } from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import ColumnList from '../components/ColumnList.vue';
    import { useStore } from 'vuex';
    import { GlobalDataProps, ResponseType } from '../store';
    import createMessage from '../components/CreatMessage';

    export default defineComponent({
    name: 'App',
    components: {
        ColumnList
    },
    setup(){
        const store = useStore<GlobalDataProps>();

        onMounted(() => {
          store.dispatch('fetchColumns');
        })

        // 自定义函数检查是否 jpg 类型
        const beforeUpload = (file: File) => {
          const isJPG = file.type === 'image/jpeg';
          if(!isJPG) {
            createMessage('请传入 JPG 格式图片', 'error', 2000);
          }
          return isJPG;
        }

        // 自定义钩子事件
        const onFileUploaded = (rawData:ResponseType) => {
          createMessage(`上传图片ID：${rawData.data._id}`, 'success', 2000);
        };

        const list = computed(() => store.state.columns);
        return {
            list,
            beforeUpload,
            onFileUploaded
        }
    }
    })
</script>

<style scoped>

</style>