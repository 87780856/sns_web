<template>
  <el-menu :mode='menuUI.mode'
    :collapse='menuUI.collapse'
    :background-color='menuUI.backgroundColor'
    :text-color='menuUI.textColor'
    :active-text-color='menuUI.activeTextColor'
    :default-active='menuUI.defaultActive'
    :default-openeds='menuUI.defaultOpeneds'
    :unique-opened='menuUI.uniqueOpened'
    :menu-trigger='menuUI.menuTrigger'
    :router='menuUI.router'
    :collapse-transition='menuUI.collapseTransition'>
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
    menuUI: {
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

