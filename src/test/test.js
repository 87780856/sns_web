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
function CAttribute(attrObj) {
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

let attr = new CAttribute()

console.log(attr)
