import { createApp } from 'vue';
import Message from '../components/Message.vue';

export type MessageType= 'success' | 'error' | 'default';

// 函数中创建组件
const createMessage = (message: string, type: MessageType, timeout = 2000) => {
    // 使用 createApp 传入一个组件，和 props
    const messageInstance = createApp(Message, {
        message,
        type
    })
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);
    messageInstance.mount(mountNode);
    // 显示的时间到后清除组件和节点
    setTimeout(()=>{
        messageInstance.unmount();
        document.body.removeChild(mountNode);
    }, timeout);
}

export default createMessage;