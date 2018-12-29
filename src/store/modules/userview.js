export default {
  state: {
    loginFlag: false, // 登录标志
    token: '', // 用户id
    name: '', // 用户名
    roles: [], // 角色组
    menuItems: [], // 菜单组
    permissionItems: [], // 权限项
  },
  getters: {
    userView(state) {
      return {
        loginFlag: state.loginFlag,
        token: state.token,
        name: state.name,
        roles: state.roles,
        menuItems: state.menuItems,
        permissionItems: state.permissionItems,
      }
    },
  },
  mutations: {
    SET_USER_VIEW: (state, userView) => {
      state.loginFlag = userView.loginFlag
      state.token = userView.token
      state.name = userView.name
      state.roles = userView.roles
      // 数据库存储的菜单项todo
      state.menuItems = userView.menuItems
      state.permissionItems = userView.permissionItems
    },
    // SET_LOGIN_FLAG: (state, loginFlag) => {
    //   state.loginFlag = loginFlag
    // },
    // SET_TOKEN: (state, token) => {
    //   state.token = token
    // },
    // SET_NAME: (state, name) => {
    //   state.name = name
    // },
    // SET_ROLES: (state, roles) => {
    //   state.roles = roles
    // },
    // SET_MENU_ITEMS: (state, menuItems) => {
    //   state.menuItems = menuItems
    // },
    // SET_PERMISSION_ITEMS: (state, permissionItems) => {
    //   state.permissionItems = permissionItems
    // },
  },
  actions: {},
}
