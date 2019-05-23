<template>
  <TableWidget v-if='listVisible'
    :searchButtonGroup=''
    :modifyButtonGroup=''
    :outputButtonGroup=''
    :customButtonGroup=''
    :tableFilterVisible=''
    :tableFilterUI=''
    :tableFilterInfo=''
    :tableUI=''
    :tableInfo=''>
  </TableWidget>
  <TableDetailWidget v-else
    ref='tableDetailWidget'
    :tableName='tableInfoData.tableName'
    :detailFormUI='detailFormUI'
    :detailFormInfo='detailFormInfo'
    :detailFormModel='detailFormData'
    :detailToolButtonGroup='detailToolButtonGroup'
    @detailReturnClicked='()=>listVisible=true'>
    <template v-for='item in _getLeafItems(detailFormInfo.items)'>
      <template :slot="'dynamiceditor_customcontrol'+item.itemKey">
        <slot :name="'dynamiceditor_customcontrol'+item.itemKey">
        </slot>
      </template>
    </template>
    <template slot='simpletabledetail_customdetail'>
      <slot name="simpletabledetail_customdetail"></slot>
    </template>
  </TableDetailWidget>
</template>

<script>
import _ from 'lodash'
import * as api_gda from '@/api/gda'
import * as utils_resource from '@/utils/resource'
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils'
import TableWidget, { TableWidgetProps, } from '@/components/Widgets/TableWidget'
import TableDetailWidget from '@/components/Widgets/TableDetailWidget'

export default {
  name: 'SimpleTableWidget',
  components: {
    TableWidget,
    TableDetailWidget,
  },
  mixins: [utils],
  props: {
    /**
     * 详情操作按钮,模式二下起作用
        {
          name:'',           // name为按钮名字
          visible: true      // 是否可视
          buttonUI:{
            // 参见element-ui el-button的属性
          },
          click:'',          // click为点击事件
        }
     */
    detailOperatingButton: {
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
     * 参见simpletabledetail的detailStyle属性
     */
    detailStyle: {
      type: String,
      default: 'formstyle'
    },
    /**
     * 详情formUI数据,参见SimpleForm的formUI属性
     */
    detailFormUI: {
      type: Object,
      default: function () { return {} }
    },
    /**
     * 详情form数据,参见SimpleForm的form属性
     */
    detailFormInfo: {
      type: Object,
      default: function () { return {} }
    },
    /**
     * 要替换的默认详情按钮组，已有按钮组，包含uri: return,save
     * 这些可以被替代默认设置，也可以自定义值，
        [
          {
            uri:'xxx'          // xxx为按钮唯一标示uri
            click:'',          // click为点击事件
            name:'',           // name为按钮名字
            buttonUI:{
              // 参见element-ui el-button的属性
            },
          },...
        ]
     */
    detailToolButtonGroup: {
      type: Array,
      default: function () { return [] }
    },
  },
  data: function () {
    return {
      // 是否显示列表或者明细
      listVisible: true,
      // 表明细数据
      detailFormData: null,
    }
  },
  mounted() {
    // 计算elTable的高度
    this.$nextTick(() => {
      window.addEventListener('resize', this.__handleResize)
    })
    this.__handleResize()
  },
  methods: {
    /**
     * 得到过滤器资源数据
     */
    getFilterFormProps() {
      return this.$refs.simpleFilter.getFormItems()
    },
    /**
     * 查询过滤条件的数据，offset默认从第0页分页
     */
    fetchData(filters, offset) {
      api_gda.listData(this.tableInfoData.tableName,
        this._getLeafItems(this.tableInfoData.items),
        filters,
        this.$refs.simplePagination.getPageSize(),
        offset
      ).then((responseData) => {
        if (responseData.results) {
          // 生成分页数据
          this.tableData.rows = utils_resource.setResources(responseData.results, this._getLeafItems(this.tableInfoData.items),
            this.tableInfoData.parentUri)
        } else {
          // 生成不分页数据
          this.tableData.rows = utils_resource.setResources(responseData, this._getLeafItems(this.tableInfoData.items),
            this.tableInfoData.parentUri)
        }
        // 设置显示角色
        this._setResourcesDisplayValue(this.tableData.rows, this._getLeafItems(this.tableInfoData.items))
        // 设置分页
        this.$refs.simplePagination.setPageTotal(responseData.count)

      }).catch((error) => {
        // 设置界面
        utils_ui.showErrorMessage(error)
      })
    },
    /**
     * 插入一条记录
     */
    insertData(parentUri) {
      if (this.tableMode === 'modeone') {
        // 生成资源
        let rd = utils_resource.generateResource(this._getLeafItems(this.tableInfoData.items))
        // 初始化设置资源属性
        utils_resource.setResourceProperties(rd, this._getLeafItems(this.tableInfoData.items))
        // 设置资源的父
        utils_resource.setResourceParent(rd, parentUri)
        // 设置显示角色
        this._setResourceDisplayValue(rd, this._getLeafItems(this.tableInfoData.items))
        // 设置单元格正在编辑状态
        utils_resource.setResourceEditingState(rd, true)
        // 插入一条资源
        utils_resource.appendResources(this.tableData.rows, rd)
      } else if (this.tableMode === 'modetwo') {
        // 生成资源
        let rd = utils_resource.generateResource(this._getLeafItems(this.detailFormInfo.items))
        // 初始化设置资源属性
        utils_resource.setResourceProperties(rd, this._getLeafItems(this.detailFormInfo.items))
        // 设置资源的父
        utils_resource.setResourceParent(rd, parentUri)
        // 设置显示角色
        this._setResourceDisplayValue(rd, this._getLeafItems(this.detailFormInfo.items))
        // 插入一条资源
        utils_resource.appendResources(rd)
        // 设置数据,返回一条数据
        this.detailFormData = rd
        // 设置打开明细页
        this.listVisible = false
      }
    },
    /**
     * 校验表格单元格的唯一性 
     */
    validateTableCellUnique(rule, value, callback) {
      // 表
      var rowIndex = rule.field.split('.')[1]   // rows.x.props.y.editValue
      var fieldIndex = rule.field.split('.')[3]  // rows.x.props.y.editValue
      // 查看当前资源行的差异状态，如果为修改和删除，则不判断唯一性
      var state = utils_resource.getResourceDifferenceState(this.tableData.rows[rowIndex])
      var currentValue = this.tableData.rows[rowIndex].props[fieldIndex].oldEditValue
      if (state === 'ROW_ADDED' ||
        (state === 'ROW_MODIFIED' && currentValue !== value)) {
        this._validateUnique(rule, value, callback,
          this.tableInfoData.tableName,
          this.tableData.rows[rowIndex].props[fieldIndex].fieldName)
      } else {
        callback()
      }
    },

    /**
     * 校验明细表单项的唯一性 
     */
    validateDetailItemUnique(rule, value, callback) {
      this.$refs.tableDetailWidget.validateDetailItemUnique(rule, value, callback, this.tableInfoData.tableName)
    },
    // 点击查询按钮
    __handleSearchButtonClicked() {
      let offset = (this.$refs.simplePagination.getCurrentPage() - 1) * this.$refs.simplePagination.getPageSize()
      this.fetchData(this.$refs.simpleFilter.getFormItems(), offset)
    },
    // 处理分页SizeChange事件
    __handlePaginationSizeChanged(size) {
      this.$refs.simplePagination.setPageSize(size)
      this.fetchData(this.$refs.simpleFilter.getFormItems(), 0)
    },
    // 处理分页CurrentChange事件
    __handlePaginationCurrentChanged(currentPage) {
      let offset = (currentPage - 1) * this.$refs.simplePagination.getPageSize()
      this.fetchData(this.$refs.simpleFilter.getFormItems(), offset)
    },
    // 点击增加按钮
    __handleAddButtonClicked() {
      this.insertData()
    },
    // 表单元格数据变更事件
    __handleTableCellModified(rd, index, prop) {
      utils_resource.modifyResourceProperty(rd, index, prop)
    },
    // 表行的选择列被改变事件
    __handleTableSelectionChanged(selection) {
      utils_resource.setResourcesSelectedState(this.tableData.rows, selection)
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
    // 点击修改按钮
    __handleModifyButtonClicked() {
      utils_resource.setResourcesEditingState(this.tableData.rows, true)
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
    // 点击保存按钮
    __handleSaveButtonClicked() {
      // 校验form
      this.$refs.elForm.validate((valid, obj) => {
        if (valid) {
          // 调用接口
          var diffModel = utils_resource.getDifferenceModel(this.tableData.rows)
          if (!diffModel) {
            // 设置资源的编辑状态
            utils_resource.setResourcesEditingState(this.tableData.rows, false)
            return
          }
          api_gda.saveData(this.tableInfoData.tableName, diffModel).then((responseData) => {
            utils_resource.saveResources(this.tableData.rows, responseData)
            // 设置显示角色
            this._setResourcesDisplayValue(this.tableData.rows, this._getLeafItems(this.tableInfoData.items))
            // 设置资源的编辑状态
            utils_resource.setResourcesEditingState(this.tableData.rows, false)
            this.$message({ message: '保存成功', type: 'success' })
            /**
             * 表保存后
             * @event tableDataSaved
             */
            this.$emit('tableDataSaved')
          }).catch((error) => {
            // 设置界面
            utils_ui.showErrorMessage(error)
          })
        } else {
          let msg = ''
          Object.keys(obj).forEach(key => {
            obj[key].forEach(element => {
              msg += element.field + ':' + element.message // todo element.field 细化扩展修改
            })
          })
          utils_ui.showErrorMessage({ message: msg })
          return
        }
      })
    },
    __findButtonGroup(buttonGroup, uri) {
      var tempButton = null
      for (var i = 0; i < buttonGroup.length; i++) {
        tempButton = buttonGroup[i].find(element => { return element.uri === uri })
        if (tempButton) {
          break
        }
      }
      return tempButton
    },
    __handleResize() {
      if (this.$refs.elForm) {
        let simpleButtonGroupOffsetHeight = this.$refs.listToolButtonGroup ? this.$refs.listToolButtonGroup.$el.offsetHeight : '0'
        let simpleFilterOffsetHeight = this.$refs.simpleFilter ? this.$refs.simpleFilter.$el.offsetHeight : '0'
        let simplePaginationOffsetHeight = this.$refs.simplePagination ? this.$refs.simplePagination.$el.offsetHeight : '0'

        let dynamicHeight = 'calc(100%' +
          ' - ' + simpleButtonGroupOffsetHeight + 'px' +
          ' - ' + simpleFilterOffsetHeight + 'px' +
          ' - ' + simplePaginationOffsetHeight + 'px' +
          ')'
        this.$refs.elForm.$el.style.height = dynamicHeight
      }

      this.tableUI.height = '100%'
      // this.$refs.elTable.$el.style.height = dynamicHeight
      // this.tableUI.height = dynamicHeight
    },
    __setTableRowClassName({ row, rowIndex }) {
      var state = utils_resource.getResourceDifferenceState(row)
      if (state === 'ROW_ADDED') {
        return 'globle-inserted-row'
      } else if (state === 'ROW_REMOVED') {
        return 'globle-removed-row'
      } else if (state === 'ROW_MODIFIED') {
        return 'globle-modified-row'
      } else {
        return ''
      }
    },
    __setTableRowStyle({ row, rowIndex }) {
      if (row.parentUri) {
        // 查找父
        let res = utils_resource.findResources(this.tableData.rows, row.parentUri.editValue)
        if (res && res.expanded) {
          // 如果有父并找到该父，且父已经被点击展开
          return 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        } else {
          // 如果有父却没有找到，则不显示
          return 'display:none;'
        }
      } else {
        // 正常显示
        return ''// 'display: table-row;'
      }
    },
    __initListToolButtonGroup() {
      // 设置已有toolbuttongroup数据
      var tempToolButtonGroup = null
      if (this.tableMode === 'modeone') {
        tempToolButtonGroup = [
          [
            {
              uri: 'search',
              name: '查询',
              click: this.__handleSearchButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-search',
              },
            }, {
              uri: 'add',
              name: '增加',
              click: this.__handleAddButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-circle-plus-outline',
              }
            }, {
              uri: 'modify',
              name: '修改',
              click: this.__handleModifyButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-document',
              }
            }, {
              uri: 'remove',
              name: '删除',
              click: this.__handleDeleteButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-remove-outline',
              }
            }, {
              uri: 'save',
              name: '保存',
              click: this.__handleSaveButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-tickets',
              }
            },
          ],
        ]
      } else if (this.tableMode === 'modetwo') {
        tempToolButtonGroup = [
          [
            {
              uri: 'search',
              name: '查询',
              click: this.__handleSearchButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-search',
              },
            }, {
              uri: 'add',
              name: '增加',
              click: this.__handleAddButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-circle-plus-outline',
              }
            }, {
              uri: 'remove',
              name: '删除',
              click: this.__handleDeleteButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-remove-outline',
              }
            }, {
              uri: 'save',
              name: '保存',
              click: this.__handleSaveButtonClicked,
              visible: true,
              buttonUI: {
                type: 'primary',
                size: 'mini',
                icon: 'el-icon-tickets',
              }
            },
          ],
        ]
      }

      if (this.listToolButtonGroup && this.listToolButtonGroup.length !== 0) {
        this.listToolButtonGroup.forEach(button => {
          var tempButton = this.__findButtonGroup(tempToolButtonGroup, button.uri)
          if (tempButton) {
            Object.keys(button).forEach(prop => {
              tempButton[prop] = button[prop]
            })
          } else {
            tempToolButtonGroup.push([button])
          }
        })
      }
      tempToolButtonGroup.push(
        [
          {
            uri: 'import',
            name: '导入',
            visible: true,
            buttonUI: {
              type: 'primary',
              size: 'mini',
              icon: 'el-icon-upload2',
            }
          }, {
            uri: 'export',
            name: '导出',
            visible: true,
            buttonUI: {
              type: 'primary',
              size: 'mini',
              icon: 'el-icon-download',
            }
          }, {
            uri: 'print',
            name: '打印',
            visible: true,
            buttonUI: {
              type: 'primary',
              size: 'mini',
              icon: 'el-icon-printer',
            }
          },
        ]
      )
      return tempToolButtonGroup
    },
    __initTableInfoData(tableInfo) {
      var retval = _.cloneDeep(tableInfo)
      // 生成itemKey属性  
      this._setLeafItems(retval.items)
      return retval
    },
    __toggleResourceExpanded(index, row) {
      if (row.expanded) {
        // 如果该行被展开，则在列表中添加所有孩子到列表中
        let tempIndex = index + 1
        row.childrenObj.forEach(element => {
          this.tableData.rows.splice(tempIndex, 0, element)
          tempIndex++
        })
      } else {
        // 否则，删除列表中的该节点的所有孩子
        let tempIndex = index + 1
        this.tableData.rows.splice(tempIndex, row.childrenObj.length)
      }
      row.expanded = !row.expanded
    },
    __getResourceTreeLevel(row) {
      return utils_resource.getResourceTreeLevel(row)
    }
  },
}
</script>

<style scoped>
.listtoolbuttongroup {
  padding: 5px 10px 5px 10px;
}
.simplefilter {
  padding: 5px 10px 5px 10px;
}
.simplepagination {
  padding: 5px 10px 5px 10px;
}

@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: #2196f3;
  margin-left: -18px;
}
</style>
