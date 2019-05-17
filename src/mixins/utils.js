/**
 * @mixin
 */
import _ from 'lodash'

import * as api_gda from '@/api/gda'
import * as utils_ui from '@/utils/ui'
import { Message } from 'element-ui'

export default {
  methods: {
    /**
     * 设置所有资源属性的显示值
     * @param {Array} crecources 资源CResource列表，
     * @param {Array} constraintProps 为约束属性，包含字段约束,格式为[{fieldName:xxx}]
     */
    _setResourcesDisplayValue(crecources, constraintProps) {
      if (!crecources || !constraintProps) {
        return
      }
      crecources.forEach(rd => {
        this._setResourceDisplayValue(rd, constraintProps)
      })
    },

    /**
     * 设置资源属性的显示值
     * @param {Object} crecource 资源CResource，
     * @param {Array} constraintProps 为约束属性，包含字段约束,格式为[{fieldName:xxx}]
     */
    _setResourceDisplayValue(crecource, constraintProps) {
      if (!crecource || !constraintProps) {
        return
      }
      this._setPropertiesDisplayValue(
        crecource.getAttributes(),
        constraintProps,
      )
    },

    /**
     * 设置资源属性的显示值
     * @param {Object} attrs 资源CResource的属性列表，
     * @param {Array} constraintProps 为约束属性，包含字段约束,格式为[{fieldName:xxx}]
     */
    _setPropertiesDisplayValue(attrs, constraintProps) {
      if (
        !attrs ||
        !constraintProps ||
        attrs.length !== constraintProps.length
      ) {
        return
      }

      attrs.forEach((attr, index) => {
        if (constraintProps[index].editorType === 'el-select') {
          // 查找下拉id对应的value
          attr.setDisplayValue(
            this._getValueFromDropdownGroup(
              constraintProps[index].selectOptions,
              attr.getEditValue(),
            ),
          )
        } else {
          attr.setDisplayValue(attr.getEditValue())
        }
      })
    },

    /**
     * 传入下拉组及下拉的主键key，返回该主键对应的value
     */
    _getValueFromDropdownGroup(group, key) {
      var displayValue = null
      for (var i = 0; i < group.length; i++) {
        var option = group[i].options.find(element => {
          return element.value === key
        })
        if (option) {
          displayValue = option.label
          break
        }
      }
      return displayValue
    },

    /**
     * 将所得的datalist下拉信息，转换到dropdown下拉对象中
     * dropdown的下拉对象为 el-select
     * {
     *  value: xxx,
     *  label: xxx,
     *  disabled: xxx,
     *  code: xxx,
     * }
     */
    _setDropdown(datalist, dropdown) {
      datalist.forEach(element => {
        dropdown.push({
          value: element.pk,
          label: element.name,
          disabled: false,
          code: element.code,
        })
      })
    },

    /**
     * form表单校验唯一性
     * value为输入的校验值
     * type为表
     * props为要查询资源的属性列
     * filters为过滤条件，格式为资源属性列
     */
    _validateUnique(rule, value, callback, type, propName) {
      var props = [{ fieldName: 'pk' }]
      var filters = [
        {
          fieldName: propName,
          editValue: value,
          comparison: 'exact',
        },
      ]

      api_gda
        .listData(type, props, filters)
        .then(responseData => {
          if (responseData.length > 0) {
            callback(new Error('输入的内容已存在'))
          } else {
            callback()
          }
        })
        .catch(error => {
          // 设置界面
          utils_ui.showErrorMessage(error)
          callback(new Error('校验失败'))
        })
    },

    /**
     * 传入含有孩子的table.items数组，返回叶子节点列表对象
     * @returns
     * [{
     *    // item
     * },]
     */
    _getLeafItems(items) {
      function findLeafColumns(leafList, items) {
        if (!items) {
          return
        }
        items.forEach(element => {
          if (
            element.children &&
            Array.isArray(element.children) &&
            element.children.length > 0
          ) {
            findLeafColumns(leafList, element.children)
          } else {
            leafList.push(element)
          }
        })
      }

      var retval = []
      findLeafColumns(retval, items)
      return retval
    },

    /**
     * 设置items每个叶子节点中的属性
     * 1、增加itemKey字段，标示id
     * @param {Array} items 为对象数组
     * @returns
     * [{
     *    // item
     * },]
     */
    _setLeafItems(items) {
      function __doLeafItems(items, leaf) {
        if (!items || !Array.isArray(items) || !leaf || leaf.index < 0) {
          return
        }
        items.forEach(element => {
          if (
            element.children &&
            Array.isArray(element.children) &&
            element.children.length > 0
          ) {
            __doLeafItems(element.children, leaf)
          } else {
            element.itemKey = leaf.index.toString()
            leaf.index += 1
          }
        })
      }
      var leaf = { index: 0 }
      __doLeafItems(items, leaf)
    },
  },
}
