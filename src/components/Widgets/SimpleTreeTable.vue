<template>
  <el-container class='elcontainer'>
    <el-aside>
      <SimpleTree ref='simpleTree'
        :treeFilterVisible='treeFilterVisible'
        :treeFilterUI='treeFilterUI'
        :treeFilter='treeFilter'
        :treeUI='treeUI'
        :treeInfo='treeInfo'
        @nodeClick='__queryTableData' />
    </el-aside>
    <el-main>
      <SimpleTable ref='simpleTable'
        :tableFilterVisible='tableFilterVisible'
        :tableFilterUI='tableFilterUI'
        :tableFilterInfo='tableFilterInfo'
        :tableUI='tableUI'
        :tableInfo='tableInfo'
        :toolButtonGroup='toolButtonGroup'
        @tableDataSaved='__queryTreeData' />
    </el-main>
  </el-container>
</template>

<script>
import * as utils_resource from '@/utils/resource'
import SimpleTree from '@/components/Widgets/SimpleTree'
import SimpleTable from '@/components/Widgets/SimpleTable'


export default {
  name: 'SimpleTreeTable',
  components: {
    SimpleTree,
    SimpleTable
  },
  props: {
    /**
     * 是否显示树的过滤信息
     */
    treeFilterVisible: {
      type: Boolean,
      default: true,
    },
    /**
     * 树过滤条件信息，参见SimpleTree的treeFilterUI属性 
     */
    treeFilterUI: {
      type: Object,
      default: function () {
        return {
          labelPosition: 'top',
          size: 'mini',
        }
      },
    },
    /**
     * 树过滤条件信息，参见SimpleTree的treeFilter属性 
     */
    treeFilter: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 表ui
     * 参见element-ui组件el-tree的属性
     * 不支持懒加载属性:lazy, load
     */
    treeUI: {
      type: Object,
      default: function () { },
    },
    /** 
     * 树信息，参见SimpleTree的tree对象 
     */
    treeInfo: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 是否显示表过滤信息
     */
    tableFilterVisible: {
      type: Boolean,
      default: true,
    },
    /**
     * 表过滤条件信息，参见SimpleTable的tableFilterUI属性
     */
    tableFilterUI: {
      type: Object,
      default: function () {
        return {
          inline: true,
          inlineMessage: true,
          size: 'mini',
        }
      },
    },

    /**
     * 表过滤条件信息，参见SimpleTable的tableFilter属性
     */
    tableFilterInfo: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 表ui
     * 参见element-ui组件el-table的属性
     */
    tableUI: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 树信息, 参见SimpleTable的table属性
     */
    tableInfo: {
      type: Object,
      default: function () { return {} }
    },
    /**
     * 表关联树的属性
     */
    tableAssoProp: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      toolButtonGroup: [
        {
          uri: 'search',
          click: this.__queryTableData,
        },
        {
          uri: 'add',
          click: this.__insertTableData,
        },
      ]
    }
  },
  methods: {
    /**
     * 校验表单元格的唯一性 
     */
    validateTableCellUnique(rule, value, callback) {
      this.$refs.simpleTable.validateTableCellUnique(rule, value, callback)
    },

    // 根据树节点uri查询表的数据
    __queryTableData() {
      // 树
      var currentTreeNodeUri = this.$refs.simpleTree.getCurrentKey()
      if (!currentTreeNodeUri) {
        return
      }
      var comparison = null
      if (this.$refs.simpleTree.isTreeRoot(currentTreeNodeUri)) {
        currentTreeNodeUri = 'True'
        comparison = 'isnull'
      }

      // 表 todo改造
      var filters = this.$refs.simpleTable.getFilterFormProps()
      utils_resource.addProperty(filters, { fieldName: this.tableAssoProp, editValue: currentTreeNodeUri, comparison })
      this.$refs.simpleTable.fetchData(filters)
    },
    __insertTableData() {
      // 树
      var currentTreeNodeUri = this.$refs.simpleTree.getCurrentKey()
      if (!currentTreeNodeUri) {
        this.$message({ message: '请点击选择树节点', type: 'info' })
        return
      }
      if (this.$refs.simpleTree.isTreeRoot(currentTreeNodeUri)) {
        currentTreeNodeUri = null
      }

      // 表
      this.$refs.simpleTable.insertData({
        fieldName: this.tableInfo.parentFieldName,
        editValue: currentTreeNodeUri,
      })
    },
    // 刷新树
    __queryTreeData() {
      this.$refs.simpleTree.fetchData(this.$refs.simpleTree.getCurrentKey())
    },
  },
}
</script>
<style scoped>
.elcontainer {
  height: 100%;
}
</style>


