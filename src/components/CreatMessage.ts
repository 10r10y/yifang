import { h, render } from 'vue';
import Message from './Message.vue';

export type MessageType= 'success' | 'error' | 'default';

// 函数式创建组件
const createMessage = (message: string, type: MessageType, timeout?: number) => {
    // 使用 h 函数创建 Vnode 节点
    const messageVnode = h(Message, {
        message,
        type
    })
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);

    // 使用 render 函数将 Vnode 渲染到页面
    // 参数一：Vnode    参数二：DOM 节点
    render(messageVnode, mountNode);

    // 一个外部可访问的清除的方法
    const destory = () => {
        render(null, mountNode)
        document.body.removeChild(mountNode);
    }

    // 如果传入了显示多长时间
    if(timeout) {
        // 显示的时间到后清除组件和节点
        setTimeout(()=>{
            destory();
        }, timeout);
    }

    // 返回实例上的方法
    return {
        destory
    }

    
}

export default createMessage;