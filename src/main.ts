import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import JsonViewer from "vue3-json-viewer"
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(JsonViewer)
app.mount('#app')

