<template>
  <TableWidget ref='simpleTable'
    :tableFilterInfo='tableFilterInfo'
    :tableUI='tableUI'
    :tableInfo='table' />
</template>

<script>
import utils from '@/mixins/utils'
import TableWidget from '@/components/Widgets/TableWidget'

export default {
  name: 'SysParamType',
  mixins: [utils],
  components: { TableWidget },
  data() {
    var validatePass = (rule, value, callback) => {
      this.$refs.simpleTable.validateTableCellUnique(rule, value, callback)
    }

    return {
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
            fieldName: 'valid_flag',
            formVisible: true,
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
            formItemUI: {
              label: '有效标志:',
            },
            editorUI: {
              clearable: true,
              placeHolder: '有效标志',
            },
          },
        ],
      },
      tableUI: {
      },
      table: {
        typeName: 'SysParamType',

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
              { required: true, message: '名称不能为空！', },
              { validator: validatePass, trigger: 'blur', },
            ],
          }, {
            fieldName: 'code',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '编号',
            },
            rules: [
              { required: true, message: '编号不能为空！', },
              { validator: validatePass, trigger: 'blur', },
            ],
          }, {
            fieldName: 'description',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '描述',
            },
            editorUI: {
              type: 'textarea',
            },
          }, {
            columnVisible: true,
            columnUI: {
              label: '其它',
            },
            children: [{
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
            }]
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
  methods: {
  },
}
</script>

