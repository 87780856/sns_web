<template>
  <div>
    <SimpleButtonGroup class='simplebuttongroup'
      :buttonGroup='toolButtonGroupData' />
    <template v-if="detailStyle==='formstyle'">
      <SimpleForm ref='simpleForm'
        class='simpleform'
        :formUI='detailFormUI'
        :formInfo='detailFormInfo'
        :formModel='detailFormModel'>
        <template v-for='(item,index) in _getLeafItems(detailFormInfo.items)'>
          <template :slot="'dynamiceditor_customcontrol'+item.itemKey">
            <slot :name="'dynamiceditor_customcontrol'+item.itemKey">
              <!-- {{'dynamiceditor_customcontrol'+item.itemKey}} -->
            </slot>
          </template>
        </template>
      </SimpleForm>
    </template>
    <slot name='customdetail' />
  </div>
</template>

<script>
import * as api_gda from '@/api/gda'
import * as utils_resource from '@/utils/resource'
import * as utils_ui from '@/utils/ui'
import utils from '@/mixins/utils'
import SimpleButtonGroup from '@/components/Widgets/SimpleButtonGroup'
import SimpleForm from '@/components/Widgets/SimpleForm'

export var tableDetailWidgetProps = {
  /**
   * 工具栏更新按钮组，默认按钮组包含uri为[add,modify,delete,save]，
   * 可以对默认设置进行自定义修改，格式如下，
      [{
        uri:'',             // 为按钮唯一标示
        click:'',           // 点击事件函数
        name:'',            // name为按钮名字
        visible:true,       // 是否可视
        buttonUI:{
          // 参见element-ui el-button的属性
        }, 
      },
      ]
   */
  modifyButtonGroup: {
    type: Array,
    default: function () { return [] },
    /**
     * 工具栏输出按钮组，默认按钮组包含uri为[print,import,export]
     * 可以对默认设置进行自定义修改，格式如下，
        [{
          uri:'',             // 为按钮唯一标示
          click:'',           // 点击事件函数
          name:'',            // name为按钮名字
          visible:true,       // 是否可视
          buttonUI:{
            // 参见element-ui el-button的属性
          }, 
        },
        ]
     */
  },
  outputButtonGroup: {
    type: Array,
    default: function () { return [] },
  },
  /**
   *  按钮组,
   *  自定义按钮组customButtonGroup定义在更新按钮组modifyButtonGroup前，输出按钮组outputButtonGroup之后
    [
      [ // 分组
        {
          uri: ''          // 按钮唯一标示
          click: '',          // 点击事件
          name: '',           // 按钮名字
          visible: true      // 是否可视
          buttonUI: {
            // 参见element-ui el-button的属性
          },
        },...
      ],
      ...
    ]
   */
  customButtonGroup: {
    type: Array,
    default: function () { return [] },
  },
  /**
   * 详情formUI数据,参见SimpleForm的formUI属性
   */
  detailFormUI: {
    type: Object,
    default: function () { return {} }
  },
  /**
   * 详情form数据,参见SimpleForm的form属性
   */
  detailFormInfo: {
    type: Object,
    default: function () { return {} }
  },
  /**
   * 详情form数据Model,参见SimpleForm的formModel属性
   */
  detailFormModel: {
    type: Object,
    default: function () { return {} },
  },
  /**
   * 明细样式：包含formstyle,customstyle。默认为formstyle
   * customstyle:通过slot名为customdetail进行实现
   */
  detailStyle: {
    type: String,
    default: 'formstyle'
  },
}

export default {
  name: 'TableDetailWidget',
  mixins: [utils],
  components: {
    SimpleForm,
    SimpleButtonGroup,
  },
  props: Object.assign(
    {

    },
    tableDetailWidgetProps,
  ),
  data: function () {
    var that = this
    function initToolButtonGroup(that) {
      function findButtonGroup(buttonGroup, uri) {
        var tempButton = null
        for (var i = 0; i < buttonGroup.length; i++) {
          tempButton = buttonGroup[i].find(element => { return element.uri === uri })
          if (tempButton) {
            break
          }
        }
        return tempButton
      }
      function setButtonGroup(targetGroup, srcGroup) {
        if (srcGroup && srcGroup.length > 0) {
          srcGroup.forEach(button => {
            var tempButton = findButtonGroup(targetGroup, button.uri)
            if (tempButton) {
              Object.keys(button).forEach(prop => {
                tempButton[prop] = button[prop]
              })
            }
          })
        }
      }
      // 设置已有toolbuttongroup数据
      var tempToolButtonGroup = []
      // 返回
      var tempSearchGroup = [
        {
          uri: 'return',
          name: '返回',
          click: that.__handleReturnButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-search',
          },
        },
      ]
      setButtonGroup(tempSearchGroup, that.searchButtonGroup)
      tempToolButtonGroup.push(tempSearchGroup)
      // 修改
      var tempModifyGroup = [
        {
          uri: 'save',
          name: '保存',
          click: that.__handleSaveButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-tickets',
          },
        }, {
          uri: 'add',
          name: '增加',
          click: that.__handleAddButtonClicked,
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-circle-plus-outline',
          }
        },
      ]
      setButtonGroup(tempModifyGroup, that.modifyButtonGroup)
      tempToolButtonGroup.push(tempModifyGroup)
      // 自定义
      tempToolButtonGroup.concat(that.customButtonGroup)
      // 输出
      var tempOutputGroup = [
        {
          uri: 'import',
          name: '导入',
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-upload2',
          }
        }, {
          uri: 'export',
          name: '导出',
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-download',
          }
        }, {
          uri: 'print',
          name: '打印',
          visible: true,
          buttonUI: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-printer',
          }
        },
      ]
      setButtonGroup(tempOutputGroup, that.outputButtonGroup)
      tempToolButtonGroup.push(tempOutputGroup)

      return tempToolButtonGroup
    }
    return {
      // 工具按钮组
      toolButtonGroupData: initToolButtonGroup(this),
    }
  },

  methods: {
    /**
     * 校验表单项的唯一性 
     */
    validateDetailItemUnique(rule, value, callback, typeName) {
      this.$refs.simpleForm.validateDetailItemUnique(rule, value, callback, typeName)
    },

		/**
		 * 点击返回按钮
		 */
    __handleReturnButtonClicked() {
			/**
			 * 返回按钮
			 * @event detailReturnClicked
				*/
      this.$emit('detailReturnClicked')
    },
    /**
     * detailStyle为formstyle时有效
     */
    __handleSaveButtonClicked() {
      // 校验form
      this.$refs.simpleForm.validate((valid, obj) => {
        if (!valid) {
          let msg = ''
          Object.keys(obj).forEach(key => {
            obj[key].forEach(element => {
              msg += element.field + ':' + element.message // todo element.field 细化扩展修改
            })
          })
          utils_ui.showErrorMessage({ message: msg })
          return
        }
        var diffModel = this.$refs.simpleForm.getDifferenceData()
        if (!diffModel) {
          return
        }

        // 调用接口
        api_gda.saveData(this.detailFormInfo.typeName, diffModel).then((insertedRecords) => {
          this.$message({ message: '保存成功', type: 'success' })
          /**
           * 表保存后
           * @event tableDataSaved
           */
          this.$emit('tableDataSaved')
        }).catch((error) => {
          // 设置界面
          utils_ui.showErrorMessage(error)
        })
      })
    },
  },
}
</script>
<style scoped>
.simplebuttongroup {
  padding: 0px 0px 4px 0px;
}
.simpleform {
  /* padding: 0px 10px 0px 10px; */
}
</style>

