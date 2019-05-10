<template>
  <div class='TableWidget'>
    <!-- 工具栏按钮 -->
    <SimpleButtonGroup ref='listToolButtonGroup'
      class='listtoolbuttongroup'
      :buttonGroup='listToolButtonGroupData' />
    <!-- 查询条件 -->
    <SimpleForm v-if='tableFilterVisible'
      ref='simpleFilter'
      class='simplefilter'
      :formUI='tableFilterUI'
      :formInfo='tableFilter' />
    <!-- 表 -->
    <SimpleTable ref='simpleTable'
      :tableUI='tableUI'
      :tableInfo='tableInfo'>
    </SimpleTable>
    <!-- 传入elementui的page-total属性不起作用 -->
    <SimplePagination ref='simplePagination'
      class='simplepagination'
      :changePageSize='__handlePaginationSizeChanged'
      :changeCurrentPage='__handlePaginationCurrentChanged'>
    </SimplePagination>
  </div>
</template>

<script>
import _ from 'lodash'
import * as api_gda from '@/api/gda'
import * as utils_resource from '@/utils/resource'
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils'
import SimpleButtonGroup from '@/components/Widgets/SimpleButtonGroup'
import SimpleForm from '@/components/Widgets/SimpleForm'
import SimpleTable from '@/components/Widgets/SimpleTable'
import SimplePagination from '@/components/Widgets/SimplePagination'

export default {
  name: 'TableWidget',
  components: {
    SimpleButtonGroup,
    SimpleForm,
    SimpleTable,
    SimplePagination,
    SimpleTableDetail,
  },
  mixins: [utils],
  props: {
    /**
     * 工具栏按钮组，默认按钮组包含uri为search,add,modify,remove,save,print,import,export
     * 内部结构为[[search],[add,modify,remove,save],[print,import,export]]
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
    listToolButtonGroup: {
      type: Array,
      default: function () { return [] },
    },
    /**
     * 是否显示表过滤信息
     */
    tableFilterVisible: {
      type: Boolean,
      default: true,
    },
    /**
     * 表过滤条件信息，参见SimpleForm的form属性
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
     * 表过滤条件信息，参见SimpleForm的form属性
     */
    tableFilter: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 表ui 参见SimpleTable的tableUI属性
     */
    tableUI: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 表信息 参见SimpleTable的tableInfo属性
     */
    tableInfo: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    function findButtonGroup(buttonGroup, uri) {
      var tempButton = null
      for (var i = 0; i < buttonGroup.length; i++) {
        tempButton = buttonGroup[i].find(element => { return element.uri === uri })
        if (tempButton) {
          break
        }
      }
      return tempButton
    }
    var that = this
    function initListToolButtonGroup(that) {
      // 设置已有toolbuttongroup数据
      var tempToolButtonGroup = []
      // 查询
      tempToolButtonGroup.push([
        {
          uri: 'search',
          name: '查询',
          click: that.__handleSearchButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-search',
          },
        },
      ])
      // 修改
      tempToolButtonGroup.push([
        {
          uri: 'add',
          name: '增加',
          click: that.__handleAddButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-circle-plus-outline',
          }
        }, {
          uri: 'modify',
          name: '修改',
          click: that.__handleModifyButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-document',
          }
        }, {
          uri: 'remove',
          name: '删除',
          click: that.__handleDeleteButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-remove-outline',
          }
        }, {
          uri: 'save',
          name: '保存',
          click: that.__handleSaveButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-tickets',
          }
        },
      ])
      // 输出
      tempToolButtonGroup.push([
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
      ])
      if (that.listToolButtonGroup && this.listToolButtonGroup.length > 0) {
        this.listToolButtonGroup.forEach(button => {
          var tempButton = findButtonGroup(tempToolButtonGroup, button.uri)
          if (tempButton) {
            Object.keys(button).forEach(prop => {
              tempButton[prop] = button[prop]
            })
          }
        })
      }
      return tempToolButtonGroup
    }
    return {
      // 工具按钮组
      listToolButtonGroupData: initListToolButtonGroup(),
    }
  },
  mounted() {
    var that = this
    function handleResize(that) {
      if (this.$refs.simpleTable) {
        let simpleButtonGroupOffsetHeight = that.$refs.listToolButtonGroup ? that.$refs.listToolButtonGroup.$el.offsetHeight : '0'
        let simpleFilterOffsetHeight = that.$refs.simpleFilter ? that.$refs.simpleFilter.$el.offsetHeight : '0'
        let simplePaginationOffsetHeight = that.$refs.simplePagination ? that.$refs.simplePagination.$el.offsetHeight : '0'

        let dynamicHeight = 'calc(100%' +
          ' - ' + simpleButtonGroupOffsetHeight + 'px' +
          ' - ' + simpleFilterOffsetHeight + 'px' +
          ' - ' + simplePaginationOffsetHeight + 'px' +
          ')'
        this.$refs.simpleTable.$el.style.height = dynamicHeight
      }
    }

    // 计算elTable的高度
    this.$nextTick(() => {
      window.addEventListener('resize', handleResize)
    })
    handleResize()
  },
  methods: {
    /**
     * 查询过滤条件的数据
     * @param {Array} filters
     * @param {inte}offset默认从第0页分页
     */
    fetchData(filters, offset) {
      api_gda.listData(this.tableInfo.typeName,
        this._getLeafItems(this.tableInfo.items),
        filters,
        this.$refs.simplePagination.getPageSize(),
        offset
      ).then((responseData) => {
        if (responseData.results) {
          // 生成分页数据
          this.tableData.rows = utils_resource.setResources(responseData.results, this._getLeafItems(this.tableInfo.items),
            this.tableInfo.parentUri)
        } else {
          // 生成不分页数据
          this.tableData.rows = utils_resource.setResources(responseData, this._getLeafItems(this.tableInfo.items),
            this.tableInfo.parentUri)
        }
        // 设置显示角色
        this._setResourcesDisplayValue(this.tableData.rows, this._getLeafItems(this.tableInfo.items))
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
        let rd = utils_resource.generateResource(this._getLeafItems(this.tableInfo.items))
        // 初始化设置资源属性
        utils_resource.setResourceProperties(rd, this._getLeafItems(this.tableInfo.items))
        // 设置资源的父
        utils_resource.setResourceParent(rd, parentUri)
        // 设置显示角色
        this._setResourceDisplayValue(rd, this._getLeafItems(this.tableInfo.items))
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
          this.tableInfo.typeName,
          this.tableData.rows[rowIndex].props[fieldIndex].fieldName)
      } else {
        callback()
      }
    },

    /**
     * 校验明细表单项的唯一性 
     */
    validateDetailItemUnique(rule, value, callback) {
      this.$refs.simpleTableDetail.validateDetailItemUnique(rule, value, callback, this.tableInfo.typeName)
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
      rd.modifyAttribute(index, prop)
    },
    // 表行的选择列被改变事件
    __handleTableSelectionChanged(selection) {
      utils_resource.setResourcesSelectedState(this.tableData.rows, selection)
    },
    // 表行操作列点击详情事件
    __handleDetailButtonClicked(row, column, $index) {
      var formProps = this._getLeafItems(this.detailFormInfo.items)
      api_gda.listData(this.tableInfo.typeName,
        formProps,
        [{
          fieldName: 'pk',
          editValue: row.uri,
          comparison: 'exact',
        },],
      ).then((responseData) => {
        // 设置数据,返回一条数据
        this.detailFormData = utils_resource.setResource(responseData[0], formProps, this.tableInfo.parentUri)
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
      this.$refs.simpleTable.validate((valid, obj) => {
        if (valid) {
          // 调用接口
          var diffModel = utils_resource.getDifferenceModel(this.tableData.rows)
          if (!diffModel) {
            // 设置资源的编辑状态
            utils_resource.setResourcesEditingState(this.tableData.rows, false)
            return
          }
          api_gda.saveData(this.tableInfo.typeName, diffModel).then((responseData) => {
            utils_resource.saveResources(this.tableData.rows, responseData)
            // 设置显示角色
            this._setResourcesDisplayValue(this.tableData.rows, this._getLeafItems(this.tableInfo.items))
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
.tablewidget {
  height: 100%;
}
.listtoolbuttongroup {
  padding: 5px 10px 5px 10px;
}
.simplefilter {
  padding: 5px 10px 5px 10px;
}
.simplepagination {
  padding: 5px 10px 5px 10px;
}
</style>
