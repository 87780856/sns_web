import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import userview from './modules/userview'
import tagsview from './modules/tagsview'
import errorlog from './modules/errorlog'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    errorlog,
    tagsview,
    userview,
  },
})
