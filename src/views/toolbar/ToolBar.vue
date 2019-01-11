<template>
  <div class='main_toolbar'
    ref='mainToolBar'>
    <Hamburger class='main_toolbar_hamburger'
      :isActive='hamburgerState'
      @toggleClicked='__hamburgerClicked' />
    <SimpleBreadcrumb class='main_toolbar_breadcrumb' />
    <div class='main_toolbar_right'>
      <el-tooltip content='布局大小'
        effect='light'
        placement='top'>
        <ControlSizeSelect class='main_toolbar_right_controlsizeselect' />
      </el-tooltip>
      <el-tooltip content='全屏'
        effect='light'
        placement='top'>
        <Screenfull class='main_toolbar_right_screenfull' />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import Hamburger from '@/views/toolbar/Hamburger'
import SimpleBreadcrumb from '@/components/Widgets/SimpleBreadcrumb'
import Screenfull from '@/views/toolbar/Screenfull'
import ControlSizeSelect from '@/views/toolbar/ControlSizeSelect'

export default {
  name: 'ToolBar',
  components: {
    SimpleBreadcrumb,
    Hamburger,
    Screenfull,
    ControlSizeSelect,
  },
  data: function () {
    return {

      // 菜单激活状态
      hamburgerState: false,
    }
  },
  computed: {
    ...mapState({
      'windowsSizeStyle': state => state.app.windowsSizeStyle,
    }),
  },
  methods: {
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
  }

}
</script>

<style scoped>
/* 设置toolbar的高度，控制toolbar的子控件高度 */
.main_toolbar {
  height: 48px;
  line-height: 48px;
}

.main_toolbar_hamburger {
  display: inline-block;
  padding: 0 10px;
}

.main_toolbar_breadcrumb {
  display: inline-block;
  padding: 0 10px;
}

.main_toolbar_right {
  float: right;
  padding: 0 10px;
}
.main_toolbar_right_screenfull {
  display: inline-block;
  padding: 0 10px;
}
.main_toolbar_right_controlsizeselect {
  display: inline-block;
  padding: 0 10px;
}
</style>

