<template>
  <div>
    <SimpleTreeTable :treeInfo="treeInfo"
      :treeInfoModel="treeInfoData"
      :treePropNames="treePropNames"
      :treeFiltersModel="treeFiltersData"
      prop="name"
      rootProp="控制对象"
      :isExistRoot="true"
      :isLazy="true"
      :tableFilters="tableFilters"
      :tableFiltersModel="tableFiltersData"
      :tableInfo="tableInfo"
      :tableHeader="tableHeader"
      :tableInfoModel="tableInfoData">
    </SimpleTreeTable>
  </div>
</template>

<script>
import * as utils_ui from '@/utils/ui'
import { listData } from "@/api/gda";
import utils from "@/mixins/utils";

import SimpleTreeTable from "@/components/Widgets/SimpleTreeTable";
// const controlObjectTypeDrop = [
//   {
//     id: 1,
//     name: "省级",
//     code: "1"
//   },
//   {
//     id: 2,
//     name: "地级",
//     code: "2"
//   },
//   {
//     id: 3,
//     name: "县级",
//     code: "3"
//   },
//   {
//     id: 4,
//     name: "乡级",
//     code: "4"
//   },
//   {
//     id: 5,
//     name: "村级",
//     code: "5"
//   }
// ]
export default {
  name: "ControlObject",
  mixins: [utils],

  components: {
    SimpleTreeTable
  },
  watch: {},

  methods: {},

  data() {
    return {
      controlObjectTypeDrop: [],

      treeInfo: {
        emptyText: "内容为空",
        nodekey: "uri",
        highlightCurrent: true,
        defaultExpandAll: false,
        expandOnClickNode: true,
        autoExpandParent: false,
        showCheckbox: true,
        checkStrictly: false,
        accordion: true,
      },
      treeInfoData: {
        uri: "ControlObject",
        props: {
          pk: {
          },
          code: {
          },
          name: {
            showToTree: true,
          },
          control_object_type: {
            selectOptions: this.controlObjectTypeDrop,
          },
        }
      },
      treePropNames: ["pk", "code", "name", "control_object_type", "parent"],
      treeFiltersData: {
        props: {
          name: {
            editValue: "",
            comparison: "contains",
          }
        }
      },
      // 表信息
      tableInfo: {
        // elementui-table
        border: true,
        highlightCurrentRow: true,
        size: "medium",
      },
      // 表头列信息
      tableHeader: {
        columns: {
          selection: {
            align: "center",
            showOverflowTooltip: true,
            type: "selection",
          },
          pk: {
            align: "center",
            showOverflowTooltip: true,
            label: "序号",
            sortable: true,
            type: "index",
            width: 70,
          },
          code: {
            align: "center",
            showOverflowTooltip: true,
            label: "编号",
            sortable: true,
          },
          name: {
            align: "center",
            showOverflowTooltip: true,
            label: "名称",
            sortable: true,
          },
          control_object_type: {
            align: "center",
            showOverflowTooltip: true,
            label: "控制对象类型",
            sortable: true,
            filterPlacement: "bottom-end",
            filterMethod: this.filteTag,
          },
          remark: {
            align: "center",
            showOverflowTooltip: true,
            label: "备注",
            sortable: true,
          },
          sn: {
            align: "center",
            showOverflowTooltip: true,
            label: "sn",
            sortable: true,
          },
          created_man: {
            align: "center",
            showOverflowTooltip: true,
            label: "创建人",
            sortable: true,
          },
          modified_man: {
            align: "center",
            showOverflowTooltip: true,
            label: "修改人",
            sortable: true,
          },
          created_datetime: {
            align: "center",
            showOverflowTooltip: true,
            label: "创建时间",
            sortable: true,
          },
          modified_datetime: {
            align: "center",
            showOverflowTooltip: true,
            label: "修改时间",
            sortable: true,
          },
          parent: {
            align: "center",
            showOverflowTooltip: true,
            label: "父",
            sortable: true,
          },
        },
        //对话框中得编辑组件得el-信息
        itemEditors: {
          // region_level: {
          //selectOptions: dropdownRegionLevel,
          //   selectClearable: true,
          //   selectPlaceholder: ""
          // }
        },
        formItems: {
          code: {
            label: "编号:",
          },
          name: {
            label: "名称:",
          },
          control_object_type: {
            label: "控制对象类型:"
          },
          remark: {
            label: "备注:"
          },
          sn: {
            label: "sn:"
          },
          parent: {
            label: "父:"
          }
        },
        form: {
          rules: {
            name: [
              { required: true, message: '请输入控制对象名称', trigger: 'blur' },
            ],
            control_object_type: [
              { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
          }
        }
      },
      tableInfoData: {
        uri: "ControlObject",
        props: {
          selection: {
            visible: true,
          },
          pk: {
            visible: false
          },
          code: {
            uri: "code",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
          name: {
            uri: "name",
            visible: true,
            editable: true,
            showToTree: true,
            editorType: "el-input",
            displayValue: "",
          },
          control_object_type: {
            uri: "control_object_type",
            visible: true,
            editable: true,
            selectOptions: [],
            editorType: "el-select",
            displayValue: "",
          },
          remark: {
            uri: "remark",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
          sn: {
            uri: "sn",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
          created_man: {
            uri: "created_man",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
          modified_man: {
            uri: "modified_man",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
          created_datetime: {
            uri: "created_datetime",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
          modified_datetime: {
            uri: "created_datetime",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
          parent: {
            uri: "parent",
            visible: true,
            editable: true,
            editorType: "el-input",
            displayValue: "",
          },
        }
      },
      tableFiltersData: {
        uri: "",
        props: {
          code: {
            uri: "code",
            editorType: "el-input",
            editValue: "",
            displayValue: "",
            comparison: "contains",
            displayValue: "",
          },
          name: {
            uri: "name",
            editorType: "el-input",
            editValue: "",
            displayValue: "",
            comparison: "contains",
            displayValue: "",
          }
        }
      },
      tableFilters: {
        form: {
          inline: true,
        },
        formItems: {
          code: {
            label: "编号:",
          },
          name: {
            label: "名称:",
          },
        },
        itemEditors: {
          code: {
            placeHolder: "编号",
          },
          name: {
            placeHolder: "名称",
          },
        },
      },
    }
  },
  created() {
    //临时获取下拉的数组
    let columns = {
      selection: {
        align: "center",
        showOverflowTooltip: true,
        type: "selection",
      },
      //pk主键，内部需要得到主键，可以在tableInfoData中隐藏，想要进行修改删除等操作就必需要有
      pk: {
        align: "center",
        showOverflowTooltip: true,
        label: "序号",
        sortable: true,
        type: "index",  //可以去掉，跟列的type类型无关，显示的是后台的主键
        width: 70,
      },
      code: {
        align: "center",
        showOverflowTooltip: true,
        label: "编号",
        sortable: true,
      },
      name: {
        align: "center",
        showOverflowTooltip: true,
        label: "名称",
        sortable: true,
      }
    }
    let tableInfoData = {
      //查询是要用的表名
      uri: "ControlObjectType",
      //控制表是否可编辑和显示 
      props: {
        selection: {
          visible: true,
        },
        pk: {
          visible: false
        },
        name: {
          visible: true,

          editorType: "el-input",
        },
        code: {
          visible: true,

          editorType: "el-input",
        }
      }
    }
    listData(
      tableInfoData.uri,
      Object.keys(columns),
      tableInfoData, 0, 0)
      .then(responseData => {

        responseData.forEach(element => {
          this.tableInfoData.props.control_object_type.selectOptions.push(
            {
              id: element.pk,
              code: element.code,
              name: element.name
            }
          )
        })
      }).catch(error => {
        utils_ui.showErrorMessage(error)
      }
      )
  }
}
</script>


