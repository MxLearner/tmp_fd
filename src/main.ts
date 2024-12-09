import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
const app = createApp(App)

import router from './router/index'
app.use(router)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

import { createPinia } from 'pinia'
app.use(createPinia())

import http from './utils/request.ts'
app.use(http)


app.mount('#app')
