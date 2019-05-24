<template>
  <el-dropdown trigger='click'
    @command='handleSetLanguage'>
    <div>
      <svg-icon class='international-svg'
        icon-name='language' />
      <i class='el-icon-arrow-down el-icon--right iconarrow' />
    </div>
    <el-dropdown-menu slot='dropdown'>
      <el-dropdown-item :disabled="language==='zh'"
        command='zh'>中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'"
        command='en'>English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SvgIcon from '@/components/Widgets/SvgIcon'
export default {
  components: { SvgIcon },
  computed: {
    ...mapState({
      'language': state => state.app.language,
    }),
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: 'Switch Language Success',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.international-svg {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
.iconarrow {
  height: 16px;
}
</style>

