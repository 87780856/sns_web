import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './styles/element-variables.scss'

import store from '@/store/index.js'
import router from '@/router/index.js'

import i18n from './lang' // Internationalization
import './icons'
import './errorlog.js'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(ElementUI, {
  // size: 'medium',
  i18n: (key, value) => i18n.t(key, value),
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
