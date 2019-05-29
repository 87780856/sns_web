<template>
  <TableListWidget v-if='this.listVisible'
    ref='tableListWidget'
    :searchButtonGroup='searchButtonGroup'
    :modifyButtonGroup='this.modifyButtonGroupData'
    :outputButtonGroup='outputButtonGroup'
    :customButtonGroup='customButtonGroup'
    :tableFilterVisible='tableFilterVisible'
    :tableFilterUI='tableFilterUI'
    :tableFilterInfo='tableFilterInfo'
    :tableUI='tableUI'
    :tableInfo='tableInfo'>
    <template slot='tablelistwidget_customcolumns'>
      <el-table-column :type='operationColumnData.columnUI.type'
        :index='operationColumnData.columnUI.index'
        :column-key='operationColumnData.columnUI.itemKey'
        :label='operationColumnData.columnUI.label'
        :prop='operationColumnData.columnUI.prop'
        :width='operationColumnData.columnUI.width'
        :min-width='operationColumnData.columnUI.minWidth'
        :fixed='operationColumnData.columnUI.fixed'
        :render-header='operationColumnData.columnUI.renderHeader'
        :sortable='operationColumnData.columnUI.sortable'
        :sort-method='operationColumnData.columnUI.sortMethod'
        :sort-by='operationColumnData.columnUI.sortBy'
        :sort-orders='operationColumnData.columnUI.sortOrders'
        :resizable='operationColumnData.columnUI.resizable'
        :formatter='operationColumnData.columnUI.formatter'
        :show-overflow-tooltip='operationColumnData.columnUI.showOverflowTooltip'
        :align='operationColumnData.columnUI.align'
        :header-align='operationColumnData.columnUI.headerAlign'
        :class-name='operationColumnData.columnUI.className'
        :label-class-name='operationColumnData.columnUI.labelClassName'
        :selectable='operationColumnData.columnUI.selectable'
        :reserve-selection='operationColumnData.columnUI.reserveSelection'
        :filters='operationColumnData.columnUI.filters'
        :filter-placement='operationColumnData.columnUI.filterPlacement'
        :filter-multiple='operationColumnData.columnUI.filterMultiple'
        :filter-method='operationColumnData.columnUI.filterMethod'
        :filtered-value='operationColumnData.columnUI.filteredValue'>
        <template slot-scope='scope'>
          <el-button v-if='operationColumnData.rowDetailButton.visible'
            :size="operationColumnData.rowDetailButton.buttonUI.size"
            :type="operationColumnData.rowDetailButton.buttonUI.type"
            :plain='operationColumnData.rowDetailButton.buttonUI.plain'
            :round='operationColumnData.rowDetailButton.buttonUI.round'
            :loading='operationColumnData.rowDetailButton.buttonUI.loading'
            :disabled='operationColumnData.rowDetailButton.buttonUI.disabled'
            :icon='operationColumnData.rowDetailButton.buttonUI.icon'
            :autofocus='operationColumnData.rowDetailButton.buttonUI.autofocus'
            :native-type='operationColumnData.rowDetailButton.buttonUI.nativeType'
            @click='__handleDetailButtonClicked(scope.row,scope.column,scope.$index)'>
            {{operationColumnData.rowDetailButton.name}}
          </el-button>
          <el-button v-if='operationColumnData.rowDeleteButton.visible'
            :size="operationColumnData.rowDeleteButton.buttonUI.size"
            :type="operationColumnData.rowDeleteButton.buttonUI.type"
            :plain='operationColumnData.rowDeleteButton.buttonUI.plain'
            :round='operationColumnData.rowDeleteButton.buttonUI.round'
            :loading='operationColumnData.rowDeleteButton.buttonUI.loading'
            :disabled='operationColumnData.rowDeleteButton.buttonUI.disabled'
            :icon='operationColumnData.rowDeleteButton.buttonUI.icon'
            :autofocus='operationColumnData.rowDeleteButton.buttonUI.autofocus'
            :native-type='operationColumnData.rowDeleteButton.buttonUI.nativeType'
            @click='__handleDeleteButtonClicked(scope.row,scope.column,scope.$index)'>
            {{operationColumnData.rowDeleteButton.name}}
          </el-button>
          <slot name='tablewidget_customcolumns' />
        </template>
      </el-table-column>

    </template>
  </TableListWidget>
  <TableDetailWidget v-else
    ref='tableDetailWidget'
    :detailFormUI='detailFormUI'
    :detailFormInfo='detailFormInfo'
    :detailFormModel='this.detailFormData'
    :detailReturnButtonGroup='detailReturnButtonGroup'
    :detailModifyButtonGroup='detailModifyButtonGroup'
    :detailOutputButtonGroup='detailOutputButtonGroup'
    :detailCustomButtonGroup='detailCustomButtonGroup'
    detailStyle='formstyle'
    @detailReturnClicked='()=>{ this.listVisible=true}'>
    <template v-for='item in _getLeafItems(detailFormInfo.items)'>
      <template :slot="'dynamiceditor_customcontrol'+item.itemKey">
        <slot :name="'dynamiceditor_customcontrol'+item.itemKey">
        </slot>
      </template>
    </template>
    <template slot='tabledetailwidget_customdetail'>
      <slot name="tablewidget_customdetail"></slot>
    </template>
  </TableDetailWidget>
</template>

<script>
import _ from 'lodash'
import * as api_gda from '@/api/gda'
import * as utils_resource from '@/utils/resource'
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils'
import TableListWidget, { tableListWidgetProps, } from '@/components/Widgets/TableListWidget'
import TableDetailWidget, { tableDetailWidgetProps, } from '@/components/Widgets/TableDetailWidget'

export default {
  name: 'TableWidget',
  components: {
    TableListWidget,
    TableDetailWidget,
  },
  mixins: [utils],
  props: Object.assign({
    /** 
     * 工具栏更新按钮组，默认按钮组包含uri为[add,delete]，
     * 可以对默认设置进行自定义修改，格式如下，
        [{
          uri:'',             // 为按钮唯一标示
          click:'',           // 点击事件函数
          name:'',            // name为按钮名字
          visible:true,       // 是否可视
          buttonUI:{
            // 参见element-ui el-button的属性
          }, 
        },
        ]
     */
    // modifyButtonGroup

    /**
     * 操作列
      {
        columnUI: {
          // 参见element-ui el-button的属性
        }, 
        rowDetailButton: {
          name:'',           // name为按钮名字
          visible: true      // 是否可视
          buttonUI:{
            // 参见element-ui el-button的属性
          },
          click:'',          // click为点击事件
        },
        rowDeleteButton: {
          name:'',           // name为按钮名字
          visible: true      // 是否可视
          buttonUI:{
            // 参见element-ui el-button的属性
          },
          click:'',          // click为点击事件
        },
      }
     */
    operationColumn: {
      type: Object,
      default: function () { return {} },
    },
  }, tableListWidgetProps, tableDetailWidgetProps),
  data() {
    var that = this
    function initModifyButtonGroup(modifyGroup, that) {
      var retval = null
      // 如果初始化没设置则默认设置，如果已设置则更改
      if (!modifyGroup && Array.isArray(modifyGroup)) {
        retval = _.cloneDeep(modifyGroup)
        retval.forEach(button => {
          if (button.uri === 'add_button') {
            button.click = button.click ? button.click : that.__handleAddButtonClicked
          } else if (button.uri === 'delete_button') {
            button.click = button.click ? button.click : that.__handleDeleteButtonClicked
          } else if (button.uri === 'modify_button') {
            button.visible = false
          } else if (button.uri === 'save_button') {
            button.visible = false
          }
        })
      } else {
        retval = [
          {
            uri: 'add_button',
            click: that.__handleAddButtonClicked,
          }, {
            uri: 'modify_button',
            visible: false,
          }, {
            uri: 'delete_button',
            click: that.__handleDeleteButtonClicked,
          }, {
            uri: 'save_button',
            visible: false,
          },
        ]
      }
      return retval
    }
    function initOperationColumn(operationColumn) {
      var retval = _.cloneDeep(operationColumn)
      if (!retval) {
        retval = {}
      }
      if (!retval.columnUI) {
        retval['columnUI'] = {
          label: '操作',
          fixed: 'right',
          align: 'center',
        }
      }
      if (!retval.rowDetailButton) {
        retval['rowDetailButton'] = {
          name: '详情',
          visible: true,
          buttonUI: {
            type: 'text',
            size: 'mini',
          },
        }
      }
      if (!retval.rowDetailButton.buttonUI) {
        retval.rowDetailButton['buttonUI'] = {
          type: 'text',
          size: 'mini',
        }
      }
      if (!retval.rowDeleteButton) {
        retval['rowDeleteButton'] = {
          name: '删除',
          visible: true,
          buttonUI: {
            type: 'text',
            size: 'mini',
          },
        }
      }
      if (!retval.rowDeleteButton.buttonUI) {
        retval.rowDeleteButton['buttonUI'] = {
          type: 'text',
          size: 'mini',
        }
      }

      return retval
    }
    return {
      // 是否显示列表或者明细
      listVisible: true,
      // 表明细数据
      detailFormData: null,
      // 更新按钮组
      modifyButtonGroupData: initModifyButtonGroup(this.modifyButtonGroup, this),
      // 操作列
      operationColumnData: initOperationColumn(this.operationColumn),
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 得到过滤器资源数据
     */
    // getFilterFormProps() {
    //   return this.$refs.simpleFilter.getFormItems()
    // },

    /**
     * 校验明细表单项的唯一性 
     */
    validateDetailItemUnique(rule, value, callback, typeName) {
      this.$refs.tableDetailWidget.validateDetailItemUnique(rule, value, callback, typeName)
    },

    // 点击增加按钮
    __handleAddButtonClicked() {
      // 生成一个资源
      var rd = utils_resource.generate1Resource(this.tableInfo.typeName,
        this.tableInfo.primaryAttributeName, {}, this._getLeafItems(this.tableInfo.items),
        this.tableInfo.associationTypeName, this.tableInfo.associationAttributeName)

      // 设置显示角色
      this._setResourceDisplayValue(rd, this._getLeafItems(this.tableInfo.items))

      // 设置数据,返回一条数据
      this.detailFormData = rd
      // 设置打开明细页
      this.listVisible = false
    },

    // 点击删除按钮
    __handleDeleteButtonClicked(row, column, $index) {
      this.$refs.tableListWidget.removeData($index)
    },

    // 表行操作列点击详情事件
    __handleDetailButtonClicked(row, column, $index) {
      var formProps = this._getLeafItems(this.detailFormInfo.items)
      api_gda.retrieveData(this.detailFormInfo.typeName,
        row.getPrimaryAttributeValue(),
        formProps,
      ).then((responseData) => {
        // 设置数据,返回一条数据
        this.detailFormData = utils_resource.generate1Resource(this.detailFormInfo.typeName,
          this.detailFormInfo.primaryAttributeName, responseData, formProps,
          this.detailFormInfo.associationTypeName, this.detailFormInfo.associationAttributeName)

        // 设置打开明细页
        this.listVisible = false
      }).catch((error) => {
        // 设置界面
        utils_ui.showErrorMessage(error)
      })
    },
  },
}
</script>

<style scoped>
</style>
