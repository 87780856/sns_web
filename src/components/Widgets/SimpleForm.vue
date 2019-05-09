<template>
  <el-form ref='elForm'
    :class='formUI.class'
    :style='formUI.style'
    :model='formData'
    :rules='formUI.rules'
    :inline='formUI.inline'
    :label-position='formUI.labelPosition'
    :label-width='formUI.labelWidth'
    :label-suffix='formUI.labelSuffix'
    :hide-required-asterisk='formUI.hideRequiredAsterisk'
    :show-message='formUI.showMessage'
    :inline-message='formUI.inlineMessage'
    :status-icon='formUI.statusIcon'
    :validate-on-rule-change='formUI.validateOnRuleChange'
    :size='formUI.size'
    :disabled='formUI.disabled'>
    <template v-for='item in formInfoData.items'>
      <template v-if='item.formVisible'>
        <template v-if='item.children && item.children.length>0'>
          <!-- 增加分组头部 -->
          <div :class="item.class?item.class:'el-form_header'"
            :style='item.style'>
            {{ item.formItemUI?item.formItemUI.label:'' }}
          </div>
          <!-- 增加分组内容 -->
          <template v-for='child in item.children'>
            <el-form-item v-if='child.formVisible'
              :class='child.formItemUI?child.formItemUI.class:undefined'
              :style='child.formItemUI?child.formItemUI.style:undefined'
              :prop="'attributes.'+child.itemKey+'.editValue'"
              :label='child.formItemUI?child.formItemUI.label:undefined'
              :label-width='child.formItemUI?child.formItemUI.labelWidth:undefined'
              :required='child.formItemUI?child.formItemUI.required:undefined'
              :rules='child.formItemUI?child.formItemUI.rules:undefined'
              :error='child.formItemUI?child.formItemUI.error:undefined'
              :show-message='child.formItemUI?child.formItemUI.showMessage:undefined'
              :inline-message='child.formItemUI?child.formItemUI.inlineMessage:undefined'
              :size='child.formItemUI?child.formItemUI.size:undefined'>
              <!-- {{ __test(formData)}} -->
              <DynamicEditor :editorUI='child.editorUI'
                :editorInfo='child'
                :editorModel='formData.props[child.itemKey]'
                @modelChanged='(val)=>{__handleFormDataModified(val, child.itemKey)}'>
                <template slot='dynamiceditor_customcontrol'>
                  <slot :name="'dynamiceditor_customcontrol'+child.itemKey">
                    <!-- {{child.itemKey}} -->
                  </slot>
                </template>
              </DynamicEditor>
            </el-form-item>
          </template>
        </template>
        <template v-else>
          <el-form-item :class='item.formItemUI?item.formItemUI.class:undefined'
            :style='item.formItemUI?item.formItemUI.style:undefined'
            :prop="'props.'+item.itemKey+'.editValue'"
            :label='item.formItemUI?item.formItemUI.label:undefined'
            :label-width='item.formItemUI?item.formItemUI.labelWidth:undefined'
            :required='item.formItemUI?item.formItemUI.required:undefined'
            :rules='item.formItemUI?item.formItemUI.rules:undefined'
            :error='item.formItemUI?item.formItemUI.error:undefined'
            :show-message='item.formItemUI?item.formItemUI.showMessage:undefined'
            :inline-message='item.formItemUI?item.formItemUI.inlineMessage:undefined'
            :size='item.formItemUI?item.formItemUI.size:undefined'>
            <!-- {{ __test(formData)}} -->
            <DynamicEditor :editorUI='item.editorUI'
              :editorInfo='item'
              :editorModel='formData.props[item.itemKey]'
              @modelChanged='(val)=>{__handleFormDataModified(val, item.itemKey)}'>
              <template slot='dynamiceditor_customcontrol'>
                <slot :name="'dynamiceditor_customcontrol'+item.itemKey">
                  <!-- {{item.itemKey}} -->
                </slot>
              </template>
            </DynamicEditor>
          </el-form-item>
        </template>
      </template>
    </template>
  </el-form>
</template>

<script>
import _ from 'lodash'
import * as utils_resource from '@/utils/resource'
import utils from '@/mixins/utils'
import DynamicEditor from '@/components/Widgets/DynamicEditor'

export var SimpleFormProps = {
  /**
   * 表ui
   * 参见element-ui组件el-form的属性
   */
  formUI: {
    type: Object,
    default: function () { return {} },
  },
  /**
   * 
    {
      // 表单内el-form表单对象
      items:[
        {
          // 1、自定义部分
          fieldName: xxx,         // 可选，属性的属性名
          comparison: 'xxx'       // 可选，默认为exact，操作符，具体参照django的Fields的lookup分词
          formVisible: false,     // 可选，默认为不显示，列是否可展示  

          // 2、可选 表单内表单项对象
          formItemUI: {
            // el-form-item的属性，参见element-ui组件
          },
          // 3、可选 表单项控件对象
          DynamicEditor控件的editorInfo的多个属性内容，参见DynamicEditor.editorInfo

          // 4、可选 孩子,目前只支持一层孩子，总共两层
          children:[{}],           
        },{
          ...
      }],
    }
   */
  formInfo: {
    type: Object,
    default: function () { return {} },
  },
}

/**
 * 简单的表单
 */
export default {
  name: 'SimpleForm',
  components: { DynamicEditor },
  mixins: [utils],
  props: Object.assign({
    /**
     * formmodel数据，参见资源描述对象,formModel中的属性应该与form中的属性保持顺序一直
     */
    formModel: {
      type: Object,
      default: function () { return {} },
    },
  }, SimpleFormProps),
  data: function () {
    var that = this
    function initFormInfoData(formInfo, that) {
      var retval = _.cloneDeep(formInfo)
      // 生成itemKey属性  
      that._setLeafItems(retval.items)
      return retval
    }
    function initFormData(that) {
      var tempList = that._getLeafItems(that.formInfo.items)
      var retval = null
      if (that.formModel && Object.keys(that.formModel).length > 0) {
        retval = new utils_resource.CResource(that.formModel)
      } else {
        retval = new utils_resource.CResource()
        retval.setAttributes(tempList)
      }
      return retval
    }
    return {
      // 表单结构信息
      formInfoData: initFormInfoData(this.formInfo, that),
      // 表单内容信息。为资源描述对象，其中props顺序与itemKey顺序相同
      formData: initFormData(),
    }
  },
  methods: {
    /**
     * 同el-form的validate，参见el-form
     * @param func 为回调函数，参见el-form的validate参数
     */
    validate(func) {
      this.$refs.elForm.validate(func)
    },

    validateDetailItemUnique(rule, value, callback, tableName) {
      // 表
      var fieldIndex = rule.field.split('.')[1]  // props.y.editValue
      // 查看当前资源行的差异状态，如果为修改和删除，则不判断唯一性
      var state = utils_resource.getResourceDifferenceState(this.formData)
      var currentValue = this.formData.props[fieldIndex].oldEditValue
      if (state === 'ROW_ADDED' || (state === 'ROW_MODIFIED' && currentValue !== value)) {
        this._validateUnique(rule, value, callback,
          tableName,
          this.formData.props[fieldIndex].fieldName)
      } else {
        callback()
      }
    },

    /**
     * 获取表单数据
     */
    getFormItems() {
      return _.cloneDeep(this.formData.getAttributes())
    },

    // 表单数据被修改
    __handleFormDataModified(val, index) {
      this.formData.modifyAttribute(index, val)
      /**
       * form表单中得到改变的值.
       * @event formModelChanged
       * @type {object}
       */
      this.$emit('formModelChanged', _.cloneDeep(val))
    },

    __test(obj) {
      console.log()
    }
  },
}
</script>
<style scoped>
.el-form_header {
  line-height: 50px;
  border-bottom: 1px solid #abb2c7;
  margin-bottom: 10px;
}
</style>
