import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';

import Vant from 'vant'
import 'vant/lib/index.css'
import { VueMasonryPlugin } from 'vue-masonry';
import { Search } from 'vant';

import { Lazyload } from 'vant';


import { Popup } from 'vant';




const app = createApp(App)

axios.defaults.withCredentials = true



app.use(createPinia())
app.use(router)
app.use(Antd);
app.use(Vant)
app.use(Search);
app.use(VueMasonryPlugin)
app.use(Popup);
app.use(Lazyload);

// 注册时可以配置额外的选项
app.use(Lazyload, {
    lazyComponent: true,
  });

if (import.meta.env as any === 'development') {
} else {
}
app.mount('#app')