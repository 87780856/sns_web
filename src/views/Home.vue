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
        <ToolBar />
        <DynamicTabs ref='mainDynamicTabs'
          :tabsUI='tabsUI'
          @tabRemoved='__removeMenuTab'
          @tabClicked='__setCurrentMenuTab'>
          <template slot-scope='tabWidget'>
            <transition name="fade-transform"
              mode="out-in">
              <keep-alive>
                <router-view :key='key' />
              </keep-alive>
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
import ToolBar from '@/views/toolbar/ToolBar'
import DynamicTabs from '@/components/Widgets/DynamicTabs'
// import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'Home',
  components: {
    SimpleNavMenu,
    ToolBar,
    DynamicTabs
  },
  data: function () {
    return {
      routers: this.$store.getters.userView.menuItems,
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
    this.__addMenuTab()
  },
  methods: {
    __setCurrentMenuTab(tab) {
      if (!tab.$props.name) return
      this.__updateCurrentVisitedView(tab.$props.name)
    },
    __addMenuTab() {
      this.$store.dispatch('addView', this.$route)
      this.$refs.mainDynamicTabs.setTabs(this.visitedViews)
      this.__updateCurrentVisitedView(this.$route.name)
    },
    __removeMenuTab(tabName) {
      if (!tabName) return
      if (tabName === '首页') {
        return
      }
      this.$store.dispatch('delView', tabName)
      this.$refs.mainDynamicTabs.setTabs(this.visitedViews)

      if (this.currentVisitedView.name === tabName) {
        // 设置当前激活的路由
        let currentTabName = this.visitedViews[this.visitedViews.length - 1].name
        this.__updateCurrentVisitedView(currentTabName)
      }
    },
    __updateCurrentVisitedView(viewName) {
      this.$store.dispatch('updateCurrentVisitedViewName', viewName)
      this.$refs.mainDynamicTabs.setCurrentTab(viewName)
      this.$router.push({ name: viewName })
    },
    __handleResize() {
      let containerHeaderOffsetHeight = this.$refs.containerHeader ? this.$refs.containerHeader.$el.offsetHeight : '0'
      let mainToolBarOffsetHeight = this.$refs.mainToolBar ? this.$refs.mainToolBar.offsetHeight : '0'
      let containerFooterOffsetHeight = this.$refs.containerFooter ? this.$refs.containerFooter.$el.offsetHeight : '0'
      let dynamicHeight = 'calc( 100% '
        + ' - ' + containerHeaderOffsetHeight + 'px'
        + ' - ' + mainToolBarOffsetHeight + 'px'
        + ' - ' + containerFooterOffsetHeight + 'px'
        + ' - 0px'
        + ' )'
      if (this.$refs.mainDynamicTabs) {
        this.$refs.mainDynamicTabs.$el.style.height = dynamicHeight
      }
    },
  },
  computed: {
    ...mapState({
      'visitedViews': state => state.tagsview.visitedViews,
      'currentVisitedView': state => state.tagsview.currentVisitedView,
      'controlSize': state => state.app.controlSize,
    }),
    key() {
      return this.currentVisitedView.name + this.controlSize
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.meta.openmode === 'current') {

      } else if (to.meta.openmode === 'newwindow') {

      } else {
        this.__addMenuTab()
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
</style>
