<template>
  <SimpleTable v-if='isList'
    ref='simpleTable'
    :tableFilter='tableFilter'
    :tableInfo='table'>
    <template slot='operating_column'
      slot-scope='{ row, column, $index }'>
      <el-button @click="handleClick(row)"
        type='text'
        size="mini">查看</el-button>
    </template>
  </SimpleTable>
  <!-- <AccountDetail v-else
    :formUI='formUI'
    :formInfo='table'
    @detailReturn='()=>isList=true'>
  </AccountDetail> -->
</template>

<script>
import SimpleTable from '@/components/Widgets/SimpleTable'
//import AccountDetail from '@/components/Views/Permission/AccountDetail'

export default {
  name: 'ControlPolicy',
  //mixins: [utils],
  components: { SimpleTable },
  data() {
    return {
      isList: true,
      tableFilter: {
        formUI: {
          inline: true,
          inlineMessage: true,
          size: 'mini',
        },
        items: [
          {
            fieldName: 'group__name',
            comparison: 'contains',
            formVisible: true,
            formItemUI: {
              label: '名称:',
            },
            editorUI: {
              placeHolder: '名称',
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
        tableName: 'ControlPolicy',
        hasOperatingColumn: true,
        items: [
          {
            fieldName: 'pk',
          },
          {
            fieldName: 'group__name',
            columnVisible: true,
            editable: true,
            formItemUI: {
              label: '名称:',
              // rules: [
              //   { required: true, message: '名称不能为空！' },
              // ],
            },
            columnUI: {
              label: '名称',
            },
          }, {
            fieldName: 'role_type',
            columnVisible: true,
            editable: true,
            formItemUI: {
              label: '角色类型',
            },
            columnUI: {
              label: '角色类型',
            },
          },// 其它
          {// remark
            fieldName: 'remark',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '备注',
            },
            editorUI: {
              type: 'textarea',
            },
          }, {//sn
            fieldName: 'sn',
            columnVisible: true,
            editable: true,
            columnUI: {
              label: '排序号',
            },
          }, {//valid_flag
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
      formUI: {
        inline: true,
        labelWidth: '100px',
        //showMessage: true,
        // inlineMessage: true,
      },
    }
  },
  methods: {
    handleClick(row) {
      this.isList = false
    },
  },
}
</script>


