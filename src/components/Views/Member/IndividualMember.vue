<template>
  <SimpleTable :tableFilter='tableFilter'
    :tableInfo='table'>
  </SimpleTable>
</template>
<script>
import SimpleTable from '@/components/Widgets/SimpleTable'
export default {
  name: 'IndividualMember',
  components: {
    SimpleTable
  },
  data() {
    return {
      tableFilter: {
        // element-ui表单信息
        formUI: {
          inline: true,
        },
        items: [
          {
            // element-ui表单项信息
            formItemUI: {
              label: '编号:',
              size: 'mini',
            },
            // element-ui表单项编辑器的信息
            editorUI: {
              placeHolder: '编号',
            },
            // 自定义
            uri: 'code',
            editorType: 'el-input',
            comparison: 'contains',
          },
          {
            // element-ui表单项信息
            formItemUI: {
              label: '名称:',
              size: 'mini',
            },
            // element-ui表单项编辑器的信息
            editorUI: {
              placeHolder: '名称',
            },
            // 自定义
            uri: 'name',
            editorType: 'el-input',
            comparison: 'contains',
          },
        ],
      },
      table: {
        uri: 'common/party/IndividualMember',
        tableUI: {
          // element-ui
          border: true,
          highlightCurrentRow: true,
          size: 'medium',
        },
        items: [
          {
            uri: 'pk',
            visible: false,
            editable: false,
          }, {
            columnUI: {
              align: 'center',
              showOverflowTooltip: true,
              label: '编号',
              sortable: true,
            },
            formItemUI: {
              label: '编号',
            },
            editorUI: {
              autofocus: true,
              clearable: true,
              size: 'mini',
            },
            uri: 'code',
            editorType: 'el-input',
            visible: true,
            editable: true,
          }, {
            columnUI: {
              align: 'center',
              showOverflowTooltip: true,
              label: '名称',
              sortable: true,
            },
            formItemUI: {
              label: '名称:',
            },
            editorUI: {
              autofocus: true,
              clearable: true,
              size: 'mini',
            },
            uri: 'name',
            editorType: 'el-input',
            visible: true,
            editable: true,
          }, {
            columnUI: {
              align: 'center',
              showOverflowTooltip: true,
              label: '备注',
              sortable: true,
            },
            formItemUI: {
              label: '备注',
            },
            editorUI: {
              autofocus: true,
              clearable: true,
              size: 'mini',
            },
            uri: 'remark',
            editorType: 'el-input',
            visible: true,
            editable: true,
          }, {
            columnUI: {
              align: 'center',
              showOverflowTooltip: true,
              label: '排序号',
              sortable: true,
            },
            formItemUI: {
              label: '排序号',
            },
            editorUI: {
              autofocus: true,
              clearable: true,
              size: 'mini',
            },
            uri: 'sn',
            editorType: 'el-input',
            visible: true,
            editable: true,
          }
        ],
      },
    }
  }
}
</script>

