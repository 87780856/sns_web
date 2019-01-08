<template>
  <!--当router有孩子的时候-->
  <el-submenu v-if='router.children && router.meta.leaf !==true'
    :key='router.name'
    :index='__getMenuItemIndex()'>
    <template slot='title'>
      <template v-if='router.meta && router.meta.icon'>
        <i :class='router.meta.icon'></i>
      </template>
      {{ router.name }}
    </template>
    <template v-for='child in router.children'>
      <SimpleNavMenuItem :router='child'
        :parentPath='__getMenuItemIndex()'
        :key='child.name' />
    </template>
  </el-submenu>
  <!--当router没有孩子的时候-->
  <el-menu-item v-else
    :key='router.name'
    :index='__getMenuItemIndex()'>
    <template v-if='router.meta && router.meta.icon'>
      <i :class='router.meta.icon'></i>
    </template>
    {{ router.name }}
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
  data() {
    return {
      menuItemIndex: '',
    }
  },
  methods: {
    __getMenuItemIndex() {
      var retval = ''
      if (this.parentPath === '/') {
        if (this.router.path.length > 0 && this.router.path[0] === '/') {
          retval = this.router.path
        } else {
          retval = this.parentPath + this.router.path
        }
      } else {
        retval = this.parentPath + '/' + this.router.path
      }
      return retval
    }
  },
}
</script>

