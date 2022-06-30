<template>
    <div class="row">
        <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
            <div class="card" h-100 shadow-sm>
                <div class="card-body text-center">
                    <img :src="column.avatar && column.avatar.url" alt="Column img" class="rounded-circle border border-light my-3">
                    <h5 class="card-title">{{column.title}}</h5>
                    <p class="card-text text-left">{{column.description}}</p>
                    <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed } from 'vue';
    import { ColumnProps } from '../store/index';

    export default defineComponent({
        name: 'ColumnList',
        props: {
            // props 详细限定
            list: {
                // vue 内置的 PropType 为构造函数断言指定泛型
                type: Array as PropType<ColumnProps[]>,     // 限定类型
                required: true,     // 是否必须传递
            }
        },
        setup(props) {
            const columnList = computed(()=> {
                // 计算属性：当没有 column.avatar 时显示本地图片
                return props.list.map(column => {
                    // 加载失败使用默认图片
                    if(!column.avatar) {
                        column.avatar = {
                            url: require('@/assets/column.jpg')
                        }
                    } else {    // 加载成功使用 阿里云OSS API 修改图片缩放比例
                        column.avatar.url = column.avatar.url + '?x-oss-process=image/resize,m_pad,h_50,w_50'
                    }
                    return column
                })
            });

            return {
                columnList
            }
        }
    })
</script>

<style scoped>
    .card-body img {
        width: 50px;
        height: 50px;
    }
</style>