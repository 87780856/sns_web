<template>
  <!-- 表 -->
  <el-form ref='elForm'
    :model='tableData'
    inlineMessage>
    <el-table ref='elTable'
      :class='tableUI.class'
      :style='tableUI.style'
      :data='tableData.getChildren()'
      :height="tableUI.height ? tableUI.height : '100%'"
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
import * as utils_resource from '@/utils/resource'
import utils from '@/mixins/utils'
import SimpleTableColumn from '@/components/Widgets/SimpleTableColumn'

export var SimpleTableProps = {
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
      typeName: '',                 // 必须，业务类型名
      primaryAttributeName: ''      // 必须，业务主属性名
      associationTypeName: ''       // 可选，关联类名
      associationAttributeName: ''  // 可选，关联属性名
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
}

export default {
  name: 'SimpleTable',
  components: {
    SimpleTableColumn,
  },
  mixins: [utils],
  props: SimpleTableProps,
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
      tableData: new utils_resource.CResource(),
    }
  },
  methods: {
    /**
     * 表数据校验，同el-form的validate，参见el-form
     * @param {Function} func 为回调函数，参见el-form的validate参数
     */
    validate(func) {
      this.$refs.elForm.validate(func)
    },

    /**
     * 设置表数据
     * @param {Array} recordList 转换前的资源列表数据
     */
    setTableData(recordList) {
      if (!recordList || !Array.isArray(recordList)) {
        return
      }
      var children = utils_resource.generateResources(this.tableInfoData.typeName,
        this.tableInfoData.primaryAttributeName,
        recordList,
        this._getLeafItems(this.tableInfoData.items),
        this.tableInfoData.associationTypeName,
        this.tableInfoData.associationAttributeName
      )

      // 设置显示角色
      this._setResourcesDisplayValue(children, this._getLeafItems(this.tableInfoData.items))

      this.tableData.setChildren(children)
    },

    /**
     * 插入一条记录
     * @param record 插入默认的初始值，可选
     */
    insertData(record) {
      // 生成一个资源
      var rd = utils_resource.generate1Resource(this.tableInfoData.typeName,
        this.tableInfoData.primaryAttributeName, record, this._getLeafItems(this.tableInfoData.items),
        this.tableInfoData.associationTypeName, this.tableInfoData.associationAttributeName)

      // 设置单元格正在编辑状态
      rd.setEditing(true)

      // 设置显示角色
      this._setResourceDisplayValue(rd, this._getLeafItems(this.tableInfoData.items))

      this.tableData.appendChild(rd)
    },


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
