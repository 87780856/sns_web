<template>
  <el-container class='container'>
    <el-header height='auto'></el-header>
    <el-container>
      <el-aside width='auto'>
        <SimpleNavMenu :menuInfo='menuInfo'
          :routerModel='routers'
          parentPath='/' />
      </el-aside>
      <el-main ref='elmain'>
        <div class='main_toolbar'>
          <SimpleHamburger @toggleClicked='__hamburgerClicked' />
          <SimpleBreadcrumb ref='simpleBreadcrumb' />
        </div>
        <DynamicTabs ref='menuTabs'
          :tabsUI='tabsUI'
          @tabRemove='removeMenuTab'
          @tabClick='setCurrentMenuTab'>
          <template slot-scope='tabWidget'>
            <transition name='fade'
              mode='out-in'>
              <router-view />
            </transition>
          </template>
        </DynamicTabs>
      </el-main>
    </el-container>
    <el-footer height='auto'></el-footer>
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
  created() {
    //简单的过滤数据（过滤完再传进来？）
    // this.permission_routers.forEach(element => {
    //   if (!element.hidden) {               //过滤其他的
    //     this.routers = element.children     //只得到孩子的对象数组
    //   } else {
    //     // console.log('过滤的')
    //   }
    // })
  },

  beforeMount() {
    // 捕获从根开始
    window.addEventListener('resize', this.__handleResize)
  },
  mounted() {
    this.__handleResize()

    // 添加首页菜单
    this.addMenuTab('首页')

    // // 首先在Virtual DOM渲染数据时，设置下menuTabs的高度．计算menuTabs的高度
    // var dynamicHeight = 'calc( 100% '
    //   + ' - ' + this.$refs.horizontalNavMenu.$el.offsetHeight + 'px'
    //   + ' - ' + this.$refs.simpleBreadcrumb.$el.offsetHeight + 'px'
    //   + ' - 1px'
    //   + ')'
    // this.$refs.menuTabs.$el.style.height = dynamicHeight
    // // 然后监听window的resize事件．在浏览器窗口变化时再设置下menuTabs的高度
    // // 浏览器的高度为`${document.documentElement.clientHeight}px`
    // var that = this
    // window.onresize = function () {
    //   dynamicHeight = 'calc( 100% '
    //     + ' - ' + that.$refs.horizontalNavMenu.$el.offsetHeight + 'px'
    //     + ' - ' + that.$refs.simpleBreadcrumb.$el.offsetHeight + 'px'
    //     + ' - 1px'
    //     + ')'
    //   that.$refs.menuTabs.$el.style.height = dynamicHeight
    // }

  },
  data: function () {
    return {
      routers: this.$store.getters.userView.menuItems,
      menuInfo: {
        mode: 'vertical',
        router: true
      },
      tabsUI: {
        type: 'card',
        closable: true,
      },
    }
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
      if (index !== -1) {
        this.__setCurrentMenuTab(tabName)
      }
      else {
        this.__addMenuTab(tabName)
        this.__setCurrentMenuTab(tabName)
      }
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
      this.$refs.menuTabs.setCurrentTab(tabName)
      this.$router.push({ name: tabName })

    },
    __addMenuTab(tabName) {
      this.$store.commit('ADD_MENU_TAB', { name: tabName })
      this.$refs.menuTabs.setTabs(this.menuTabs)
    },
    __removeMenuTab(tabName) {
      this.$store.commit('DELETE_MENU_TAB', tabName)
      this.$refs.menuTabs.setTabs(this.menuTabs)
    },
    __handleResize() {
      let dynamicHeight = 'calc( 100% '
        + ' - ' + this.$refs.horizontalNavMenu.$el.offsetHeight + 'px'
        + ' - ' + this.$refs.simpleBreadcrumb.$el.offsetHeight + 'px'
        + ' - 0px'
        + ')'
      this.$refs.menuTabs.$el.style.height = dynamicHeight
    },
    __hamburgerClicked() {
      console.log('aaa')
    },
  },

  computed: {
    ...mapState({
      'menuTabs': state => state.app.menuTabs,
      'currentMenuTabName': state => state.app.currentMenuTabName,
    }),

    // ...mapGetters([
    //   'permission_routers'  //对象数组，得到路由中所有的信息
    // ]),

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
.container {
  position: relative;
  height: 100%;
  width: 100%;
}

.main_toolbar {
  height: 48px;
  line-height: 48px;
}
</style>
