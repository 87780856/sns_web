import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import userview from './modules/userview'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    userview,
  },
})
