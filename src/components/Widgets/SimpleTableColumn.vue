<template>
  <el-table-column v-if='columnInfo.children && Array.isArray(columnInfo.children) && columnInfo.children.length>0'
    :type='columnUI.type'
    :index='columnUI.index'
    :column-key='columnInfo.itemKey'
    :label='columnUI.label'
    :prop='columnUI.prop'
    :width='columnUI.width'
    :min-width='columnUI.minWidth'
    :fixed='columnUI.fixed'
    :render-header='columnUI.renderHeader'
    :sortable='columnUI.sortable'
    :sort-method='columnUI.sortMethod'
    :sort-by='columnUI.sortBy'
    :sort-orders='columnUI.sortOrders'
    :resizable='columnUI.resizable'
    :formatter='columnUI.formatter'
    :show-overflow-tooltip='columnUI.showOverflowTooltip ? columnUI.showOverflowTooltip : true'
    :align="columnUI.align ? columnUI.align : 'center'"
    :header-align='columnUI.headerAlign'
    :class-name='columnUI.className'
    :label-class-name='columnUI.labelClassName'
    :selectable='columnUI.selectable'
    :reserve-selection='columnUI.reserveSelection'
    :filters='columnUI.filters'
    :filter-placement='columnUI.filterPlacement'
    :filter-multiple='columnUI.filterMultiple'
    :filter-method='columnUI.filterMethod'
    :filtered-value='columnUI.filteredValue'>
    <template v-for='(child, index) in columnInfo.children'>
      <simple-table-column v-if='child.columnVisible'
        :key='index'
        :columnInfo='child'
        :columnUI='child.columnUI'>
      </simple-table-column>
    </template>
  </el-table-column>
  <el-table-column v-else
    :type='columnUI.type'
    :index='columnUI.index'
    :column-key='columnInfo.itemKey'
    :label='columnUI.label'
    :prop="'attributes.'+columnInfo.itemKey+'.editValue'"
    :width='columnUI.width'
    :min-width='columnUI.minWidth'
    :fixed='columnUI.fixed'
    :render-header='columnUI.renderHeader'
    :sortable='columnUI.sortable ? columnUI.sortable : true'
    :sort-method='columnUI.sortMethod'
    :sort-by='columnUI.sortBy'
    :sort-orders='columnUI.sortOrders'
    :resizable='columnUI.resizable'
    :formatter='columnUI.formatter'
    :show-overflow-tooltip='columnUI.showOverflowTooltip ? columnUI.showOverflowTooltip : true'
    :align="columnUI.align ? columnUI.align : 'center'"
    :header-align='columnUI.headerAlign'
    :class-name='columnUI.className'
    :label-class-name='columnUI.labelClassName'
    :selectable='columnUI.selectable'
    :reserve-selection='columnUI.reserveSelection'
    :filters='columnUI.filters'
    :filter-placement='columnUI.filterPlacement'
    :filter-multiple='columnUI.filterMultiple'
    :filter-method='columnUI.filterMethod'
    :filtered-value='columnUI.filteredValue'>
    <template slot-scope='{ row, column, $index }'>
      <!-- {{ __test(row, column, $index) }} -->
      <template v-if='row.attributes && row.attributes[column.columnKey]'>
        <template v-if='row.attributes[column.columnKey].editing'>
          <el-form-item :prop="'children.'+$index+'.attributes.'+column.columnKey+'.editValue'"
            label=''
            :rules='columnInfo.rules'
            size='mini'>
            <DynamicEditor :editorUI='columnInfo.editorUI'
              :editorInfo='columnInfo'
              :editorModel='row.attributes[column.columnKey]'
              @modelChanged='(val)=>{
                row.modifyAttribute(column.columnKey, val)
              }'>
            </DynamicEditor>
          </el-form-item>
        </template>
        <template v-else>
          <span> {{ row.attributes[column.columnKey].displayValue }} </span>
        </template>
      </template>
      <template v-else>
        <span> 错误数据 </span>
      </template>
    </template>
  </el-table-column>
</template>
<script>
import * as utils_resource from '@/utils/resource'
import utils from '@/mixins/utils'
import DynamicEditor from '@/components/Widgets/DynamicEditor'

export default {
  name: 'SimpleTableColumn',
  components: {
    DynamicEditor,
  },
  model: {
    prop: 'editorModel',
    event: 'modelChanged'
  },
  mixins: [utils],
  props: {
    /**
     * table-column ui
     * 参见element-ui组件el-table-column的属性
     */
    columnUI: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * column信息
     */
    columnInfo: {
      type: Object,
      default: function () { return {} },
    },
  },
  data: function () {
    return {
    }
  },
  methods: {
    __test(row, column, $index) {
      console.log("test")
    },
  }
}
</script>