<template>
  <!-- 表 -->
  <el-form ref='elForm'
    :model='tableData'
    inlineMessage>
    <el-table ref='elTable'
      :class='tableUI.class'
      :style='tableUI.style'
      :data='tableData.getChildren()'
      :height='tableUI.height'
      :max-height='tableUI.maxHeight'
      :stripe='tableUI.stripe'
      :border='tableUI.border?tableUI.border:true'
      :size='tableUI.size'
      :max-length='tableUI.maxLength'
      :fit='tableUI.fit'
      :show-header='tableUI.showHeader'
      :highlight-current-row='tableUI.highlightCurrentRow'
      :current-row-key='tableUI.currentRowKey'
      :row-class-name='tableUI.rowClassName ? tableUI.rowClassName : __setTableRowClassName'
      :row-style='tableUI.rowStyle'
      :cell-class-name='tableUI.cellClassName'
      :cell-style='tableUI.cellStyle'
      :header-row-class-name='tableUI.headerRowClassName'
      :header-row-style='tableUI.headerRowStyle'
      :header-cell-class-name='tableUI.headerCellClassName'
      :header-cell-style='tableUI.headerCellStyle'
      :row-key='tableUI.rowKey'
      :empty-text='tableUI.emptyText'
      :default-expand-all='tableUI.defaultExpandAll'
      :expand-row-keys='tableUI.expandRowKeys'
      :default-sort='tableUI.defaultSort'
      :tooltip-effect='tableUI.tooltipEffect'
      :show-summary='tableUI.showSummary'
      :sum-text='tableUI.sumText'
      :summary-method='tableUI.summaryMethod'
      :span-method='tableUI.spanMethod'
      :select-on-indeterminate='tableUI.selectOnIndeterminate'
      :indent='tableUI.indent'
      :lazy='tableUI.lazy'
      :load='tableUI.load'
      @selection-change='__handleTableSelectionChanged'>
      <el-table-column type='index'
        fixed
        align='center'>
      </el-table-column>
      <el-table-column type='selection'
        fixed
        align='center'>
      </el-table-column>
      <!-- <el-table-column type='expand' fixed>
          <template slot-scope='props'>
            <el-form-item>
            </el-form-item>
          </template>
        </el-table-column> -->
      <template v-for='(item, index) in tableInfoData.items'>
        <simple-table-column v-if='item.columnVisible'
          :key='index'
          :columnInfo='item'
          :columnUI='item.columnUI'>
        </simple-table-column>
      </template>
    </el-table>
  </el-form>
</template>

<script>
import _ from 'lodash'
import * as api_gda from '@/api/gda'
import * as utils_resource from '@/utils/resource'
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils'
import SimpleTableColumn from '@/components/Widgets/SimpleTableColumn'

export default {
  name: 'SimpleTable',
  components: {
    SimpleTableColumn,
  },
  mixins: [utils],
  props: {
    /**
     * 表ui
     * 参见element-ui组件el-table的属性
     */
    tableUI: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 表信息
      {
        // 1、自定义部分
        tableName: 'xxx',         // 必须，业务表名信息，xxx为业务表名
        parentFieldName: 'xxx'    // 可选，节点的父属性， xxx为列属性
        // 2、表列
        items:[                   // 必须
          {
            // 1、表列ui
            columnUI: {           // 必须
              // 参见element-ui组件el-table-column的属性
            },
            
            // 2、自定义部分
            fieldName: 'xxx',     // 可选，属性的属性名，xxx未业务表字段
            editable: false,      // 可选，列是否可编辑，默认为false不可编辑
            columnVisible:false,  // 可选，列可显示，默认未false不可视
            rules:[{},],          // 可选，数组中rules的表单验证规则对象，参见element-ui组件el-form-items的rules属性

            // 3、单元格控件对象     // 可选
            DynamicEditor控件的editorInfo的多个属性内容，参见DynamicEditor.editorInfo

            // 4、可选 item的孩子,数组中为多个子item对象，当有孩子时时，DynamicEditor属性无效
            children:[{},],
          },{
            ...
        }],
      }
     */
    tableInfo: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    var that = this
    function initTableInfoData(tableInfo, that) {
      var retval = _.cloneDeep(tableInfo)
      // 生成itemKey属性  
      that._setLeafItems(retval.items)
      return retval
    }

    return {
      // 表信息
      tableInfoData: initTableInfoData(this.tableInfo, that),
      // 表数据是一个资源
      // 校验的el-form-item的prop是'children.'+$index+'.attributes.'+column.columnKey+'.editValue'的形式。必须含有children
      tableData: new utils_resource.CResource('__roottype__', '__rootproperty__', '__rootvalue__'),
    }
  },
  methods: {
    // 表行的选择列被改变事件
    __handleTableSelectionChanged(selection) {
      utils_resource.setResourcesSelectedState(this.tableData.getChildren(), selection)
    },

    // 行的 className 的回调方法
    __setTableRowClassName({ row, rowIndex }) {
      var state = row.getDifference()
      if (state === utils_resource.DIFFERENCE_ADDED) {
        return 'globle-inserted-row'
      } else if (state === utils_resource.DIFFERENCE_REMOVED) {
        return 'globle-removed-row'
      } else if (state === utils_resource.DIFFERENCE_MODIFIED) {
        return 'globle-modified-row'
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped>
</style>
