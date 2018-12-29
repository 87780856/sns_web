import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import SvgIcon from 'vue-svgicon'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svgicon',
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
