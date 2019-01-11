export default {
  state: {
    /**
     * 当前窗体大小类型，STYLE_MOBILE/STYLE_DESKTOP,STYLE_DESKTOP
     */
    windowsSizeStyle: 'STYLE_DESKTOP',
    /**
     * 控件大小 medium/small/mini
     */
    controlSize: 'medium',
  },
  mutations: {
    /**
     * 设置窗体大小类型
     */
    SET_WINDOWS_SIZE_STYLE: (state, style) => {
      state.windowsSizeStyle = style
    },
    /**
     * 设置控件大小
     */
    SET_CONTROL_SIZE: (state, size) => {
      state.controlSize = size
    },
  },
  actions: {
    setControlSize({ commit }, size) {
      commit('SET_CONTROL_SIZE', size)
    },
  },
}
