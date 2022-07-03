<template>
    <div class="validate-input-container pb-3">
        <input 
            v-if="tag !== 'textarea'"
            v-bind="$attrs"
            class="form-control" 
            :class="{'is-invalid': inputRef.error}"
            :value="inputRef.val"
            @input="updateValue"
            @blur="validateInput"
        >
        <textarea
            v-else
            v-bind="$attrs"
            class="form-control" 
            :class="{'is-invalid': inputRef.error}"
            :value="inputRef.val"
            @input="updateValue"
            @blur="validateInput"
        ></textarea>
        <span v-if="inputRef.error" class="invalid-feedback">
            {{inputRef.message}}
        </span>
   </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, reactive, onMounted, watchEffect } from 'vue';
    import { emitter } from './ValidateForm.vue';

    interface RuleProp {
        type: 'email' | 'required' | 'range' | 'custom';
        message: string;
        validator?: () => boolean;      // 传入函数参数作为自定义规则
    }

    const emailReg = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    export type RulesProp = RuleProp[];
    // 使用字符串字面量，规定两种输入框
    export type TagType = 'input' | 'textarea';

    export default defineComponent({
        name: 'Validateinput',
        props: {
            // 用于接收规则
            rules: Array as PropType<RulesProp>,
            // 用于数据双向绑定
            modelValue: String,
            // 传入想渲染的输入框类型
            tag: {
                type: String as PropType<TagType>,
                default: 'input'
            }
        },
        // 父组件传递的非 prop 的 attribute，设置为不在子组件根节点接收
        // 然后将 attribute 用 $attrs 设置
        inheritAttrs: false,
        setup(props, context) {
            const inputRef = reactive({
                val: props.modelValue || '',
                error: false,
                message: ''
            })
            // 实现组件数据双向绑定：使得能够在父组件中直接 v-model
            const updateValue = (e: Event) => {
                const targetValue = (e.target as HTMLInputElement).value;
                inputRef.val = targetValue;
                context.emit('update:modelValue', targetValue);
            }
            const validateInput = () => {
                if(props.rules) {
                    // 数组的 every 方法需要每一个都为真才返回真
                    const allPassed = props.rules.every(rule => {
                        let passed = true;
                        inputRef.message = rule.message;
                        switch(rule.type) {
                            case 'required':
                                passed = (inputRef.val.trim() !== '');
                                break;
                            case 'email':
                                passed = emailReg.test(inputRef.val);
                                break;
                            case 'range':
                                passed = (inputRef.val.trim().length >= 6 && inputRef.val.indexOf(' ') === -1);
                                break;
                            case 'custom':
                                passed = rule.validator ? rule.validator() : true;
                                break;
                            default:
                                break;
                        }
                        return passed;
                    });
                    inputRef.error = !allPassed
                    return allPassed
                }
                return true;
            }

            // 挂载时触发事件
            onMounted(()=>{
                emitter.emit('form-item-created', validateInput);
            })

            watchEffect( ()=> {
                if(inputRef.error){
                    inputRef.val = '';
                }
            })

            return {
                inputRef,
                validateInput,
                updateValue
            }
        }
    })
</script>

<style scoped>

</style>