<template>
  <el-tabs ref='elTabs'
    class='tabs'
    :type='tabsUI.type'
    :closable='tabsUI.closable'
    :addable='tabsUI.addable'
    :editable='tabsUI.editable'
    v-model='currentTab'
    :tab-position='tabsUI.tabPosition'
    :stretch='tabsUI.stretch'
    :before-leave='tabsUI.beforeLeave'
    @tab-remove='(tabName)=>{ /**/ $emit("tabRemove", tabName)}'
    @tab-click='(tabName)=>{ /**/ $emit("tabClick", tabName)}'>
    <el-tab-pane v-for="(item, index) in editableTabs"
      class='eltabpane'
      :key="item.name"
      :label="item.name"
      :name="item.name">
      <slot v-bind:itemname='item.name'></slot>
      <!-- <transition name='fade' mode='out-in'>
        <router-view />
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
  methods: {
    setCurrentTab(tabName) {
      this.currentTab = tabName
      this.__handleResize()
    },
    setTabs(tabs) {
      this.editableTabs = tabs
    },

    __handleResize(tabName) {
      let tabsHeader = this.$refs.elTabs.$el.firstElementChild
      let tabsContent = this.$refs.elTabs.$el.lastElementChild
      let dynamicHeight = 'calc('
        + this.$el.offsetHeight + 'px'
        + ' - ' + tabsHeader.offsetHeight + 'px'
        + ')'
      tabsContent.style.height = dynamicHeight
    }

  },
  mounted() {
    window.addEventListener('resize', this.__handleResize)
    this.__handleResize()
  },
  watch: {
  },
}
</script>

<style scoped>
.eltabpane {
  overflow: auto;
}
</style>
