<template>
  <div>
    <template v-if="editorInfo.editorType==='el-select'">
      <el-select :class='editorUI.class'
        :style='editorUI.style'
        :multiple='editorUI.multiple'
        :disabled='editorUI.disabled'
        :value-key='editorUI.valueKey'
        v-model='editorData.editValue'
        :size='editorUI.size'
        :clearable='editorUI.clearable'
        :collapse-tags='editorUI.collapseTags'
        :multiple-limit='editorUI.multipleLimit'
        :name='editorUI.name'
        :auto-complete='editorUI.autoComplete'
        :placeholder='editorUI.selectPlaceholder'
        :filterable='editorUI.filterable'
        :allow-create='editorUI.allowCreate'
        :filter-method='editorUI.filterMethod'
        :remote='editorUI.remote'
        :remote-method='editorUI.remoteMethod'
        :loading='editorUI.loading'
        :loading-text='editorUI.loadingText'
        :no-match-text='editorUI.noMatchText'
        :no-data-text='editorUI.noDataText'
        :popper-class='editorUI.popperClass'
        :reserve-keyword='editorUI.reserveKeyword'
        :default-first-option='editorUI.defaultFirstOption'
        :popper-append-to-body='editorUI.popperAppendToBody'
        :automatic-dropdown='editorUI.automaticDropdown'>
        <el-option-group v-for='group in editorInfo.selectOptions'
          :key='group.label'
          :label='group.label'
          :disabled='group.disabled'>
          <el-option v-for='option in group.options'
            :key='option.value'
            :value='option.value'
            :label='option.label'
            :disabled='option.disabled'>

          </el-option>
        </el-option-group>
      </el-select>
    </template>
    <template v-else-if="editorInfo.editorType==='el-checkbox'">
      <el-checkbox :class='editorUI.class'
        :style='editorUI.style'
        :label='editorUI.label'
        :true-label='editorUI.trueLabel'
        :false-label='editorUI.falseLabel'
        :disabled='editorUI.disabled'
        :border='editorUI.border'
        :size='editorUI.size'
        :name='editorUI.name'
        :checked='editorUI.checked'
        :indeterminate='editorUI.indeterminate'
        v-model='editorData.editValue'>
        {{editorUI.label}}
      </el-checkbox>
    </template>
    <template v-else>
      <el-input :class='editorUI.class'
        :style='editorUI.style'
        :type='editorUI.type'
        v-model='editorData.editValue'
        :maxlength='editorUI.maxlength'
        :minlength='editorUI.minlength'
        :placeholder='editorUI.placeHolder'
        :clearable='editorUI.clearable?editorUI.clearable:true'
        :disabled='editorUI.disabled'
        :size='editorUI.size'
        :prefixIcon='editorUI.prefixIcon'
        :suffixIcon='editorUI.suffixIcon'
        :rows='editorUI.rows'
        :autosize='editorUI.autosize'
        :autocomplete='editorUI.autocomplete'
        :name='editorUI.name'
        :readonly='editorUI.readonly'
        :max='editorUI.max'
        :min='editorUI.min'
        :step='editorUI.step'
        :resize='editorUI.resize'
        :autofocus='editorUI.autofocus'
        :form='editorUI.form'
        :label='editorUI.label'
        :tabindex='editorUI.tabindex'
        @keyup.enter.native='editorUI.keyupEnter'>
      </el-input>
    </template>
    <slot name='dynamiceditor_customcontrol' />
  </div>
</template>

<script>
import _ from 'lodash'
import utils from '@/mixins/utils';

export default {
  name: 'DynamicEditor',
  mixins: [utils],
  model: {
    prop: 'editorModel',
    event: 'modelChanged'
  },
  props: {
    /**
     * 控件ui
     * 具体控件属性,例如如果editorType='el-input'就是el-input的属性
     * 如果是el-select就是el-select的属性
     */
    editorUI: {
      type: Object,
      default: function () { return {} },
    },

    /**
     * 
      {
        // 具体控件属性,例如如果editorType='el-input'就是el-input的属性
        // 可选 默认为el-input类型，值为elementui的组件名如el-input、el-select
        editorType: 'el-input',
        // 可选 设置默认值
        editValue: 'xxx',
        // 可选 如果editorType为el-select，则需要按照规则维护
        selectOptions: [
          // 分组
          { 
            label:'xxx',      // 分组的组名
            disabled:false,   // 是否将该分组下所有选项置为禁用
            options: [        // 具体选项
              {
                value:'xxx'     // 选项的值
                label:'xxx',    // 选项的标签，若不设置则默认与 value 相同
                disabled:false, // 是否禁用该选项
              },...
            ]
          },
          ...
        ]

      },
      */
    editorInfo: {
      type: Object,
      default: function () { return {} },
    },

    /**
     * 编辑器的值,为资源描述的属性对象的属性信息，参考资源描述标准
     */
    editorModel: {
      type: Object,
      required: true
    },
  },

  // events
  // modelChanged 编辑器值被改变
  data: function () {
    return {
      editorData: _.cloneDeep(this.editorModel)
    }
  },
  watch: {
    // editorModel: {
    //   handler: function (val) {
    //     this.editorData = _.cloneDeep(val)
    //   },
    //   deep: true,
    // },
    'editorData.editValue': function (val) {
      if (this.editorInfo.editorType === 'el-select') {
        this.editorData.displayValue = this._getValueFromDropdownGroup(this.editorInfo, val)
      } else {
        this.editorData.displayValue = val
      }
      /**
       * form表单中得到改变的值.
       *
       * @event modelChanged
       * @type {object}
       */
      this.$emit('modelChanged', _.cloneDeep(this.editorData))
    },
  },
  methods: {
  },

}
</script>
<style scoped>
/* .dynamiceditor {
  width: 200px;
} */
</style>