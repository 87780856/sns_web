import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

import MainWindows from '../views/layout/MainWindows'
//业务通用组件
import SysParamType from '@/components/Views/System/SysParamType'
import SysParamValue from '@/components/Views/System/SysParamValue'
import AppInstance from '@/components/Views/System/AppInstance'
import BizParamType from '@/components/Views/System/BizParamType'
//
import BizParamValue from '@/components/Views/System/BizParamValue'
//
// import ControlObject from '@/components/Permission/ControlObject'
import Account from '@/components/Views/Permission/Account'
// import AccountDetail from '@/components/Views/Permission/AccountDetail'
import Role from '@/components/Views/Permission/Role'
//
import Organization from '@/components/Views/OrgEmployee/Organization'
import Employee from '@/components/Views/OrgEmployee/Employee'
import IndividualMember from '@/components/Views/Member/IndividualMember'

/* login */
const Login = _import('login/index')

/* dashboard */
const dashboard = _import('dashboard/index')

/* error page */
const Err404 = _import('404')

/* demo page */
// const Form = _import('page/form')
// const Table = _import('table/index')
// const RegionView = _import('business_info/RegionView')
// const StationView = _import('business_info/StationView')
// const CompanyView = _import('business_info/CompanyView')
// const treeView = _import('business_info/treeView')
// const TreeTableView = _import('business_info/TreeTableView')

// const test = _import('business_info/test')

Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    hidden: true,
  },
  {
    path: '/404',
    component: Err404,
    hidden: true,
  },
  {
    path: '/',
    component: MainWindows,
    redirect: '/dashboard',
    name: 'Home',
    meta: {
      icon: 'zujian',
    },
    children: [
      {
        path: 'dashboard',
        component: dashboard,
        name: '首页',
        meta: {
          icon: 'el-icon-menu',
        },
      },
      {
        path: 'permission',
        component: _import('layout/index'),
        name: '权限管理',

        children: [
          {
            path: 'account',
            component: Account,
            name: '账号管理',
            // children: [
            //   {
            //     path: 'accountdetail',
            //     component: AccountDetail,
            //     name: '账号明细',
            //     meta: {
            //       icon: 'el-icon-edit',
            //       openmode: 'current', // current为当前，newtab为新开tab，newwindow为新开窗口
            //     },
            //   },
            // ],
            meta: {
              icon: 'el-icon-edit',
              //leaf: true,
            },
          },
          {
            path: 'role',
            component: Role,
            name: '角色管理',
            meta: {
              icon: 'el-icon-edit',
            },
          },
          // {
          //   path: 'accountdetail',
          //   component: AccountDetail,
          //   name: '账号明细',
          //   meta: {
          //     icon: 'el-icon-edit',
          //     openmode: 'noopen', // noopen为不新开界面，默认为新开tab界面
          //     hidden: true,
          //   },
          // },
          // {
          //   path: 'index2',
          //   component: ControlObject,
          //   name: '控制对象',
          //   icon: 'zonghe',
          //   meta: {
          //     icon: 'el-icon-printer',
          //   },
          // },
        ],
        meta: {
          icon: 'el-icon-goods',
        },
      },

      {
        path: 'system',
        component: _import('layout/index'),
        name: '用户配置管理',
        children: [
          {
            path: 'index2',
            component: BizParamValue,
            name: '业务参数',
            icon: 'zonghe',
            meta: {
              icon: 'el-icon-printer',
            },
          },
        ],
        meta: {
          icon: 'el-icon-goods',
        },
      },
      {
        path: 'develop',
        name: '开发配置管理',
        component: _import('layout/index'),
        children: [
          {
            path: 'index',
            component: SysParamType,
            name: '系统参数类型',
            meta: {
              icon: 'el-icon-edit',
            },
          },
          {
            path: 'index2',
            component: SysParamValue,
            name: '系统参数',
            meta: {
              icon: 'el-icon-printer',
            },
          },
          {
            path: 'index3',
            component: AppInstance,
            name: '所属应用',
            meta: {
              icon: 'el-icon-edit',
            },
          },
          {
            path: 'index5',
            component: BizParamType,
            name: '业务参数类型',
            meta: {
              icon: 'el-icon-edit',
            },
          },
        ],
        meta: {
          icon: 'el-icon-goods',
        },
      },

      // {
      //   path: 'OrgEmployee',
      //   name: '组织人员管理',
      //   component: _import('layout/index'),
      //   icon: 'zujian',
      //   meta: {
      //     icon: 'el-icon-goods',
      //   },
      //   children: [
      //     {
      //       path: 'index',
      //       component: Organization,
      //       name: '组织机构维护',
      //       icon: 'zonghe',
      //       meta: {
      //         icon: 'el-icon-edit',
      //       },
      //     },
      //     {
      //       path: 'index2',
      //       component: Employee,
      //       name: '员工维护',
      //       icon: 'zonghe',
      //       meta: {
      //         icon: 'el-icon-printer',
      //       },
      //     },
      //   ],
      // },
      // {
      //   path: 'Member',
      //   name: '会员管理',
      //   component: _import('layout/index'),
      //   icon: 'zujian',
      //   meta: {
      //     icon: 'el-icon-goods',
      //   },
      //   children: [
      //     {
      //       path: 'index',
      //       component: IndividualMember,
      //       name: '个人会员管理',
      //       icon: 'zonghe',
      //       meta: {
      //         icon: 'el-icon-edit',
      //       },
      //     },
      //     // {
      //     //   path: 'index2',
      //     //   component: Employee,
      //     //   name: '员工维护',
      //     //   icon: 'zonghe',
      //     //   meta: {
      //     //     icon: 'el-icon-printer'
      //     //   }
      //     // }
      //   ],
      // },
    ],
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRouterMap,
})

export const asyncRouterMap = [
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'Example',
  //   icon: 'zujian',
  //   meta: { icon: 'zujian' },
  //   children: [
  //     { path: 'index', component: Form, name: 'Form', icon: 'zonghe', meta: { icon: 'zonghe' } }
  //   ]
  // },

  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/index',
  //   icon: 'tubiao',
  //   noDropdown: true,
  //   meta: {noDropdown: true, icon: 'tubiao' },
  //   children: [{ path: 'index', component: Table, name: 'Table', meta: { role: ['admin'], icon: 'el-icon-goods' }}]
  // },

  // {
  //   path: '/basicinformation',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: '基础信息',
  //   icon: 'zujian',
  //   meta: { icon: 'zujian' },
  //   children: [
  // { path: 'index', component: RegionView, name: '区域维护', icon: 'zonghe', meta: { icon: 'zonghe' } },
  // { path: 'index2', component: StationView, name: '站点', icon: 'zonghe', meta: { icon: 'zonghe' } },
  // { path: 'index3', component: CompanyView, name: '车属单位', icon: 'zonghe', meta: { icon: 'zonghe' } },
  // { path: 'index6', component: TreeTableView, name: '树表', icon: 'zonghe', meta: { icon: 'zonghe' } },

  // { path: 'index5', component: test, name: '测试树', icon: 'zonghe', meta: { icon: 'zonghe' } },

  // { path: 'index4', component: treeView, name: '树', icon: 'zonghe', meta: { icon: 'zonghe' } }
  //   ]
  // },

  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]
