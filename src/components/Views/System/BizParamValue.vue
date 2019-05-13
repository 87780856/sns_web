<template>
  <SimpleTreeTable ref='treeTable'
    :treeFilter='treeFilter'
    :treeInfo='tree'
    :tableFilterInfo='tableFilterInfo'
    :tableInfo='table'
    tableAssoProp='param_type' />
</template>

<script>
import * as api_gda from '@/api/gda';
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils';
import SimpleTreeTable from '@/components/Widgets/SimpleTreeTable';

export default {
  name: 'BizParamValue',
  mixins: [utils],
  components: { SimpleTreeTable },
  data() {
    return {
      treeFilter: {
        items: [
          {
            fieldName: 'name',
            comparison: 'contains',
            formVisible: true,
            editorUI: {
              placeHolder: '名称',
            },
          }, {
            fieldName: 'valid_flag',
            editValue: 'Y',
          },
        ]
      },
      tree: {
        // 自定义属性
        typeName: 'BizParamType',
        rootVisible: true,
        rootName: '业务参数类型',
        displayFieldName: 'name',
        items: [
          { fieldName: 'pk' },
          { fieldName: 'name' },
        ],
      },
      tableFilterInfo: {
        items: [
          {
            fieldName: 'name',
            comparison: 'contains',
            formVisible: true,
            formItemUI: {
              label: '名称:',
            },
            editorUI: {
              placeHolder: '名称',
            },
          }, {
            fieldName: 'code',
            comparison: 'contains',
            formVisible: true,
            formItemUI: {
              label: '编号:',
            },
            editorUI: {
              placeHolder: '编号',
            },
          }, {
            fieldName: 'biz_module',
            formVisible: true,
            editorType: 'el-select',
            selectOptions: [{ options: [] }],  // created获取
            formItemUI: {
              label: '业务模块:',
            },
            editorUI: {
              placeHolder: '业务模块',
              clearable: true,
            },
          }, {
            fieldName: 'app_instance',
            formVisible: true,
            editorType: 'el-select',
            selectOptions: [{ options: [] }],  // created获取
            formItemUI: {
              label: '所属应用:',
            },
            editorUI: {
              placeHolder: '所属应用',
              clearable: true,
            },
          },
        ],
      },
      // 表信息
      table: {
        typeName: 'BizParamValue',
        parentFieldName: 'param_type',
        items: [
          {
            fieldName: 'pk',
          }, {
            fieldName: 'name',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '名称',
            },
            rules: [
              { required: true, message: '名称不能为空！' },
              {
                validator: (rule, value, callback) => {
                  this.$refs.treeTable.validateTableCellUnique(rule, value, callback)
                },
                trigger: 'blur',
              },
            ],
          }, {
            fieldName: 'code',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '编号',
            },
            rules: [
              { required: true, message: '编号不能为空！' },
              {
                validator: (rule, value, callback) => {
                  this.$refs.treeTable.validateTableCellUnique(rule, value, callback)
                },
                trigger: 'blur',
              },
            ],
          }, {
            fieldName: 'app_instance',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '所属应用',
            },
            editorType: 'el-select',
            selectOptions: [{ options: [] }],  // created获取,
          }, {
            fieldName: 'biz_module',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '业务模块',
            },
            editorType: 'el-select',
            selectOptions: [{ options: [] }],  // created获取,
          }, {
            fieldName: 'remark',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '备注',
            },
            editorUI: {
              type: 'textarea',
            },
          }, {
            fieldName: 'sn',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '排序号',
            },
          }, {
            fieldName: 'valid_flag',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '有效标志',
            },
            editorType: 'el-select',
            editValue: 'Y',
            selectOptions: [{
              options: [{
                value: 'Y',
                label: '是',
              }, {
                value: 'N',
                label: '否',
              }]
            }],
          },
        ],
      },
    }
  },
  created() {
    this.setDropdown()
  },
  methods: {
    setDropdown() {
      var listdata = {
        biz_module: {
          type: 'SysParamValue',
          props: ['pk', 'code', 'name', 'param_type'],
          filters: [
            {
              prop: 'param_type__code',       // 外键+__+字段
              value: 'biz_module',            // 业务模块
              comparison: 'exact',
            }, {// 使用标志
              prop: 'valid_flag',
              value: 'Y',
              comparison: 'exact',
            },]
        },
        app_instance: {
          type: 'AppInstance',
          props: ['pk', 'code', 'name'],
          filters: [
            { // 使用标志
              prop: 'valid_flag',
              value: 'Y',
              comparison: 'exact',
            },]
        },
      }

      api_gda.multilistData(listdata).then((responseData) => {
        //// 过滤条件
        // 业务模块下拉
        var filterBizModule = this._getLeafItems(this.tableFilterInfo.items).find(item => { return item.fieldName === 'biz_module' })
        if (filterBizModule) {
          this._setDropdown(responseData['biz_module'], filterBizModule.selectOptions[0].options)
        }
        // 所属应用下拉
        var filterAppModule = this._getLeafItems(this.tableFilterInfo.items).find(item => { return item.fieldName === 'app_instance' })
        if (filterAppModule) {
          this._setDropdown(responseData['app_instance'], filterAppModule.selectOptions[0].options)
        }

        //// 表列
        // 业务模块下拉
        var tableBizModule = this._getLeafItems(this.table.items).find(item => { return item.fieldName === 'biz_module' })
        if (tableBizModule) {
          this._setDropdown(responseData['biz_module'], tableBizModule.selectOptions[0].options)
        }
        // 应用模块下拉
        var tableAppModule = this._getLeafItems(this.table.items).find(item => { return item.fieldName === 'app_instance' })
        if (tableAppModule) {
          this._setDropdown(responseData['app_instance'], tableAppModule.selectOptions[0].options)
        }

      }).catch((error) => {
        // 设置界面
        utils_ui.showErrorMessage(error)
      })
    },
  },
}
</script>


