import Cookies from 'js-cookie'

const app = {
  state: {
    /**
     * tab页列表
      [
        {
          name: 'xxx',
        }
      ]
     */
    menuTabs: [],
    /**
     * 当前tab页
     */
    currentMenuTabName: '',


    //////////////////////////
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    visitedViews: []
  },
  mutations: {
    /**
     * 增加tab页
     */
    ADD_MENU_TAB: (state, data) => {
      state.menuTabs.push(data)
    },
    /**
     * 删除tab页
     */
    DELETE_MENU_TAB: (state, tabName) => {
      let index = state.menuTabs.findIndex(tab => {
        return tab.name === tabName
      })
      if (index !== -1) {
        state.menuTabs.splice(index, 1);
      }
    },
    /**
     * 设置当前tab页
     */
    SET_CURRENT_MENU_TAB: (state, tabName) => {
      state.currentMenuTabName = tabName;
    },

    //////////////////////////
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return //some用于检测数组中的元素是否满足指定条件
      state.visitedViews.push({
        name: view.name,
        path: view.path
      })
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    }
  },
  actions: {
    ToggleSideBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews({
      commit
    }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({
      commit,
      state
    }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default app
