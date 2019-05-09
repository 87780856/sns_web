<template>
  <div>
    <!-- 过滤条件 -->
    <template v-if='treeFilterVisible'>
      <el-row>
        <el-col :span="20">
          <SimpleForm ref='treeFilter'
            class='simplefilter'
            :formUI='treeFilterUI'
            :formInfo='treeFilter'
            @formModelChanged='__filterText' />
        </el-col>
        <el-col :span="4">
          <el-button class='freshbutton'
            type='primary'
            icon='el-icon-refresh'
            :size='treeFilterUI.size'
            @click.native='fetchData'></el-button>
        </el-col>
      </el-row>
    </template>
    <el-tree ref='tree'
      class='customtree'
      :data='treeData'
      :empty-text="treeUI.emptyText ? treeUI.emptyText : '内容为空'"
      :node-key="treeUI.nodeKey ? treeUI.nodeKey : 'uri'"
      :props='treeNodeProps'
      :render-after-expand='treeUI.renderAfterExpand'
      :render-content='treeUI.renderContent'
      :highlight-current='treeUI.highlightCurrent'
      :default-expand-all='treeUI.defaultExpandAll'
      :expand-on-click-node='treeUI.expandOnClickNode'
      :auto-expand-parent='treeUI.autoExpandParent'
      :default-expanded-keys='treeUI.defaultExpandedKeys'
      :show-checkbox='treeUI.showCheckbox'
      :check-strictly='treeUI.checkStrictly'
      :default-checked-keys='treeUI.defaultCheckedKeys'
      :filter-node-method='__filterNodeMethod'
      :accordion='treeUI.accordion'
      :indent='treeUI.indent'
      :draggable='treeUI.draggable'
      :allow-drag='treeUI.allowDrag'
      :allow-drop='treeUI.allowDrop'
      @node-click='nodeClick'>
    </el-tree>
  </div>
</template>

<script>
import * as api_gda from '@/api/gda'
import * as utils_resource from '@/utils/resource'
import * as utils_validate from '@/utils/validate'
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils'
import SimpleForm from '@/components/Widgets/SimpleForm'

export default {
  name: 'SimpleTree',
  mixins: [utils],
  components: {
    SimpleForm,
  },
  props: {
    /**
     * 是否显示树的过滤信息
     */
    treeFilterVisible: {
      type: Boolean,
      default: true,
    },
    /**
     * 树过滤条件信息UI，参见SimpleForm的formUI属性
     */
    treeFilterUI: {
      type: Object,
      default: function () {
        return {
          labelPosition: 'top',
          size: 'mini',
        }
      },
    },
    /**
     * 树过滤条件信息，参见SimpleForm的form属性
     */
    treeFilter: {
      type: Object,
      default: function () { return {} },
    },
    /**
     * 表ui
     * 参见element-ui组件el-tree的属性
     * 不支持懒加载属性:lazy, load
     */
    treeUI: {
      type: Object,
      default: function () { return {} },
    },

    /**
     * 树信息
      {
        // 1、自定义部分
        tableName: 'xxx',                   // 必须，业务表信息，xxx为业务表uri，如“SysParamType”
        rootVisible: false,                 // 非必须，根节点是否显示
        rootName: 'xxx',                    // 非必须，根节点的名字需要与rootVisible属性连用
        displayFieldName: 'xxx'             // 树节点要显示的属性， xxx为列属性
        parentFieldName: 'xxx'              // 树节点的父属性， xxx为列属性
        // 3、各列
        items:[{
            // 表单内表单项内容
            SimpleForm控件的form.items属性中的对象内容，参见SimpleForm.form.items[x]对象
          },{
            ...
        }],
      }  
     */
    treeInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      // 树根节点
      treeRoot: utils_resource.generateResource([], '__root__'),
      // 树数据，参见通用资源描述结构,
      treeData: [],
      // 树节点属性
      treeNodeProps: {
        label: (data, node) => {
          if (data.uri === this.treeRoot.uri) {
            return this.treeInfo.rootName
          } else {
            let fn = utils_resource.findProperty(data.props, this.treeInfo.displayFieldName)
            if (fn) {
              return fn.editValue
            } else {
              return "错误!!!"
            }
          }
        },
        children: 'childrenObj',
        disabled: 'disabled',
        isLeaf: (data, node) => {
          return false
        }
      },
    }
  },
  methods: {
    //正常加载代码    
    fetchData(currentTreeNodeUri) {
      api_gda.listData(this.treeInfo.tableName,
        this.treeInfo.items,
        (this.$refs.treeFilter ? this.$refs.treeFilter.getFormItems() : null),
      ).then((responseData) => {
        // 生成分页数据
        let nodeData = utils_resource.setResources(responseData, this.treeInfo.items, this.treeInfo.parentFieldName)
        // 设置显示角色
        this._setResourcesDisplayValue(nodeData, this.treeInfo.items)
        // 生成树
        this.treeData = utils_resource.generateTreeResources(nodeData, this.treeInfo.rootVisible, this.treeRoot)
        // 设置当前节点
        if (currentTreeNodeUri) {
          this.$refs.tree.setCurrentKey(currentTreeNodeUri)
        }
      }).catch((error) => {
        // 设置界面
        utils_ui.showErrorMessage(error)
      })
    },
    __filterNodeMethod(value, data, node) {
      if (!value || !value.editValue || value.editValue == '') return true
      // 判断树根
      if (this.treeInfo.rootVisible && this.isTreeRoot(data.uri)) {
        return true
      }
      let obj = utils_resource.findProperty(data.props, this.treeInfo.displayFieldName)
      if (!obj) {
        return false
      }
      return utils_validate.validatContainSubString(value.editValue, obj.editValue)
    },
    getCurrentKey() {
      return this.$refs.tree.getCurrentKey()
    },
    isTreeRoot(uri) {
      return uri === this.treeRoot.uri
    },
    nodeClick(data, node, self) {
      /**
       * 树节点被点击事件
       *
       * @event nodeClick
       */
      this.$emit('nodeClick')
    },
    __filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    // 'filterInfo.editValue': function (val) {
    //   this.$refs.tree.filter(val)
    // },
  },

}
</script>

<style scoped>
.simplefilter {
  padding: 5px 10px 5px 10px;
}
.freshbutton {
  margin-top: 5px;
}
.customtree {
  padding: 5px 10px 5px 10px;
}
</style>