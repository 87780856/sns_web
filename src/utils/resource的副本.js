/**
 * 资源描述对象
 * @param {Array} attrList                    可选，参见CAttribute
 * @param {String} typeName                   可选，该资源类型
 * @param {String} primaryAttributeName       可选，该资源主属性名
 * @param {String} primaryAttributeValue      可选，该资源主属性值，可为null，如果为空则自动生成
 * @param {String} associationTypeName        可选，关联类名
 * @param {String} associationAttributeName   可选，关联属性名
 * @param {String} associationAttributeValue  可选，关联属性值
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
