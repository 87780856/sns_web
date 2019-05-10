import fetch2 from '@/utils/fetch2'

var model_url_mapping = {
  SysParamType: 'common/system',
  SysParamValue: 'common/system',
  AppInstance: 'common/system',
  BizParamType: 'common/system',
  BizParamValue: 'common/system',
  Account: 'common/permission',
  Role: 'common/permission',
  ControlObject: 'common/permission',
  ControlPolicy: 'common/permission',
}

// __exact        精确等于 like 'aaa'
//  __iexact    精确等于 忽略大小写 ilike 'aaa'
//  __contains    包含 like '%aaa%'
//  __icontains    包含 忽略大小写 ilike '%aaa%'，但是对于sqlite来说，contains的作用效果等同于icontains。
// __gt    大于
// __gte    大于等于
// __lt    小于
// __lte    小于等于
// __in     存在于一个list范围内
// __startswith   以...开头
// __istartswith   以...开头 忽略大小写
// __endswith     以...结尾
// __iendswith    以...结尾，忽略大小写
// __range    在...范围内
// __year       日期字段的年份
// __month    日期字段的月份
// __day        日期字段的日
// __isnull=True/False
// columns: ["region_code", "region_name", ],
// filters: [{
//   column: "region_name",
//   value: "烟",
//   comparison: "contains",exact
// }, ]
//cursor:""//"cD0xMQ=="
//http://127.0.0.1:8000/test/bizinfo/?0=%7B%22table%22%3A%22Region%22%7D&cursor=cD0xMQ%3D%3D

export function listData(typeName, props, filters, pageSize, pageOffset) {
  // 属性
  var columns = []
  props.forEach(prop => {
    if (prop.fieldName) {
      columns.push(prop.fieldName)
    }
  })
  // 查询条件
  var conditions = []
  if (filters) {
    filters.forEach(prop => {
      if (prop.editValue && prop.editValue !== '') {
        conditions.push({
          prop: prop.fieldName,
          value: prop.editValue,
          comparison: prop.comparison ? prop.comparison : 'exact',
        })
      }
    })
  }
  // 分页
  var limit = 0
  if (pageSize) {
    limit = pageSize
  }
  var offset = 0
  if (!pageOffset) {
    offset = pageOffset
  }

  return fetch2({
    baseURL: 'http://127.0.0.1:8000',
    url: 'common/gda_list', //model_url_mapping[typeName],
    method: 'get',
    params: {
      type: typeName,
      props: JSON.stringify(columns),
      filters: JSON.stringify(conditions),
      limit,
      offset,
    },
  })
}

export function saveData(typeName, diffModel) {
  return fetch2({
    baseURL: 'http://127.0.0.1:8000',
    url: model_url_mapping[typeName] + '/saveData/',
    method: 'post',
    data: {
      type: typeName,
      inserted: JSON.stringify(diffModel.inserted),
      updated: JSON.stringify(diffModel.updated),
      removed: JSON.stringify(diffModel.removed),
    },
  })
}

export function multilistData(multilist) {
  return fetch2({
    baseURL: 'http://127.0.0.1:8000',
    url: 'common/gda/multilist/',
    method: 'get',
    params: multilist,
  })
}

// 获取一条数据
export function retrieveData(typeName, id, props) {
  // 属性
  var columns = []
  props.forEach(prop => {
    if (prop.fieldName) {
      columns.push(prop.fieldName)
    }
  })
  return fetch2({
    baseURL: 'http://127.0.0.1:8000',
    url: model_url_mapping[typeName] + '/' + id + '/',
    method: 'get',
    params: {
      type: typeName,
      props: JSON.stringify(columns),
    },
  })
}

// export function getPageSize() {
//   return fetch2({
//     baseURL: 'http://127.0.0.1:8000',
//     url: '/common/upm/',
//     method: 'get',
//     params: {
//       type: typeName,
//       props: JSON.stringify(columns),
//       filters: JSON.stringify(filters)
//     }
//   })
// }

// // 增加一条记录
// export function createData(uri, rd) {
//   var index = uri.lastIndexOf('/')
//   var typeName = uri.substring(index + 1, uri.length)
//   var tableUri = uri.substring(0, index)

//   return fetch2({
//     baseURL: 'http://127.0.0.1:8000',
//     url: tableUri + '/',
//     method: 'post',
//     //withCredentials: true,
//     data: {
//       type: typeName,
//       insert: rd,
//     },
//   })
// }

// // export function createAndFetchData(typeName, rd, columns, filters, pageSize, offset) {
// //   return axios.all([createData(typeName, rd), listData(typeName, columns, filters, pageSize, offset)])
// // }

// // 局部更新一条数据
// export function partialUpdateData(uri, id, rd) {
//   var index = uri.lastIndexOf('/')
//   var typeName = uri.substring(index + 1, uri.length)
//   var tableUri = uri.substring(0, index)

//   return fetch2({
//     baseURL: 'http://127.0.0.1:8000',
//     url: tableUri + '/' + id + '/',
//     method: 'patch',
//     data: {
//       type: typeName,
//       update: rd,
//     },
//   })
// }

// // 删除一条数据
// export function removeData(uri, id) {
//   var index = uri.lastIndexOf('/')
//   var typeName = uri.substring(index + 1, uri.length)
//   var tableUri = uri.substring(0, index)

//   return fetch2({
//     baseURL: 'http://127.0.0.1:8000',
//     url: tableUri + '/' + id + '/',
//     method: 'delete',
//     data: {
//       type: typeName,
//     },
//   })
// }
