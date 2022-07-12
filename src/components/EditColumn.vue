<template>
    <h2>更新专栏信息</h2>
    <Uploader
        action="/upload"
        class="d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
        
    >
        <template #default>
            <div class="defaultImg">
                
            </div>
        </template>
        <template #uploaded>
            200
        </template>
    </Uploader>
    <ValidateForm>
        <ValidateInput 
            placeholder="请输入名称"
            v-model="columnTitle"
        ></ValidateInput>
        <ValidateInput 
            tag="textarea" rows="6"
            v-model="columnDescription"
        >请输入简介信息
        </ValidateInput>
        <template #submit>
            <button class="btn btn-primary btn-large" @click="test">提交修改</button>
        </template>
    </ValidateForm>
</template>

<script lang="ts">
    import { defineComponent, onMounted, computed } from 'vue';
    import { useStore } from 'vuex';
    import Uploader from '@/components/Uploader.vue';
    import ValidateForm from '@/components/ValidateForm.vue';
    import ValidateInput from '@/components/ValidateInput.vue';

    export default defineComponent({
        name: 'EditColumn',
        components: {
            Uploader,
            ValidateForm,
            ValidateInput
        },
        setup() {
            const store = useStore();
            // 获取当前登录 user : 通过 user 获取 column
            const userData = computed(()=> store.state.user);
            const columnId = computed(()=> userData.value.column);

            // 通过 cid 请求专栏信息
            onMounted(() => {
                if (columnId.value) {
                    store.dispatch('fetchColumn', columnId.value);
                }
            })
            const columnData = computed(() => store.getters.getColumnById(columnId.value));
            const columnTitle = computed(() => {
                if (columnData.value) {
                    return columnData.value.title;
                }
                return ''
            });
            const columnDescription = computed(() => {
                if (columnData.value) {
                    return columnData.value.description;
                }
                return ''
            });
            const test = () => {
                console.log(userData.value, columnId.value)
                console.log(columnData.value);
            }
            
            return {
                columnTitle,
                columnDescription,
                test
            }
        }
    })
</script>

<style scoped>
    .defaultImg {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background-color: aquamarine;
    }
</style>    