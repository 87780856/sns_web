<template>
  <SimpleTreeTable :treeFilter='treeFilter'
    :treeInfo='tree'
    :tableFilter='tableFilter'
    :tableInfo='table'
    tableAssoProp='parent' />
</template>

<script>
import SimpleTreeTable from '@/components/Widgets/SimpleTreeTable'

import { listData } from '@/api/gda'
import utils from '@/mixins/utils'

export default {
  name: 'Organization',
  mixins: [utils],
  components: {
    SimpleTreeTable
  },
  data() {
    return {
      treeFilter: {
        //表单信息
        formUI: {
          // element-ui
          inline: true,
        },
        items: [
          {
            // 自定义
            uri: 'name',
            editorType: 'el-input',
            comparison: 'contains',
            // element-ui表单项信息
            formItemUI: {
              label: '',
              size: 'mini',
            },
            // element-ui表单项编辑器的信息
            editorUI: {
              placeHolder: '名称',
            },
          },
        ]
      },
      tree: {
        // 自定义属性
        uri: 'common/party/Organization',
        rootVisible: true,
        rootName: '组织机构',
        displayProp: 'name',
        treeUI: {
          // element-ui的tree信息
          emptyText: '内容为空',
          nodeKey: 'uri',
          highlightCurrent: true,
          autoExpandParent: false,
          //showCheckbox: true,
          checkStrictly: false,
          defaultExpandAll: true,
        },
        items: [
          { uri: 'pk' },
          { uri: 'code' },
          { uri: 'name' },
          { uri: 'parent' },
        ],
      },

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
      // 表信息
      table: {
        uri: 'common/party/Organization',
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
            uri: 'code',
            editorType: 'el-input',
            visible: true,
            editable: true,
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
          }, {
            uri: 'name',
            editorType: 'el-input',
            visible: true,
            editable: true,
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
          }, {
            uri: 'description',
            editorType: 'el-input',
            visible: true,
            editable: true,
            columnUI: {
              align: 'center',
              showOverflowTooltip: true,
              label: '描述',
              sortable: true,
            },
            formItemUI: {
              label: '描述',
            },
            editorUI: {
              autofocus: true,
              clearable: true,
              size: 'mini',
            },
          }, {
            uri: 'remark',
            editorType: 'el-input',
            visible: true,
            editable: true,
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
          }, {
            uri: 'sn',
            editorType: 'el-input',
            visible: true,
            editable: true,
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
          }
        ],
      },
    }
  },
}
</script>


