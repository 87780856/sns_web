<template>
  <div ref='mainWidget'
    class='mainwidget'>
    <!-- 工具栏按钮 -->
    <SimpleButtonGroup ref='toolButtonGroup'
      class='toolbuttongroup'
      :buttonGroup='toolButtonGroupData' />
    <!-- 查询条件 -->
    <SimpleForm v-if='tableFilterVisible'
      ref='simpleFilter'
      class='simplefilter'
      :formUI='tableFilterUI'
      :formInfo='tableFilterInfo' />
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
     * 工具栏查询按钮组，默认按钮组包含uri为[search]
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
    searchButtonGroup: {
      type: Array,
      default: function () { return [] },
    },

    /**
     * 工具栏输出按钮组，默认按钮组包含uri为[print,import,export]
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
    outputButtonGroup: {
      type: Array,
      default: function () { return [] },
    },
    /**
     *  按钮组,customButtonGroup的内容在查询组searchButtonGroup与输出组outputButtonGroup之间
      [
        [ // 分组
          {
            uri: ''          // 按钮唯一标示
            click: '',          // 点击事件
            name: '',           // 按钮名字
            visible: true      // 是否可视
            buttonUI: {
              // 参见element-ui el-button的属性
            },
          },...
        ],
        ...
      ]
     */
    customButtonGroup: {
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
    tableFilterInfo: {
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
    function setButtonGroup(targetGroup, srcGroup) {
      if (srcGroup && srcGroup.length > 0) {
        srcGroup.forEach(button => {
          var tempButton = findButtonGroup(targetGroup, button.uri)
          if (tempButton) {
            Object.keys(button).forEach(prop => {
              tempButton[prop] = button[prop]
            })
          }
        })
      }
    }

    var that = this
    function initToolButtonGroup(that) {
      // 设置已有toolbuttongroup数据
      var tempToolButtonGroup = []
      // 查询
      var tempSearchGroup = [
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
      ]
      setButtonGroup(tempSearchGroup, that.searchButtonGroup)
      tempToolButtonGroup.push(tempSearchGroup)

      // 输出
      var tempOutputGroup = [
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
      setButtonGroup(tempOutputGroup, that.outputButtonGroup)
      tempToolButtonGroup.push(tempOutputGroup)

      return tempToolButtonGroup
    }
    return {
      // 工具按钮组
      toolButtonGroupData: initToolButtonGroup(),
    }
  },
  mounted() {
    var that = this
    function handleResize(that) {
      if (this.$refs.mainWidget) {
        let simpleButtonGroupOffsetHeight = that.$refs.toolButtonGroup ? that.$refs.toolButtonGroup.$el.offsetHeight : '0'
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
        // 设置表数据
        var results = null
        if (responseData.results) {
          // 生成分页数据
          results = responseData.results
        } else {
          // 生成不分页数据
          results = responseData
        }
        this.$refs.simpleTable.setTableData(results)

        // 设置分页
        var pageTotal = 1
        if (responseData.count) {
          pageTotal = responseData.count
        } else {
          pageTotal = 1
        }
        this.$refs.simplePagination.setPageTotal(pageTotal)
      }).catch((error) => {
        // 设置界面
        utils_ui.showErrorMessage(error)
      })
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
  },
}
</script>

<style scoped>
.mainwidget {
  height: 100%;
}
.toolbuttongroup {
  padding: 5px 10px 5px 10px;
}
.simplefilter {
  padding: 5px 10px 5px 10px;
}
.simplepagination {
  padding: 5px 10px 5px 10px;
}
</style>
