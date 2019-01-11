<template>
  <el-breadcrumb separator="/">
    <template v-for="(item,index)  in levelList">
      <template v-if='item.redirect==="noredirect"||index==levelList.length-1'>
        <el-breadcrumb-item to=""
          class="no-redirect">{{item.name}}</el-breadcrumb-item>
      </template>
      <template v-else>
        <el-breadcrumb-item :to="item.redirect||item.path">{{item.name}}</el-breadcrumb-item>
      </template>
    </template>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  created() {
    this.__getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    __getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      matched.shift()
      const first = matched[0]

      if (first && (first.name !== '首页' || first.path !== '')) {
        matched = [{ name: '首页', path: '/' }].concat(matched)
      }

      this.levelList = matched
    }
  },
  watch: {
    $route() {
      this.__getBreadcrumb()
    }
  }
}
</script>

<style scoped>
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>
