<template>
    <li class="dropdown-option" :class="{'is-disabled': disabled }">
        <slot></slot>
    </li>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'DropdownItem',
        props: {
            disabled: {
                type: Boolean,
                default: false
            }
        }
    })
</script>

<style scoped>
    /* 默认情况下，scoped 样式不会影响 slot 渲染出的内容，使用 :slotted 伪类才能将之明确为目标*/
    :slotted(.dropdown-option.is-disabled *) {
        color: #6c757d;
        /* 元素不会成为鼠标事件 target */
        pointer-events: none;
        background-color: transparent;
    }
</style>