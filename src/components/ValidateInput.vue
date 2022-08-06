<template>
    <div class="validate-input-container pb-3">
        <input 
            v-if="tag !== 'textarea'"
            v-bind="$attrs"
            class="form-control" 
            :class="{'is-invalid': inputRef.error}"
            v-model="inputRef.val"
            @blur="validateInput"
        >
        <textarea
            v-else
            v-bind="$attrs"
            class="form-control" 
            :class="{'is-invalid': inputRef.error}"
            v-model="inputRef.val"
            @blur="validateInput"
        ></textarea>
        <span v-if="inputRef.error" class="invalid-feedback">
            {{inputRef.message}}
        </span>
   </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, reactive, onMounted, watchEffect, computed } from 'vue';
    import { emitter } from './ValidateForm.vue';

    // 使用字符串字面量，规定两种输入框
    export type TagType = 'input' | 'textarea';
    // 规则 interface
    interface RuleProp {
        type: 'email' | 'required' | 'range' | 'custom' | 'nickName';
        message: string;
        validator?: () => boolean;      // 传入函数参数作为自定义规则
    }
    export type RulesProp = RuleProp[];

    // 正则
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;     // email
    const nickNameReg = /^[^@!#$%&'*+=?^`{|}~-]*$/;     // 不含特殊字符

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
            // 实现组件 v-model 的方法一：
            const inputRef = reactive({
                // 使用一个可写的，同时具有 getter 和 setter 的计算属性
                val: computed({
                    // 1. get 方法需返回 modelValue prop
                    get: () => props.modelValue || '',
                    // 2. set 方法需触发相应的事件：即改变输入框内容后通过触发 'update:modelValue' 自定义事件，将 val 作为参数传回，在自定义事件中修改上层组件 v-model 的值
                    set: val => {
                        context.emit('update:modelValue', val);
                    }
                }),
                error: false,
                message: ''
            })

            // 实现组件 v-model 的方法二：
            // watch(() => props.modelValue, (newValue) => {
            //     inputRef.val = newValue || ''
            // })

            // 实现组件数据双向绑定：使得能够在父组件中直接 v-model
            // const updateValue = (e: Event) => {
            //     const targetValue = (e.target as HTMLInputElement).value;
            //     inputRef.val = targetValue;
            //     context.emit('update:modelValue', targetValue);
            // }

            // 验证传回的规则组，并返回一个 Boolean 值
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
                            case 'nickName':
                                passed = nickNameReg.test(inputRef.val);
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

            // 组件完成初始渲染并创建 DOM 节点后触发事件，将验证函数传入 ValidateForm
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
                validateInput
            }
        }
    })
</script>

<style scoped>

</style>