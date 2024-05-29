import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import hljsVuePlugin from '@highlightjs/vue-plugin';
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(hljsVuePlugin); 
app.mount('#app')

