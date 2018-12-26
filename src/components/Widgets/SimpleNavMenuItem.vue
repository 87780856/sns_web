<template>
  <!--当router有孩子的时候-->
  <el-submenu v-if='router.children && router.meta.leaf !==true'
    :key='router.name'
    :index='routerData+router.path'>
    <template slot='title'>
      <i :class='router.meta.icon'></i> {{router.name}}
    </template>
    <template v-for='child in router.children'>
      <SimpleNavMenuItem :router='child'
        :parentPath='routerData+router.path'
        :key='child.name' />
    </template>
  </el-submenu>
  <!--当router没有孩子的时候-->
  <el-menu-item v-else
    :key='router.name'
    :index='routerData + router.path'>
    <i :class='router.meta.icon'></i> {{router.name}}
  </el-menu-item>
</template>

<script>
export default {
  name: 'SimpleNavMenuItem',
  props: {
    router: {
      type: Object,
    },
    parentPath: {
      type: String,
    }
  },

  created() {
    this.getParentPath()
  },
  methods: {
    getParentPath() {
      if (this.parentPath !== '/') {
        this.routerData = this.parentPath + '/'
      } else {
        this.routerData = this.parentPath
      }
    }
  },
  data() {
    return {
      routerData: '',
    }
  },
}
</script>

