<template>
  <SimpleTable ref='simpleTable'
    :tableFilter='tableFilter'
    :tableInfo='table' />
</template>
<script>
import * as api_gda from '@/api/gda'
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils'
import SimpleTable from '@/components/Widgets/SimpleTable'

export default {
  name: 'AppInstance',
  mixins: [utils],
  components: { SimpleTable, },
  data() {
    return {
      tableFilter: {
        items: [
          {
            fieldName: 'app_module',
            formVisible: true,
            editorType: 'el-select',
            selectOptions: [{ options: [] }],  // created获取
            formItemUI: {
              label: '应用模块:',
            },
            editorUI: {
              placeHolder: '应用模块',
              clearable: true,
            },
          }, {
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
          },
        ],
      },
      table: {
        typeName: 'AppInstance',
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
                  this.$refs.simpleTable.validateTableCellUnique(rule, value, callback)
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
                  this.$refs.simpleTable.validateTableCellUnique(rule, value, callback)
                },
                trigger: 'blur',
              },
            ],
          }, {
            fieldName: 'app_module',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '应用模块',
            },
            editorType: 'el-select',
            selectOptions: [{ options: [] }],  // created获取   
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
        app_module: {
          type: 'SysParamValue',
          props: ['pk', 'code', 'name', 'param_type'],
          filters: [
            {
              prop: 'param_type__code',       // 外键+__+字段
              value: 'app_module',            // 应用模块
              comparison: 'exact',
            }, {
              // 使用标志
              prop: 'valid_flag',
              value: 'Y',
              comparison: 'exact',
            }
          ],
        },
      }

      api_gda.multilistData(listdata).then((responseData) => {
        //// 过滤条件
        var filterAppModule = this._getLeafItems(this.tableFilter.items).find(item => { return item.fieldName === 'app_module' })
        if (filterAppModule) {
          this._setDropdown(responseData['app_module'], filterAppModule.selectOptions[0].options)
        }

        //// 表列
        // 应用模块下拉
        var tableAppModule = this._getLeafItems(this.table.items).find(item => { return item.fieldName === 'app_module' })
        if (tableAppModule) {
          this._setDropdown(responseData['app_module'], tableAppModule.selectOptions[0].options)
        }

      }).catch((error) => {
        // 设置界面
        utils_ui.showErrorMessage(error)
      })

    },
  },

}
</script>

