<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
        <ValidateForm @form-submit="onFormSubmit">
            <template #default>
                <label >文章标题：</label>
                <ValidateInput
                    placeholder="请输入文章标题"
                    :rules="titleRules"
                    v-model="titleVal"
                    type="text"
                ></ValidateInput>
                <label >文章详情：</label>
                <ValidateInput
                    tag="textarea"
                    rows="10"
                    placeholder="请输入文章详情"
                    :rules="contentRules"
                    v-model="contentVal"
                    type="textarea"
                ></ValidateInput>
            </template>
            <template #submit>
                <button type="submit" class="btn btn-primary">创建</button>
            </template>
        </ValidateForm>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import ValidateForm from '../components/ValidateForm.vue';
    import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
    import { GlobalDataProps } from '../store/index';
    import { PostProps } from '../testData';


    export default defineComponent({
        name: 'CreatePost',
        components: {
            ValidateForm,
            ValidateInput
        },
        setup() {
            const titleVal = ref('');
            const contentVal = ref('');
            const titleRules: RulesProp = [
                { type: 'required', message: '文章标题不为空' }
            ];
            const contentRules: RulesProp = [
                { type: 'required', message: '文章详情不为空' }
            ];

            const router = useRouter();
            const store = useStore<GlobalDataProps>();
            const onFormSubmit = (result: boolean) => {
                const { columnId } = store.state.user;
                if(result){
                    if(columnId){
                        const newPost: PostProps = {
                            id: new Date().getTime(),
                            title: titleVal.value,
                            content: contentVal.value,
                            columnId,
                            createdTime: new Date().toLocaleString()
                        }
                        store.commit('createPost', newPost);
                        router.push(`/column/${columnId}`);
                    }
                    
                }
            }

            return {
                titleVal,
                contentVal,
                titleRules,
                contentRules,
                onFormSubmit
            }
        }
    })
</script>

<style scoped>

</style>