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
    import { defineComponent, computed } from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import ColumnList from '../components/ColumnList.vue';
    import { useStore } from 'vuex';
    import { GlobalDataProps } from '../store/index';

    export default defineComponent({
    name: 'App',
    components: {
        ColumnList,
    },
    setup(){
        const store = useStore<GlobalDataProps>();
        const list = computed(() => store.state.columns)
        return {
            list
        }
    }
    })
</script>

<style scoped>

</style>