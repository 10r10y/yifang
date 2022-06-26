<template>
    <div class="row">
        <div v-for="column in columnList" :key="column.id" class="col-4 mb-4">
            <div class="card" h-100 shadow-sm>
                <div class="card-body text-center">
                    <img :src="column.avatar" alt="Column img" class="rounded-circle border border-light w-25 my-3">
                    <h5 class="card-title">{{column.title}}</h5>
                    <p class="card-text text-left">{{column.description}}</p>
                    <a href="#" class="btn btn-outline-primary">进入专栏</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed } from 'vue';

    // Column API 接口类型
    export interface ColumnProps {
        id: number;
        title: string;
        avatar?: string;
        description: string;
    }

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
                    if(!column.avatar) {
                        column.avatar = require('@/assets/column.jpg');
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

</style>