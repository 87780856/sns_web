export default {
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
        state.menuTabs.splice(index, 1)
      }
    },
    /**
     * 设置当前tab页
     */
    SET_CURRENT_MENU_TAB: (state, tabName) => {
      state.currentMenuTabName = tabName
    },
  },
  actions: {},
}