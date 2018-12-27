import router from './router'

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  // 校验是否已经登录
  var loginFlag = false
  var hasPermission = true
  if (loginFlag) {
    if (to.path === '/login') {
      // 已经登录的情况下，如果当前路由为'/login'，则直接跳转到'/'
      next({ path: '/' })
    } else {
      // 否则
      if (hasPermission) {
        next()
      } else {
        next({ path: '/401' })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在未登录的情况下，如果在免登录白名单，直接进入
      next()
    } else {
      // 否则全部重定向到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  //
})
