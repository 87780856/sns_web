const tagsView = {
  state: {
    /**
     * 被访问的视图
     * [{name: 'xxx',}]
     */
    visitedViews: [],
    /**
     * 被缓存的视图
     * [{name: 'xxx',}]
     */
    cachedViews: [],
    /**
     * 当前被访问的视图
     * [{name: 'xxx',}]
     */
    currentVisitedView: { name: '' },
  },
  mutations: {
    ADD_VISITED_VIEW: (state, view) => {
      if (state.visitedViews.some(v => v.name === view.name)) return
      state.visitedViews.push({ name: view.name })
    },
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.some(v => v.name === view.name)) return
      if (!view.meta.noCache) {
        state.cachedViews.push({ name: view.name })
      }
    },

    DEL_VISITED_VIEW: (state, viewName) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.name === viewName) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW: (state, viewName) => {
      let i = state.cachedViews.findIndex(v => {
        return v.name === viewName
      })
      if (i !== -1) {
        state.cachedViews.splice(i, 1)
      }
    },

    DEL_OTHERS_VISITED_VIEWS: (state, viewName) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.name === viewName) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
    },
    DEL_OTHERS_CACHED_VIEWS: (state, viewName) => {
      for (const [i, v] of state.cachedViews.entries()) {
        if (v.name === viewName) {
          state.cachedViews = state.cachedViews.slice(i, i + 1)
          break
        }
      }
    },

    DEL_ALL_VISITED_VIEWS: state => {
      state.visitedViews = []
    },
    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = []
    },

    UPDATE_CURRENT_VISITED_VIEW_NAME: (state, viewName) => {
      state.currentVisitedView = { name: viewName }
    },
  },
  actions: {
    addView({ dispatch }, view) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    },
    addVisitedView({ commit }, view) {
      commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }, view) {
      commit('ADD_CACHED_VIEW', view)
    },

    delView({ dispatch, state }, viewName) {
      return new Promise(resolve => {
        dispatch('delVisitedView', viewName)
        dispatch('delCachedView', viewName)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
        })
      })
    },
    delVisitedView({ commit, state }, viewName) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', viewName)
        resolve([...state.visitedViews])
      })
    },
    delCachedView({ commit, state }, viewName) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', viewName)
        resolve([...state.cachedViews])
      })
    },

    delOthersViews({ dispatch, state }, viewName) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', viewName)
        dispatch('delOthersCachedViews', viewName)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
        })
      })
    },
    delOthersVisitedViews({ commit, state }, viewName) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', viewName)
        resolve([...state.visitedViews])
      })
    },
    delOthersCachedViews({ commit, state }, viewName) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', viewName)
        resolve([...state.cachedViews])
      })
    },

    delAllViews({ dispatch, state }) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews')
        dispatch('delAllCachedViews')
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
        })
      })
    },
    delAllVisitedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    },

    updateCurrentVisitedViewName({ commit }, viewName) {
      commit('UPDATE_CURRENT_VISITED_VIEW_NAME', viewName)
    },
  },
}

export default tagsView
