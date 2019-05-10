<template>
  <SimpleTable ref='simpleTable'
    tableMode='modetwo'
    :tableFilter='tableFilter'
    :tableInfo='tableInfo'
    :detailFormInfo='detailFormInfo'>
    <template slot='dynamiceditor_customcontrol2'>
      <el-button type='primary'
        size='mini'
        icon='el-icon-edit'>
        修改
      </el-button>
    </template>
  </SimpleTable>
</template>
<script>
// import utils from '@/mixins/utils'
import SimpleTable from '@/components/Widgets/SimpleTable'

export default {
  name: 'Account',
  // mixins: [utils],
  components: { SimpleTable },
  data() {
    return {
      tableFilter: {
        items: [
          {
            fieldName: 'user__username',
            comparison: 'contains',
            formVisible: true,
            formItemUI: {
              label: '账号:',
            },
            editorUI: {
              placeHolder: '账号',
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
      tableInfo: {
        typeName: 'Account',
        items: [
          {
            fieldName: 'pk',
          }, {
            fieldName: 'user__username',
            columnVisible: true,
            columnUI: {
              label: '账号',
            },
          }, {
            fieldName: 'remark',
            columnVisible: true,
            columnUI: {
              label: '备注',
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
      detailFormInfo: {
        items: [
          {
            fieldName: 'pk',
          }, {
            formVisible: true,
            formItemUI: {
              label: '账号信息',
            },
            children: [
              {
                fieldName: 'user__username',
                formVisible: true,
                formItemUI: {
                  label: '账号:',
                  rules: [
                    { required: true, message: '账号不能为空！' },
                    {
                      validator: (rule, value, callback) => {
                        this.$refs.simpleTable.validateDetailItemUnique(rule, value, callback)
                      },
                      trigger: 'blur',
                    },
                  ],
                },
                editorUI: {
                  placeHolder: '账号',
                  style: { width: 'auto' },
                },
              }, {
                fieldName: 'user__password',
                formVisible: true,
                formItemUI: {
                  label: '密码:',
                },
                editorUI: {
                  readonly: true,
                  style: { width: 'auto' },
                },
              }
            ],
          }, {
            formVisible: true,
            formItemUI: {
              label: '权限信息',
            },
            children: [
              {
                fieldName: 'user__is_active',
                formVisible: true,
                editorType: 'el-checkbox',
                editorUI: {
                  label: '账号是否激活',
                },
              }, {
                fieldName: 'user__is_staff',
                formVisible: true,
                editorType: 'el-checkbox',
                editorUI: {
                  label: '账号可否登录后台',
                },
              }, {
                fieldName: 'user__is_superuser',
                formVisible: true,
                editorType: 'el-checkbox',
                editorUI: {
                  label: '账号是否为超级管理员',
                },
              },
            ],
          },
        ],
      },
    }
  },
  methods: {
  },
}
</script>
<style scoped>
</style>


