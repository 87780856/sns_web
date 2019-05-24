<template>
  <TableListWidget v-if='this.listVisible'
    :searchButtonGroup='searchButtonGroup'
    :modifyButtonGroup='this.modifyButtonGroupData'
    :outputButtonGroup='outputButtonGroup'
    :customButtonGroup='customButtonGroup'
    :tableFilterVisible='tableFilterVisible'
    :tableFilterUI='tableFilterUI'
    :tableFilterInfo='tableFilterInfo'
    :tableUI='tableUI'
    :tableInfo='this.tableInfoData'>
    <template slot='tablelistwidget_customoperationcolumn'>
      <el-button v-if='rowDetailButton && rowDetailButton.visible'
        :size="rowDetailButton.buttonUI ? rowDetailButton.buttonUI.size : 'mini'"
        :type="rowDetailButton.buttonUI ? rowDetailButton.buttonUI.type : 'text'"
        :plain='rowDetailButton.buttonUI ? rowDetailButton.buttonUI.plain : undefined'
        :round='rowDetailButton.buttonUI ? rowDetailButton.buttonUI.round : undefined'
        :loading='rowDetailButton.buttonUI ? rowDetailButton.buttonUI.loading : undefined'
        :disabled='rowDetailButton.buttonUI ? rowDetailButton.buttonUI.disabled : undefined'
        :icon='rowDetailButton.buttonUI ? rowDetailButton.buttonUI.icon : undefined'
        :autofocus='rowDetailButton.buttonUI ? rowDetailButton.buttonUI.autofocus : undefined'
        :native-type='rowDetailButton.buttonUI ? rowDetailButton.buttonUI.nativeType : undefined'
        @click='__handleDetailButtonClicked(scope.row,scope.column,scope.$index)'>
        {{detailButton.name}}
      </el-button>

      <el-button v-if='rowDeleteButton && rowDeleteButton.visible'
        :size="rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.size : 'mini'"
        :type="rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.type : 'text'"
        :plain='rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.plain : undefined'
        :round='rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.round : undefined'
        :loading='rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.loading : undefined'
        :disabled='rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.disabled : undefined'
        :icon='rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.icon : undefined'
        :autofocus='rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.autofocus : undefined'
        :native-type='rowDeleteButton.buttonUI ? rowDeleteButton.buttonUI.nativeType : undefined'
        @click='__handleDeleteButtonClicked(scope.row,scope.column,scope.$index)'>
        {{rowDeleteButton.name}}
      </el-button>
      <slot name='tablewidget_customoperationcolumn' />
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
     * 行详情操作按钮
        {
          uri:'',            // name为按钮名字
          visible: true      // 是否可视
          buttonUI:{
            // 参见element-ui el-button的属性
          },
          click:'',          // click为点击事件
        }
     */
    rowDetailButton: {
      type: Object,
      default: function () {
        return {
          name: '详情',
          visible: true,
          buttonUI: {
            type: 'text',
            size: 'mini',
          },
        }
      },
    },
    /**
     * 行删除操作按钮
        {
          uri:'',            // name为按钮名字
          visible: true      // 是否可视
          buttonUI:{
            // 参见element-ui el-button的属性
          },
          click:'',          // click为点击事件
        }
     */
    rowDeleteButton: {
      type: Object,
      default: function () {
        return {
          name: '删除',
          visible: true,
          buttonUI: {
            type: 'text',
            size: 'mini',
          },
        }
      },
    },
  }, tableListWidgetProps, tableDetailWidgetProps),
  data() {
    function initModifyButtonGroup(modifyGroup) {
      var retval = null
      // 如果初始化没设置则默认设置，如果已设置则更改
      if (!modifyGroup && Array.isArray(modifyGroup)) {
        retval = _.cloneDeep(modifyGroup)
        retval.forEach(button => {
          if (button.uri === 'insert_button') {
            button.click = button.click ? button.click : this.__handleAddButtonClicked
          } else if (button.uri === 'delete_button') {
            button.click = button.click ? button.click : this.__handleDeleteButtonClicked
          } else if (button.uri === 'modify_button') {
            button.visible = false
          } else if (button.uri === 'save_button') {
            button.visible = false
          }
        })
      } else {
        retval = [
          {
            uri: 'insert_button',
            click: this.__handleAddButtonClicked,
          }, {
            uri: 'modify_button',
            visible: false,
          }, {
            uri: 'delete_button',
            click: this.__handleDeleteButtonClicked,
          }, {
            uri: 'save_button',
            visible: false,
          },
        ]
      }
      return retval
    }
    function initTableInfo(tableInfo) {
      return tableInfo
    }
    return {
      // 是否显示列表或者明细
      listVisible: true,
      // 表明细数据
      detailFormData: null,
      // 更新按钮组
      modifyButtonGroupData: initModifyButtonGroup(this.modifyButtonGroup),
      // 表信息
      tableInfoData: initTableInfo(this.tableInfo),
    }
  },
  mounted() {
    // // 计算elTable的高度
    // this.$nextTick(() => {
    //   window.addEventListener('resize', this.__handleResize)
    // })
    // this.__handleResize()
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
      this.insertData()
    },

    // 点击删除按钮
    __handleDeleteButtonClicked() {
      if (!utils_resource.hasResourcesSelected(this.tableData.rows)) {
        this.$message({ message: '请选择要删除的记录', type: 'warning' })
        return
      }
      this.$confirm('确认要删除已选的记录吗?', '提示', { type: 'warning' }
      ).then(() => {
        utils_resource.removeResources(this.tableData.rows)
      }).catch(() => {
        this.$message({ message: '取消删除', type: 'info' })
      })
    },

    // 表行操作列点击详情事件
    __handleDetailButtonClicked(row, column, $index) {
      var formProps = this._getLeafItems(this.detailFormInfo.items)
      api_gda.listData(this.tableInfoData.tableName,
        formProps,
        [{
          fieldName: 'pk',
          editValue: row.uri,
          comparison: 'exact',
        },],
      ).then((responseData) => {
        // 设置数据,返回一条数据
        this.detailFormData = utils_resource.setResource(responseData[0], formProps, this.tableInfoData.parentUri)
        // 设置打开明细页
        this.listVisible = false
      }).catch((error) => {
        // 设置界面
        utils_ui.showErrorMessage(error)
      })
    },

    // __handleResize() {
    //   if (this.$refs.elForm) {
    //     let simpleButtonGroupOffsetHeight = this.$refs.listToolButtonGroup ? this.$refs.listToolButtonGroup.$el.offsetHeight : '0'
    //     let simpleFilterOffsetHeight = this.$refs.simpleFilter ? this.$refs.simpleFilter.$el.offsetHeight : '0'
    //     let simplePaginationOffsetHeight = this.$refs.simplePagination ? this.$refs.simplePagination.$el.offsetHeight : '0'

    //     let dynamicHeight = 'calc(100%' +
    //       ' - ' + simpleButtonGroupOffsetHeight + 'px' +
    //       ' - ' + simpleFilterOffsetHeight + 'px' +
    //       ' - ' + simplePaginationOffsetHeight + 'px' +
    //       ')'
    //     this.$refs.elForm.$el.style.height = dynamicHeight
    //   }

    //   this.tableUI.height = '100%'
    //   // this.$refs.elTable.$el.style.height = dynamicHeight
    //   // this.tableUI.height = dynamicHeight
    // },

  },
}
</script>

<style scoped>
</style>
