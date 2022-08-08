/**
 * 传入一个元素，判断点击时是否在元素范围
 * 向函数传入一个参数：要判断的 HTML 元素
 * 鼠标点击时获取鼠标事件对象
 * 判断上文后者是否为前者后代节点
 * 是后代节点则说明点在目标元素的内部
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