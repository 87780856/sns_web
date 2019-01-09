import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from '@/store/index.js'

import router from '@/router/index.js'

import './icons'
import './errorlog.js'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
