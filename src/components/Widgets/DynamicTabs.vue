<template>
  <el-tabs ref='elTabs'
    :type='tabsUI.type'
    :closable='tabsUI.closable'
    :addable='tabsUI.addable'
    :editable='tabsUI.editable'
    v-model='currentTab'
    :tab-position='tabsUI.tabPosition'
    :stretch='tabsUI.stretch'
    :before-leave='tabsUI.beforeLeave'
    @tab-remove='(tabName)=>{__tabRemoved(tabName)}'
    @tab-click='(tabName)=>{__tabClicked(tabName)}'>
    <el-tab-pane class='eltabpane'
      v-for="(item, index) in editableTabs"
      :key="item.name"
      :label="item.name"
      :name="item.name">
      <slot v-bind:itemname='item.name'></slot>
      <!-- <transition name='fade' mode='out-in'>
              <keep-alive :include='cachedViews'>
                <router-view :key="key" />
              </keep-alive>
      </transition> -->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'SimpleTabs',
  components: {
  },
  props: {
    /**
     * tabsui 参见elementui的el-tabs属性,不包括type,value属性
     */
    tabsUI: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data: function () {
    return {
      currentTab: '',
      editableTabs: [],
    }
  },
  mounted() {
    // 捕获从根开始
    window.addEventListener('resize', this.__handleResize)
    this.__handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.__handleResize)
  },
  methods: {
    setCurrentTab(tabName) {
      this.currentTab = tabName
      this.__handleResize()
    },
    setTabs(tabs) {
      this.editableTabs = tabs
    },
    __tabClicked(tabName) {
      /**
       * tab被点击
       * @event tabClicked
       * @type {string}
       */
      this.$emit("tabClicked", tabName)
    },

    __tabRemoved(tabName) {
      /**
       * tab被移除
       * @event tabRemoved
       * @type {string}
       */
      this.$emit("tabRemoved", tabName)
    },

    __handleResize() {
      if (this.$refs.elTabs) {
        let tabsHeader = this.$refs.elTabs.$el.firstElementChild
        let tabsContent = this.$refs.elTabs.$el.lastElementChild
        let dynamicHeight = 'calc( '
          + this.$el.offsetHeight + 'px'
          + ' - ' + tabsHeader.offsetHeight + 'px'
          + ' )'
        tabsContent.style.height = dynamicHeight

        let dynamicWidth = 'calc( '
          + this.$el.offsetWidth + 'px'
          + ' )'

        tabsContent.style.width = dynamicWidth
      }
    }

  },
  watch: {
  },
}
</script>

<style scoped>
.eltabpane {
  height: 99%;
  border: solid 1px #e5eaf2;
}
</style>
