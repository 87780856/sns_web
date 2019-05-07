/**
 * 资源描述对象属性
 * @param {Object} attrObj 可选，构造对象可包含如下对象属性
   {
      fieldName,    {String} 属性名
      editValue,    {String} 属性值
      comparison,   {String} 比较符
      displayValue, {String} 显示值
      oldEditValue, {String} 旧显示值
      editable,     {Boolean} 可编辑状态
      editing,      {Boolean} 正在编辑状态
   }
 */
export function CAttribute(attrObj) {
  //// 私有属性
  // 属性名
  this.fieldName = null
  // 最新编辑角色数据
  this.editValue = null
  // 查询操作符，具体参照django的Fields的lookup分词
  this.comparison = 'exact'
  // 显示角色数据，创建后默认为编辑角色数据
  this.displayValue = null
  // 原编辑角色数据，创建后默认为编辑角色数据
  this.oldEditValue = null
  // 是否可编辑
  this.editable = false
  // 是否正在编辑
  this.editing = false

  /////////////////////////////////////////////////////////
  // 构造函数安全模式，避免创建时候丢掉new关键字
  if (!this instanceof CAttribute) {
    return undefined
  }

  // 构造
  if (attrObj) {
    var tempDisplayValue = null
    if (attrObj.displayValue) {
      // 注意显示值需要转换
      tempDisplayValue = attrObj.displayValue
    } else {
      if (attrObj.editValue) {
        tempDisplayValue = attrObj.editValue
      }
    }
    var tempOldEditValue = null
    if (attrObj.oldEditValue) {
      tempOldEditValue = attrObj.oldEditValue
    } else {
      if (attrObj.editValue) {
        tempOldEditValue = attrObj.editValue
      }
    }

    this.fieldName = attrObj.fieldName
    this.editValue = attrObj.editValue ? attrObj.editValue : null
    this.comparison = attrObj.comparison ? attrObj.comparison : 'exact'
    this.displayValue = tempDisplayValue
    this.oldEditValue = tempOldEditValue
    this.editable = attrObj.editable ? attrObj.editable : false
    this.editing = attrObj.editing ? attrObj.editing : false
  }

  //// 其它公有方法
  /**
   * 赋值属性
   * 将源CAttribute对象写入到目标CAttribute对象中
   * @param {Object} sourceCProp 源赋值属性
   */
  if (typeof this.assignAttribute != 'function') {
    CAttribute.prototype.assignAttribute = function(sourceCProp) {
      if (!sourceCProp) {
        return
      }

      Object.keys(this).forEach(key => {
        if (sourceCProp[key]) {
          this[key] = sourceCProp[key]
        }
      })
    }
  }

  //// 公有set、get方法
  if (typeof this.getFieldName != 'function') {
    CAttribute.prototype.getFieldName = function() {
      return this.fieldName
    }
  }
  if (typeof this.setFieldName != 'function') {
    CAttribute.prototype.setFieldName = function(fieldName) {
      this.fieldName = fieldName
    }
  }
  if (typeof this.getEditValue != 'function') {
    CAttribute.prototype.getEditValue = function() {
      return this.editValue
    }
  }
  if (typeof this.setEditValue != 'function') {
    CAttribute.prototype.setEditValue = function(editValue) {
      this.editValue = editValue
    }
  }
  if (typeof this.getComparison != 'function') {
    CAttribute.prototype.getComparison = function() {
      return this.comparison
    }
  }
  if (typeof this.setComparison != 'function') {
    CAttribute.prototype.setComparison = function(comparison) {
      this.comparison = comparison
    }
  }
  if (typeof this.getDisplayValue != 'function') {
    CAttribute.prototype.getDisplayValue = function() {
      return this.displayValue
    }
  }
  if (typeof this.setDisplayValue != 'function') {
    CAttribute.prototype.setDisplayValue = function(displayValue) {
      this.displayValue = displayValue
    }
  }
  if (typeof this.getOldEditValue != 'function') {
    CAttribute.prototype.getOldEditValue = function() {
      return this.oldEditValue
    }
  }
  if (typeof this.setOldEditValue != 'function') {
    CAttribute.prototype.setOldEditValue = function(oldEditValue) {
      this.oldEditValue = oldEditValue
    }
  }
  if (typeof this.getEditable != 'function') {
    CAttribute.prototype.getEditable = function() {
      return this.editable
    }
  }
  if (typeof this.setEditable != 'function') {
    CAttribute.prototype.setEditable = function(editable) {
      this.editable = editable
    }
  }
  if (typeof this.getEditing != 'function') {
    CAttribute.prototype.getEditing = function() {
      return this.editing
    }
  }
  if (typeof this.setEditing != 'function') {
    CAttribute.prototype.setEditing = function(editing) {
      this.editing = editing
    }
  }
}

/**
 * 资源描述对象
 * @param {Array} attrList 可选，参见CAttribute
 * @param {String} typeName 该资源类型
 * @param {String} primaryAttributeName 该资源主属性名
 * @param {String} primaryAttributeValue 该资源主属性值，可为null，如果为空则自动生成
 * @param {String} associationTypeName 关联类名
 * @param {String} associationAttributeName 关联属性名
 * @param {String} associationAttributeValue 关联属性值
 *
 */
export function CResource(
  typeName,
  primaryAttributeName,
  primaryAttributeValue,
  attrList,
  associationTypeName,
  associationAttributeName,
  associationAttributeValue,
) {
  //// 私有属性
  // 资源类型名
  this.typeName = typeName
  // 资源主属性
  this.primaryAttributeName = primaryAttributeName
  // 包含具体值
  this.primaryAttributeValue = primaryAttributeValue
    ? primaryAttributeValue
    : uuid()
  // 是否被选择
  this.selected = false
  // 差异改变状态，资源被改变时该值会设置相应差异,默认为null 可选值 'row_added','row_removed','row_modified'
  this.difference = null
  // （树）关联类名
  this.associationTypeName = associationTypeName
  // （树）关联属性名
  this.associationAttributeName = associationAttributeName
  // （树）关联属性值
  this.associationAttributeValue = associationAttributeValue
  // （树）树子节点对象列表
  this.subresourceList = [
    // CResource对象
  ]
  // （树）树节点是否被禁用，true为禁用
  this.disabled = false
  // （树）树节点是否被扩展，true为扩展
  this.expanded = false
  // 属性列表
  this.attributeList =
    attrList && Array.isArray(attrList)
      ? function(attrList) {
          var retval = []
          attrList.forEach(element => {
            retval.push(new CAttribute(element))
          })
          return retval
        }
      : []

  // 构造函数安全模式，避免创建时候丢掉new关键字
  if (!this instanceof CResource) {
    return undefined
  }

  //// 其它方法
  /**
   * 查找属性
   * @param {String} attributeName
   * @returns {Object} 如果没找到返回undefined，找到了返回属性对象
   */
  // if (typeof this.findAttribute != 'function') {
  //   CAttribute.prototype.findAttribute = function(attributeName) {
  //     if (!attributeName) {
  //       return undefined
  //     }
  //     return this.CAttributeList.find(element => {
  //       return element.getFieldName() === attributeName
  //     })
  //   }
  // }

  /**
   * 设置资源每个属性的editing状态
   * @param {Boolean} editingFlag
   */
  if (typeof this.setEditing != 'function') {
    CResource.prototype.setEditing = function(editingFlag) {
      this.CAttributeList.forEach(element => {
        if (element.getEditable()) {
          element.setEditing(editingFlag)
        }
      })
    }
  }
  /**
   * 从resourceList中查找该资源的孩子，最后增加搜到的所有孩子
   * @param {Array} resourceList 要查找的孩子资源池
   */
  if (typeof this.addSubresource != 'function') {
    CResource.prototype.addSubresource = function(resourceList) {
      var subresourceList = []
      for (var i = resourceList.length - 1; i >= 0; i--) {
        if (
          resourceList[i].getAssociationTypeName() === this.getTypeName() &&
          resourceList[i].getAssociationAttributeValue() ===
            this.getPrimaryAttributeValue()
        ) {
          subresourceList.push(resourceList[i])
          resourceList.splice(i, 1)
        }
      }
      for (var j = 0; j < subresourceList.length; j++) {
        subresourceList[j].addSubresource(resourceList)
      }
      this.setSubresourceList(subresourceList)
    }
  }
  /**
   * 修改一个资源中的属性,当前资源差异状态改为修改状态
   * @param {Object} attrObj 属性对象
   * @param {Integer} index 属性对象在资源属性列表中的索引
   *
   */
  // if (typeof this.modifyAttribute != 'function') {
  //   CResource.prototype.modifyAttribute = function(attrObj, index) {
  //     if (index >= this.getAttributeList().length) {
  //       return
  //     }

  //     this.getAttributeList()[index].assignAttribute(attrObj)
  //     if (
  //       this.getDifference() !== 'row_added' &&
  //       this.getDifference() !== 'row_removed'
  //     ) {
  //       this.setDifference('row_modified')
  //     }
  //   }
  // }
  /**
   * 在子资源中追加一个资源,当前资源差异状态改为增加状态
   * @param {Array} cresource, 要查找的孩子资源池
   */
  if (typeof this.insertSubresource != 'function') {
    CResource.prototype.insertSubresource = function(cresource) {
      cresource.setDifference('row_added')
      this.getSubresourceList().push(cresource)
    }
  }
  /**
   * 删除多个资源，这些资源差异状态改为删除状态
   * @param {Array} cresourceList 要删除的资源列表
   */
  // if (typeof this.removeResources != 'function') {
  //   CResource.prototype.removeResources = function removeResources(
  //     cresourceList,
  //   ) {
  //     if (!cresourceList || !Array.isArray(cresourceList)) {
  //       return
  //     }
  //     var indexes = [] // 已经插入未保存的资源索引
  //     cresourceList.forEach((element, index) => {
  //       if (element.getSelected()) {
  //         if (element.getDifference() === 'row_added') {
  //           indexes.push(index)
  //         }
  //         element.setDifference('row_removed')
  //       }
  //     })

  //     indexes.forEach(element => {
  //       cresourceList.splice(element, 1)
  //     })
  //   }
  // }

  /**
   * 从子资源列表中查找某个资源,未找到返回undefined，找到返回CResource资源对象
   * @param {String} typeName
   * @param {String} primaryAttributeValue
   */
  if (typeof this.findResource != 'function') {
    CResource.prototype.findResource = function(
      typeName,
      primaryAttributeValue,
    ) {
      var retval = undefined
      if (
        this.getTypeName() === typeName &&
        this.getPrimaryAttributeValue() === primaryAttributeValue
      ) {
        return this
      }

      for (var i = 0; i < this.getSubresourceList().length; i++) {
        if (
          this.getSubresourceList()[i].getTypeName() === typeName &&
          this.getSubresourceList()[i].getPrimaryAttributeValue() ===
            primaryAttributeValue
        ) {
          retval = this.getSubresourceList()[i]
        } else {
          retval = this.getSubresourceList()[i].findResource(
            typeName,
            primaryAttributeValue,
          )
        }
        if (retval) {
          break
        }
      }
      return retval
    }
  }
  /**
   * 查找该资源与其子资源被选择的所有对象列表
   * @returns {Array} 返回被找到的资源列表
   */
  if (typeof this.findSelected != 'function') {
    CResource.prototype.findSelected = function() {
      function findSelectedResource(node, selectedList) {
        if (node.getSelected()) {
          selectedList.push(node)
        }
        node.getSubresourceList().forEach(element => {
          findSelectedResource(element, selectedList)
        })
      }
      var retval = []
      findSelectedResource(this, retval)
      return retval
    }
  }

  //// 公有set、get方法
  if (typeof this.getTypeName != 'function') {
    CResource.prototype.getTypeName = function() {
      return this.typeName
    }
  }
  if (typeof this.setTypeName != 'function') {
    CResource.prototype.setTypeName = function(typeName) {
      this.typeName = typeName
    }
  }
  if (typeof this.getPrimaryAttributeValue != 'function') {
    CResource.prototype.getPrimaryAttributeValue = function() {
      return this.primaryAttributeValue
    }
  }
  if (typeof this.setPrimaryAttributeValue != 'function') {
    CResource.prototype.setPrimaryAttributeValue = function(
      primaryAttributeValue,
    ) {
      this.primaryAttributeValue = primaryAttributeValue
    }
  }
  if (typeof this.getSelected != 'function') {
    CResource.prototype.getSelected = function() {
      return this.selected
    }
  }
  if (typeof this.setSelected != 'function') {
    CResource.prototype.setSelected = function(selected) {
      this.selected = selected
    }
  }
  /**
   * 获得资源的差异状态
   * @returns {String} 增加返回'row_added',删除返回'row_removed'，修改返回'row_modified'，其它返回null
   */
  if (typeof this.getDifference != 'function') {
    CResource.prototype.getDifference = function() {
      return this.difference
    }
  }
  if (typeof this.setDifference != 'function') {
    CResource.prototype.setDifference = function(difference) {
      this.difference = difference
    }
  }
  if (typeof this.getAssociationTypeName != 'function') {
    CResource.prototype.getAssociationTypeName = function() {
      return this.associationTypeName
    }
  }
  if (typeof this.setAssociationTypeName != 'function') {
    CResource.prototype.setAssociationTypeName = function(typeName) {
      this.associationTypeName = typeName
    }
  }
  if (typeof this.getAssociationAttributeName != 'function') {
    CResource.prototype.getAssociationAttributeName = function() {
      return this.associationAttributeName
    }
  }
  if (typeof this.setAssociationAttributeName != 'function') {
    CResource.prototype.setAssociationAttributeName = function(
      primaryAttributeValue,
    ) {
      this.associationAttributeName = primaryAttributeValue
    }
  }
  if (typeof this.getAssociationAttributeValue != 'function') {
    CResource.prototype.getAssociationAttributeValue = function() {
      return this.associationAttributeValue
    }
  }
  if (typeof this.setAssociationAttributeValue != 'function') {
    CResource.prototype.setAssociationAttributeValue = function(
      primaryAttributeValue,
    ) {
      this.associationAttributeValue = primaryAttributeValue
    }
  }
  if (typeof this.getSubresourceList != 'function') {
    CResource.prototype.getSubresourceList = function() {
      return this.subresourceList
    }
  }
  if (typeof this.setSubresourceList != 'function') {
    CResource.prototype.setSubresourceList = function(subresourceList) {
      this.subresourceList = subresourceList
    }
  }
  if (typeof this.getDisabled != 'function') {
    CResource.prototype.getDisabled = function() {
      return this.disabled
    }
  }
  if (typeof this.setDisabled != 'function') {
    CResource.prototype.setDisabled = function(disabled) {
      this.disabled = disabled
    }
  }
  if (typeof this.getExpanded != 'function') {
    CResource.prototype.getExpanded = function() {
      return this.expanded
    }
  }
  if (typeof this.setExpanded != 'function') {
    CResource.prototype.setExpanded = function(expanded) {
      this.expanded = expanded
    }
  }
  if (typeof this.getAttributeList != 'function') {
    CResource.prototype.getAttributeList = function() {
      return this.CResourceList
    }
  }
  if (typeof this.setAttributeList != 'function') {
    CResource.prototype.setAttributeList = function(attrList) {
      this.attributeList = attrList
    }
  }
}

import _ from 'lodash'

function uuid() {
  const uuidv4 = require('uuid/v4')
  return uuidv4()
}

//////////////////////////////////////////////////////////////////////////////
// 操作资源序列方法
//////////////////////////////////////////////////////////////////////////////
/**
 * 将record对象通过attrList属性约束列表转换并生成CResource资源
 * @param {String} typeName 该资源的类型
 * @param {Object} record 转换前的资源数据
·* {
·*    pk:'xxx',   // 必须有
·*    ...         // 其它
·* }
 * @param {Array} attrList 转换前的资源属性约束,约束对象的primaryAttributeValue属性必须有，其它非必填，格式参考CAttribute
 * [{ primaryAttributeValue:xxx }]
 * @param {String} assoTypeName 关联类 
 * @param {String} assoFieldName 关联属性
 */
export function generateResource(
  typeName,
  record,
  attrList,
  assoTypeName,
  assoFieldName,
) {
  if (!typeName || !record) {
    return null
  }

  var tempProps = []
  var associationTypeName = null
  var associationAttributeName = null
  var associationAttributeValue = null

  if (attrList && Array.isArray(attrList)) {
    attrList.forEach(attr => {
      // 查找record列是否存在
      var primaryAttributeValue = Object.keys(record).find(element => {
        return element === attr.primaryAttributeValue
      })
      // 如果存在则设置属性的值
      if (primaryAttributeValue) {
        tempProps.push({
          primaryAttributeValue,
          editValue: record[primaryAttributeValue],
          comparison: attr.comparison,
          displayValue: attr.displayValue,
          oldEditValue: attr.oldEditValue,
          editable: attr.editable,
          editing: attr.editing,
        })
        if (assoFieldName === primaryAttributeValue) {
          associationTypeName = assoTypeName
          associationAttributeName = assoFieldName
          associationAttributeValue = record[primaryAttributeValue]
        }
      } else {
        tempProps.push(attr)
      }
    })
  }
  var retval = new CResource(
    tempProps,
    typeName,
    record.pk,
    associationTypeName,
    associationAttributeName,
    associationAttributeValue,
  )
  return retval
}
/**
 * 将records对象列表通过attrList属性约束列表转换并生成所有CResource资源列表
 * @param {String} typeName 该资源的类型
 * @param {Array} records 转换前的资源列表
 *  [
 *    {
 *      pk:'xxx',   // 必须有
 *      ...         // 其它
 *    },
 *    ...
 *  ]
 * @param {Array} attrList 转换前的资源属性约束,约束对象的primaryAttributeValue属性必须有，其它非必填，格式参考CAttribute
 * [{ primaryAttributeValue:xxx }]
 * @param {String} assoTypeName 关联类
 * @param {String} assoFieldName 关联属性
 * @param {Boolean} isExistRoot 是否存在根
 * @param {String} treeRoot 树根CResource资源对象
 */
export function generateResources(
  typeName,
  records,
  attrList,
  assoTypeName,
  assoFieldName,
  isExistRoot,
  treeRoot,
) {
  if (!typeName || !records) return
  var resourceList = []
  records.forEach(element => {
    var res = generateResource(
      typeName,
      element,
      attrList,
      assoTypeName,
      assoFieldName,
    )
    if (res) {
      resourceList.push(res)
    }
  })

  var retval = []
  // 如果要自关联生成父子树结构
  if (typeName === assoTypeName) {
    //var tempNodeData = _.cloneDeep(resourceList)
    // 先得到一级子节点
    var firstLevelNodes = []
    for (var i = resourceList.length - 1; i >= 0; i--) {
      if (
        !resourceList[i].getAssociationTypeName() ||
        !resourceList[i].getAssociationAttribute() ||
        !resourceList[i].getAssociationAttributeValue()
      ) {
        firstLevelNodes.push(resourceList[i])
        resourceList.splice(i, 1)
      }
    }
    // 查找孩子并加入孩子
    for (var j = 0; j < firstLevelNodes.length; j++) {
      firstLevelNodes[j].addSubresource(resourceList)
    }

    //
    var retval = []
    if (!isExistRoot) {
      retval = firstLevelNodes
    } else {
      if (treeRoot) {
        treeRoot.setSubresourceList(firstLevelNodes)
        retval.push(treeRoot)
      } else {
        retval = firstLevelNodes
      }
    }
  } else {
    retval = resourceList
  }

  return retval
}
/**
 * 查找资源，如果没找到返回undefined
 * @param {Array} cresourceList
 * @param {String} typeName uri的typeName
 * @param {String} primaryAttributeValue uri的primaryAttributeValue，可为null，如果为空则自动生成
 * @returns {Object} 如果没找到返回undefined，找到返回CResource对象
 */
export function findResources(cresourceList, typeName, primaryAttributeValue) {
  if (
    !cresourceList ||
    !Array.isArray(cresourceList) ||
    !typeName ||
    !primaryAttributeValue
  ) {
    return undefined
  }

  var retval = undefined
  for (var i = 0; i < cresourceList.length; i++) {
    retval = cresourceList[i].findResource()
    if (retval) {
      break
    }
  }
  return retval
}
/**
 * 是否存在被选择的资源
 * @param {Array} cresourceList
 * @returns {Boolean} 是为true 否为false
 */
export function hasResourcesSelected(cresourceList) {
  if (!cresourceList || !Array.isArray(cresourceList)) {
    return false
  }

  for (var i = 0; i < cresourceList.length; i++) {
    var tempList = cresourceList[i].findSelected()
    if (tempList && tempList.length > 0) {
      return true
    }
  }
  return false
}

/**
 * 设置资源序列的selected状态
 * @param {Array} sourceRds 源资源列表
 * @param {Array} selectedRds 已选择的资源列表
 */
export function setResourcesSelectedState(sourceRds, selectedRds) {
  if (!sourceRds || !Array.isArray(sourceRds)) {
    return
  }

  // 非选定资源
  var notSelectedRds = _.differenceWith(sourceRds, selectedRds, _.isEqual)
  if (notSelectedRds && Array.isArray(notSelectedRds)) {
    notSelectedRds.forEach(rd => {
      rd.setSelected(false)
    })
  }
  // 选定资源
  if (selectedRds && Array.isArray(selectedRds)) {
    selectedRds.forEach(rd => {
      rd.setSelected(true)
    })
  }
}
//////////////////////////////////////////////////////////////////////////////
// 未
//////////////////////////////////////////////////////////////////////////////
/**
 * 生成树资源
 *
 */
// export function generateTreeResources(nodeData, isExistRoot, treeRoot) {
//   if (!nodeData) {
//     return
//   }
//   var tempNodeData = _.cloneDeep(nodeData)
//   // 先得到一级子节点
//   var firstLevelNodes = []
//   for (var i = tempNodeData.length - 1; i >= 0; i--) {
//     if (!tempNodeData[i].parentUri) {
//       firstLevelNodes.push(tempNodeData[i])
//       tempNodeData.splice(i, 1)
//     }
//   }

//   // 深度遍历
//   addSubresource(firstLevelNodes, tempNodeData)

//   //
//   var retval = []
//   if (!isExistRoot) {
//     retval = firstLevelNodes
//   } else {
//     treeRoot.childrenObj = firstLevelNodes
//     retval.push(treeRoot)
//   }
//   return retval
// }

/**
 * 更新资源，将增减、删除、修改的资源差异状态调整为未改变状态null
 * 注意：cresourceList中增加的资源与addedRecords的记录顺序需要保持一致
 * @param {Array} cresourceList 资源列表
 * @param {Array} addedRecords 被生成主键的资源列表,其主键存放在pk字段中，其格式为
 *  [
 *    {
 *      pk:'xxx',   // 必须有
 *      ...         // 其它
 *    },
 *    ...
 *  ]
 */
// export function saveResources(cresourceList, addedRecords) {
//   if (!cresourceList || !Array.isArray(cresourceList)) {
//     return
//   }

//   var insertedIndex = 0
//   var removingIndexList = []
//   cresourceList.forEach((rd, index) => {
//     // 插入
//     if (rd.getDifference() === 'row_added') {
//       if (
//         addedRecords &&
//         Array.isArray(addedRecords) &&
//         addedRecords.length > insertedIndex
//       ) {
//         rd.setPrimaryAttributeValue(addedRecords[insertedIndex].pk)
//         ++insertedIndex
//         rd.setDifference(null)
//       }
//     }
//     // 更新
//     else if (rd.getDifference() === 'row_modified') {
//       rd.getAttributeList().forEach(attr => {
//         attr.setOldEditValue(attr.getEditValue())
//       })
//       rd.setDifference(null)
//     } else if (rd.getDifference() === 'row_removed') {
//       removingIndexList.push(index)
//     }
//   })
//   // 删除资源
//   for (var i = removingIndexList.length - 1; i >= 0; i--) {
//     rds.splice(removingIndexList[i], 1)
//   }
// }
