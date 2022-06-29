/**
 * 传入一个元素，判断点击时是否在元素范围
 */
import { ref, onMounted, onUnmounted, Ref } from 'vue';

// 传入一个 HTMLElement
const useClcikOutside = (elementRef: Ref<HTMLElement | null>) => {
    // 是否点到外边
    const isClickOutside = ref(false);

    // 传入鼠标事件对象
    const handler = (e:MouseEvent) => {
        if(elementRef.value){
            // Node.contains() 用来判断传入的节点是否为该节点的后代节点
            if(elementRef.value.contains(e.target as HTMLElement)){
                isClickOutside.value = false;
            } else {
                isClickOutside.value = true;
            }
        }

        return isClickOutside;
    };

    onMounted(()=> {
        document.addEventListener('click', handler);
    });

    onUnmounted(()=>{
        document.removeEventListener('click', handler);
    });

    return isClickOutside;
}

export default useClcikOutside;