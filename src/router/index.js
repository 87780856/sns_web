import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Layout from '@/views/Home.vue'

Vue.use(Router)

/**
 *  meta:
 *  icon
 *  leaf
 *  openmode:current、newwindow、newtab
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    name: '登录',
  },
  {
    path: '/',
    component: Layout,
    name: '主页',
    redirect: 'dashboard',
    meta: {
      icon: 'el-icon-menu',
      leaf: true,
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        name: '首页',
        meta: {
          icon: 'el-icon-menu',
        },
      },
    ],
  },
  {
    path: '/permission',
    component: Layout,
    name: '权限管理',
    meta: {
      icon: 'el-icon-menu',
    },
    children: [
      {
        path: 'account',
        component: () => import('@/components/Views/Permission/Account.vue'),
        name: '账号管理',
        meta: {
          icon: 'el-icon-menu',
        },
      },
      // {
      //   path: 'role',
      //   component: () => import('@/components/Views/Permission/Role.vue'),
      //   name: '角色管理',
      //   meta: {
      //     icon: 'el-icon-menu',
      //   },
      // },
    ],
  },
  {
    path: '/system',
    component: Layout,
    name: '用户配置管理',
    meta: {
      icon: 'el-icon-menu',
    },
    children: [
      {
        path: 'bizparamvalue',
        component: () => import('@/components/Views/System/BizParamValue.vue'),
        name: '业务参数',
        meta: {
          icon: 'el-icon-menu',
        },
      },
    ],
  },
  {
    path: '/development',
    component: Layout,
    name: '开发配置管理',
    meta: {
      icon: 'el-icon-menu',
    },
    children: [
      {
        path: 'sysparamtype',
        component: () => import('@/components/Views/System/SysParamType.vue'),
        name: '系统参数类型',
        meta: {
          icon: 'el-icon-menu',
        },
      },
      {
        path: 'sysparamvalue',
        component: () => import('@/components/Views/System/SysParamValue.vue'),
        name: '系统参数',
        meta: {
          icon: 'el-icon-menu',
        },
      },
      {
        path: 'appinstance',
        component: () => import('@/components/Views/System/AppInstance.vue'),
        name: '所属应用',
        meta: {
          icon: 'el-icon-menu',
        },
      },
      {
        path: 'bizparamtype',
        component: () => import('@/components/Views/System/BizParamType.vue'),
        name: '业务参数类型',
        meta: {
          icon: 'el-icon-menu',
        },
      },
    ],
  },
]

const router = new Router({
  // mode: 'history', //后端支持可开
  routes: constantRouterMap,
})

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  // 校验是否已经登录
  var loginFlag = store.getters.userView.loginFlag
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

export default router
