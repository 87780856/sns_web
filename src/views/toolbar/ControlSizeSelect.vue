<template>
  <el-dropdown trigger='click'
    @command='__setControlSize'>
    <div>
      <svg-icon class='size-svg'
        icon-name='size' />
    </div>
    <el-dropdown-menu slot='dropdown'>
      <el-dropdown-item :disabled="controlSize==='medium'"
        command='medium'>Medium</el-dropdown-item>
      <el-dropdown-item :disabled="controlSize==='small'"
        command='small'>Small</el-dropdown-item>
      <el-dropdown-item :disabled="controlSize==='mini'"
        command='mini'>Mini</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SvgIcon from '@/components/Widgets/SvgIcon'
export default {
  name: 'ControlSizeSelect',
  components: { SvgIcon },
  computed: {
    ...mapState({
      'controlSize': state => state.app.controlSize,
    }),
  },
  methods: {
    __setControlSize(size) {
      this.$ELEMENT.size = size
      this.$store.commit('SET_WIDGET_SIZE', size)
      this.$message({
        message: 'Switch Size Success',
        type: 'success'
      })
    },
  }

}
</script>

<style scoped>
.size-svg {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
</style>

