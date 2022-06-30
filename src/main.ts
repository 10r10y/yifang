import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import axios from 'axios';

axios.defaults.baseURL = "http://apis.imooc.com/api/";
axios.interceptors.request.use(config => {
    // get 请求，添加到 url 中
    config.params = { ...config.params, icode: '6E2125E81587AC9F' }
    // 其他请求，添加到 body 中
    if (config.data instanceof FormData) {  // 如果是上传文件，添加到 FormData 中
      config.data.append('icode', '6E2125E81587AC9F')
    } else {    // 普通的 body 对象，添加到 data 中
      config.data = { ...config.data, icode: '6E2125E81587AC9F' }
    }
    return config
})
axios.get("columns").then(resp => {
    console.log(resp.data);
})

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
