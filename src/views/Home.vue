<template>
  <el-container class='home_container'>
    <el-header ref='containerHeader'
      height='auto'></el-header>
    <el-container>
      <el-aside width='auto'>
        <SimpleNavMenu :menuUI='menuUI'
          :routerModel='routers'
          parentPath='/' />
      </el-aside>
      <el-main ref='elmain'>
        <div class='main_toolbar'
          ref='mainToolBar'>
          <SimpleHamburger :isActive='hamburgerState'
            @toggleClicked='__hamburgerClicked' />
          <SimpleBreadcrumb />
        </div>
        <DynamicTabs ref='mainDynamicTabs'
          :tabsUI='tabsUI'
          @tabRemoved='removeMenuTab'
          @tabClicked='setCurrentMenuTab'>
          <template slot-scope='tabWidget'>
            <transition name='fade'
              mode='out-in'>
              <router-view />
            </transition>
          </template>
        </DynamicTabs>
      </el-main>
    </el-container>
    <el-footer ref='containerFooter'
      height='auto'></el-footer>
  </el-container>

</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SimpleNavMenu from '@/components/Widgets/SimpleNavMenu'
import SimpleHamburger from '@/components/Widgets/SimpleHamburger'
import SimpleBreadcrumb from '@/components/Widgets/SimpleBreadcrumb'
import DynamicTabs from '@/components/Widgets/DynamicTabs'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'Home',
  components: {
    SimpleNavMenu,
    SimpleBreadcrumb,
    SimpleHamburger,
    DynamicTabs
  },
  data: function () {
    return {
      routers: this.$store.getters.userView.menuItems,
      // 菜单激活状态
      hamburgerState: false,
      menuUI: {
        mode: 'vertical',
        router: true,
        collapse: false,
      },
      tabsUI: {
        type: 'card',
        closable: true,
      },
    }
  },
  created() {
  },
  beforeMount() {
    // 捕获从根开始
    window.addEventListener('resize', this.__handleResize)
  },
  mounted() {
    // 设置自定义高度
    this.__handleResize()
    // 添加首页菜单
    this.addMenuTab('首页')
  },
  methods: {
    setCurrentMenuTab(tab) {
      if (!tab.$props.name) return
      this.__setCurrentMenuTab(tab.$props.name)
    },
    addMenuTab(tabName) {
      if (!tabName) return
      let index = this.menuTabs.findIndex(tab => {
        return tab.name === tabName
      })
      if (index === -1) {
        this.__addMenuTab(tabName)
      }
      this.__setCurrentMenuTab(tabName)
    },
    removeMenuTab(tabName) {
      if (!tabName) return
      if (tabName === '首页') {
        return
      }
      this.__removeMenuTab(tabName)

      if (this.currentMenuTabName === tabName) {
        // 设置当前激活的路由
        if (this.menuTabs && this.menuTabs.length >= 1) {
          let currentTabName = this.menuTabs[this.menuTabs.length - 1].name
          this.__setCurrentMenuTab(currentTabName)
        } else {
          this.__setCurrentMenuTab('首页')
        }
      }
    },
    __setCurrentMenuTab(tabName) {
      this.$store.commit('SET_CURRENT_MENU_TAB', tabName)
      this.$refs.mainDynamicTabs.setCurrentTab(tabName)
      this.$router.push({ name: tabName })
    },
    __addMenuTab(tabName) {
      this.$store.commit('ADD_MENU_TAB', { name: tabName })
      this.$refs.mainDynamicTabs.setTabs(this.menuTabs)
    },
    __removeMenuTab(tabName) {
      this.$store.commit('DELETE_MENU_TAB', tabName)
      this.$refs.mainDynamicTabs.setTabs(this.menuTabs)
    },
    __handleResize() {
      let dynamicHeight = 'calc( 100% '
        + ' - ' + this.$refs.containerHeader.$el.offsetHeight + 'px'
        + ' - ' + this.$refs.mainToolBar.offsetHeight + 'px'
        + ' - ' + this.$refs.containerFooter.$el.offsetHeight + 'px'
        + ' - 0px'
        + ' )'
      this.$refs.mainDynamicTabs.$el.style.height = dynamicHeight
    },
    __hamburgerClicked() {
      if (this.windowsSizeStyle === 'STYLE_DESKTOP') {
        if (this.hamburgerState) {
          this.menuUI.collapse = false
        } else {
          this.menuUI.collapse = true
        }
        this.hamburgerState = !this.hamburgerState
      } else {

      }
    },
  },
  computed: {
    ...mapState({
      'menuTabs': state => state.app.menuTabs,
      'currentMenuTabName': state => state.app.currentMenuTabName,
      'windowsSizeStyle': state => state.app.windowsSizeStyle,
    }),
  },
  watch: {
    '$route'(to, from) {
      if (to.meta.openmode === 'current') {

      } else if (to.meta.openmode === 'newwindow') {

      } else {
        this.addMenuTab(to.name)
      }
    }
  },
}
</script>

<style scoped>
.home_container {
  position: relative;
  height: 100%;
  width: 100%;
}
/* 设置toolbar的高度，控制toolbar的子控件高度 */
.main_toolbar {
  height: 48px;
  line-height: 48px;
}
</style>
