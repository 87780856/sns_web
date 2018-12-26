//// 资源描述对象
// {
//   uri: xxx,
//   selected: false,         // 是否被选择，默认为未选择false
//   difference: null         // 改变差异，该资源被改变该值会设置相应差异,默认为null 可选值 'row_added','row_removed','row_modified'
//   parentUri: {             //
//     fieldName: 'xxx',      // （树）父节点属性，xxx为父节点的uri
//     editValue: '',         // （树）父节点值，
//   }
//   childrenObj: [{xxx},],     // （树）树子节点，xxx为子节点对象
//   disabled: false,         // （树）树节点是否被禁用，true为禁用
//   props: [
//		{
//       fieldName: '',       // 必填 业务对象属性
//       editValue: null,     // 默认为null				最新编辑角色数据
// 			 comparison: 'exact'	// 默认为exact			查询操作符，具体参照django的Fields的lookup分词
//       displayValue: null,  // 默认为编辑角色数据	显示角色数据
//       oldEditValue: null,  // 默认为编辑角色数据	单元格未保存时的旧编辑角色数据
//       editable: false,     // 默认为false			单元格可编辑
//       editing: false,      // 默认为false			单元格正在编辑
//     },
//     //...
//   ],
// },

import _ from 'lodash'

function uuid() {
  const uuidv4 = require('uuid/v4')
  return uuidv4()
}

/**
 * 生成属性
 *  参数prop可为空
 */
export function generateProperty(prop) {
  var retval = null
  if (prop) {
    let tempDisplayValue = null
    if (prop.displayValue) {
      // 注意显示值需要转换
      tempDisplayValue = prop.displayValue
    } else {
      if (prop.editValue) {
        tempDisplayValue = prop.editValue
      }
    }
    let tempOldEditValue = null
    if (prop.oldEditValue) {
      tempOldEditValue = prop.oldEditValue
    } else {
      if (prop.editValue) {
        tempOldEditValue = prop.editValue
      }
    }

    retval = {
      fieldName: prop.fieldName,
      editValue: prop.editValue ? prop.editValue : null,
      comparison: prop.comparison ? prop.comparison : 'exact',
      displayValue: tempDisplayValue,
      oldEditValue: tempOldEditValue,
      editable: prop.editable ? prop.editable : false,
      editing: prop.editing ? editing : false,
    }
  } else {
    retval = {
      fieldName: null,
      editValue: null,
      comparison: 'exact',
      displayValue: null,
      oldEditValue: null,
      editable: false,
      editing: false,
    }
  }
  return retval
}

export function generateProperty2(
  fieldName,
  editValue,
  comparison,
  displayValue,
  oldEditValue,
  editable,
  editing,
) {
  return generateProperty({
    fieldName,
    editValue,
    comparison,
    displayValue,
    oldEditValue,
    editable,
    editing,
  })
}
/**
 * 查找属性
 */

export function findProperty(props, fieldName) {
  if (!props) {
    return false
  } else {
    return props.find(element => {
      return element.fieldName === fieldName
    })
  }
}

/**
 * 赋值属性
 * 参数：将prop对象写入到props中的第index元素中
 */
export function setProperty(props, index, prop) {
  if (!props || !props[index]) {
    return
  }

  Object.keys(props[index]).forEach(element => {
    var temp = Object.keys(props[index]).find(ele2 => {
      return element === ele2
    })
    if (temp) {
      props[index][element] = prop[element]
    }
  })
}

/**
 * 增加属性
 * 参数：将props中追加一个prop属性
 */
export function addProperty(props, prop) {
  if (!props || !prop) {
    return
  }
  props.push(generateProperty(prop))
}

/**
 * 生成属性序列
 * props为属性对象序列，如[{fieldName:'code'},{fieldName:'name'},]
 */
export function generateProperties(props) {
  if (!props) {
    return null
  }

  var retval = []
  props.forEach(element => {
    retval.push(generateProperty(element))
  })
  return retval
}

/**
 * 生成资源
 * props为资源属性对象序列，如[{fieldName:'code'},{fieldName:'name'},]
 * uri为空，则自动分配一个
 */
export function generateResource(props, uri) {
  var retval = {
    uri: uri ? uri : uuid(),
    props: props ? generateProperties(props) : [],
    selected: false,
    difference: null,
    parentUri: null,
    childrenObj: [],
    disabled: false,
  }
  return retval
}

/**
 * 赋值资源属性
 * 参数：将prop对象写入到props中的第index元素中
 */
export function setResourceProperty(rd, index, prop) {
  if (!rd || !rd.props || !prop) {
    return
  }
  setProperty(rd.props, index, prop)
}

/**
 * 赋值资源属性
 * 参数：将targetProps对象写入到rd资源属性中,要求rd资源属性与targetProps，顺序相同
 */
export function setResourceProperties(rd, targetProps) {
  if (!rd || !rd.props || !targetProps) {
    return
  }

  targetProps.forEach((element, index) => {
    setResourceProperty(rd, index, element)
  })
}

/**
 * 设置资源selected状态
 * srcRds为源资源列表
 * selectedRds为已选择的资源列表
 */
export function setResourcesSelectedState(srcRds, selectedRds) {
  if (!srcRds) {
    return
  }

  // 非选定资源
  var notSelectedRds = _.differenceWith(srcRds, selectedRds, _.isEqual)
  if (notSelectedRds) {
    notSelectedRds.forEach(rd => {
      rd.selected = false
    })
  }
  // 选定资源
  if (selectedRds) {
    selectedRds.forEach(rd => {
      rd.selected = true
    })
  }
}

/**
 * 设置资源editing状态
 * rd为资源
 * editingFlag为正在编辑状态，true为正在编辑
 */
export function setResourceEditingState(rd, editingFlag) {
  if (!rd || !rd.props) {
    return
  }

  rd.props.forEach(prop => {
    if (prop.editable) {
      prop.editing = editingFlag
    }
  })
}

/**
 * 设置所有资源editing状态
 * rd为资源
 * editingFlag为正在编辑状态，true为正在编辑
 */
export function setResourcesEditingState(rds, editingFlag) {
  if (!rds) {
    return
  }
  rds.forEach(rd => {
    setResourceEditingState(rd, editingFlag)
  })
}

/**
 * 获得资源的差异状态
 */
export function getResourceDifferenceState(rd) {
  if (!rd) {
    return null
  }
  if (rd.difference === 'row_added') {
    return 'ROW_ADDED'
  } else if (rd.difference === 'row_removed') {
    return 'ROW_REMOVED'
  } else if (rd.difference === 'row_modified') {
    return 'ROW_MODIFIED'
  } else {
    return null
  }
}

/**
 * 是否存在被选择的资源
 */
export function hasResourcesSelected(rds) {
  if (!rds) {
    return false
  }

  return rds.find(rd => {
    return rd.selected === true
  })
}

/**
 * 追加一个资源
 */
export function appendResource(rds, rd) {
  if (!rds || !rd) {
    return
  }
  rd.difference = 'row_added'
  rds.push(rd)
}

/**
 * 增加一个资源
 */
export function addResource(rd) {
  if (!rd) {
    return
  }
  rd.difference = 'row_added'
}

/**
 * 删除多个资源
 */
export function removeResources(rds) {
  if (!rds) {
    return
  }
  var indexes = [] // 已经插入未保存的资源索引
  rds.forEach((rd, index) => {
    if (rd.selected) {
      if (rd.difference === 'row_added') {
        indexes.push(index)
      }
      rd.difference = 'row_removed'
    }
  })

  indexes.forEach(element => {
    rds.splice(element, 1)
  })
}

/**
 * 修改一个资源
 */
export function modifyResource(rd, index, prop) {
  if (!rd) {
    return
  }
  setResourceProperty(rd, index, prop)
  if (rd.difference !== 'row_added' && rd.difference !== 'row_removed') {
    rd.difference = 'row_modified'
  }
}

/**
 * 获取资源描述差异模型
 */
export function getDifferenceModel(rds) {
  if (!rds) {
    return null
  }

  let diffModel = {
    inserted: [],
    updated: [],
    removed: [],
  }
  rds.forEach(rd => {
    if (rd.difference === 'row_added') {
      let tempRd = {}
      rd.props.forEach(prop => {
        if (prop.fieldName !== 'pk') {
          tempRd[prop.fieldName] = prop.editValue
        }
      })
      // 如果有父节点的话，增加父的外键
      if (rd.parentUri) {
        tempRd[rd.parentUri.fieldName] = rd.parentUri.editValue
      }

      diffModel.inserted.push(tempRd)
    } else if (rd.difference === 'row_modified') {
      let tempRd = {}
      rd.props.forEach(prop => {
        if (prop.fieldName !== 'pk' && prop.editValue !== prop.oldEditValue) {
          tempRd[prop.fieldName] = prop.editValue
        }
      })
      if (Object.keys(tempRd).length !== 0) {
        tempRd['pk'] = rd.uri
        diffModel.updated.push(tempRd)
      }
    } else if (rd.difference === 'row_removed') {
      diffModel.removed.push(rd.uri)
    }
  })

  if (
    diffModel.inserted.length === 0 &&
    diffModel.updated.length === 0 &&
    diffModel.removed.length === 0
  ) {
    diffModel = null
  }
  return diffModel
}

/**
 * 更新资源
 * @param {Array} rds 资源列表
 * @param {Array} addedRecords 被插入行列表,格式[{pk:xxx,xxx:xxx}]
 */
export function saveResources(rds, addedRecords) {
  var insertedIndex = 0
  var removingIndexList = []
  rds.forEach((rd, index) => {
    // 插入
    if (rd.difference === 'row_added') {
      rd.uri = addedRecords[insertedIndex].pk
      ++insertedIndex
      rd.difference = null
    }
    // 更新
    else if (rd.difference === 'row_modified') {
      rd.props.forEach(prop => {
        prop.oldEditValue = prop.editValue
      })
      rd.difference = null
    } else if (rd.difference === 'row_removed') {
      removingIndexList.push(index)
    }
  })
  // 删除资源
  for (var i = removingIndexList.length - 1; i >= 0; i--) {
    rds.splice(removingIndexList[i], 1)
  }
}

/**
 * 还原资源
 * @param {Array} rds 资源列表
 */
export function refreshResources(rds, props) {
  var addedIndexList = []
  rds.forEach((rd, index) => {
    // 插入
    if (rd.difference === 'row_added') {
      addedIndexList.push(index)
    }
    // 更新
    else if (
      rd.difference === 'row_modified' ||
      rd.difference === 'row_removed'
    ) {
      rd.props.forEach(prop => {
        prop.editValue = prop.oldEditValue
        props.displayValue = prop.oldEditValue
        // 注意显示值需要转换
      })
      rd.difference = null
    }
  })
  // 删除已添加的资源
  addedIndexList.forEach(element => {
    rds.splice(element, 1)
  })
}

/**
 * 将api返回json数据转换成资源
 * props:要转换的资源属性，格式如[{fieldName:'xxx'},{fieldName:'xxx'}]
 * records:为转换前的数据，格式如[{code:'xxx',name:'xxx'},{code:'xxx',name:'xxx'}]
 * parentFieldName:父属性
 */
export function setResources(records, props, parentFieldName) {
  if (!records) return
  let res = []
  records.forEach(element => {
    res.push(setResource(element, props, parentFieldName))
  })
  return res
}

/**
 * 将api返回json数据转换成资源如[{code:'xxx',name:'xxx'}]
 * props:要转换的资源属性，格式如[{fieldName:'xxx'},{fieldName:'xxx'}]
 * record:为转换前的数据，格式如[{code:'xxx',name:'xxx'},{code:'xxx',name:'xxx'}]
 * parentFieldName:父属性
 */
export function setResource(record, props, parentFieldName) {
  var tempProps = []

  var parentUri = null
  props.forEach(prop => {
    // 查找record列是否存在
    let fieldName = Object.keys(record).find(element => {
      return element === prop.fieldName
    })
    // 如果存在则设置属性的值
    if (fieldName) {
      tempProps.push(
        generateProperty2(
          fieldName,
          record[fieldName],
          prop.comparison,
          prop.displayValue,
          prop.oldEditValue,
          prop.editable,
          prop.editing,
        ),
      )
      if (parentFieldName === fieldName) {
        parentUri = {
          fieldName: parentFieldName,
          editValue: record[fieldName],
        }
      }
    } else {
      tempProps.push(generateProperty(prop))
    }
  })

  let retval = generateResource(tempProps, record.pk)
  setResourceParent(retval, parentUri)
  return retval
}

/**
 *
 */
export function setResourceParent(rd, parentUri) {
  rd.parentUri = parentUri
}

/**
 * 生成树资源
 *
 */
export function generateTreeResources(nodeData, isExistRoot, treeRoot) {
  if (!nodeData) {
    return
  }
  var tempNodeData = _.cloneDeep(nodeData)
  // 先得到一级子节点
  var firstLevelNodes = []
  for (var i = tempNodeData.length - 1; i >= 0; i--) {
    if (!tempNodeData[i].parentUri) {
      firstLevelNodes.push(tempNodeData[i])
      tempNodeData.splice(i, 1)
    }
  }

  // 深度遍历
  setChildren(firstLevelNodes, tempNodeData)

  //
  var retval = []
  if (!isExistRoot) {
    retval = firstLevelNodes
  } else {
    treeRoot.childrenObj = firstLevelNodes
    retval.push(treeRoot)
  }
  return retval
}

/**
 * 查找树节点的孩子
 */
function setChildren(nodes, nodeData) {
  nodes.forEach(node => {
    var childrenObj = []
    for (var i = nodeData.length - 1; i >= 0; i--) {
      if (nodeData[i].parentUri.editValue === node.uri) {
        childrenObj.push(nodeData[i])
        nodeData.splice(i, 1)
      }
    }
    node.childrenObj = childrenObj
    if (node.childrenObj.length != 0) {
      setChildren(node.childrenObj, nodeData)
    }
  })
}
