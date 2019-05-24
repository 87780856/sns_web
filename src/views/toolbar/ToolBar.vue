<template>
  <div class='main_toolbar'
    ref='mainToolBar'>
    <Hamburger class='main_toolbar_hamburger'
      :isActive='hamburgerState'
      @toggleClicked='__hamburgerClicked' />
    <Breadcrumb class='main_toolbar_breadcrumb' />
    <div class='main_toolbar_right'>
      <el-tooltip content='布局大小'
        effect='light'
        placement='top'>
        <ControlSizeSelect class='main_toolbar_right_controlsizeselect' />
      </el-tooltip>
      <el-tooltip content='语言'
        effect='light'
        placement='top'>
        <LangSelect class='main_toolbar_right_langselect' />
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
import Breadcrumb from '@/views/toolbar//Breadcrumb'
import ControlSizeSelect from '@/views/toolbar/ControlSizeSelect'
import LangSelect from '@/views/toolbar/LangSelect'
import Screenfull from '@/views/toolbar/Screenfull'

export default {
  name: 'ToolBar',
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect,
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
        let menuCollapsedFlag = false
        if (this.hamburgerState) {
          menuCollapsedFlag = false
        } else {
          //this.menuUI.collapse = true
          menuCollapsedFlag = true
        }
        this.hamburgerState = !this.hamburgerState
        /**
         * form表单中得到改变的值.
         *
         * @event menuCollapsed
         * @type {boolean}
         */
        this.$emit('menuCollapsed', menuCollapsedFlag)
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
  padding: 0 8px;
}
.main_toolbar_breadcrumb {
  display: inline-block;
  padding: 0 8px;
}
.main_toolbar_right {
  float: right;
  padding: 0 8px;
}
.main_toolbar_right_controlsizeselect {
  display: inline-block;
  padding: 0 8px;
}
.main_toolbar_right_langselect {
  display: inline-block;
  padding: 0 8px;
}
.main_toolbar_right_screenfull {
  display: inline-block;
  padding: 0 8px;
}
</style>

