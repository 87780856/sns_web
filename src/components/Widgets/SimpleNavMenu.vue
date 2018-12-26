<template>
  <el-menu :mode='menuInfo.mode'
    :collapse='menuInfo.collapse'
    :background-color='menuInfo.backgroundColor'
    :text-color='menuInfo.textColor'
    :active-text-color='menuInfo.activeTextColor'
    :default-active='menuInfo.defaultActive'
    :default-openeds='menuInfo.defaultOpeneds'
    :unique-opened='menuInfo.uniqueOpened'
    :menu-trigger='menuInfo.menuTrigger'
    :router='menuInfo.router'
    :collapse-transition='menuInfo.collapseTransition'>
    <!--routerModel为包含children的对象数组-->
    <template v-for='router in routerModel'>
      <SimpleNavMenuItem :router='router'
        :parentPath='parentPath' />
    </template>
  </el-menu>
</template>

<script>
import SimpleNavMenuItem from './SimpleNavMenuItem'

export default {
  name: 'SimpleNavMenu',
  props: {
    /**
     * 
     */
    menuInfo: {
      type: Object,
      default: function () {
        return {
          defaultActive: $route.path,
          router: true,
        }
      }
    },

    routerModel: {
      type: Array,
    },
    parentPath: {
      type: String,
    },

  },
  data() {
    return {

    }
  },

  components: { SimpleNavMenuItem }
}
</script>

