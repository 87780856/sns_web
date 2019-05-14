<template>
  <SimpleTable ref='simpleTable'
    :tableFilterInfo='tableFilterInfo'
    :tableInfo='table' />
</template>
<script>
import utils from '@/mixins/utils'
import SimpleTable from '@/components/Widgets/SimpleTable'

export default {
  name: 'BizParamType',
  mixins: [utils],
  components: { SimpleTable },
  data() {
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
      table: {
        typeName: 'BizParamType',
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
                validator: (rule, value, callback) => { this.$refs.simpleTable.validateTableCellUnique(rule, value, callback) },
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
                validator: (rule, value, callback) => { this.$refs.simpleTable.validateTableCellUnique(rule, value, callback) },
                trigger: 'blur',
              },
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
  }
}
</script>

