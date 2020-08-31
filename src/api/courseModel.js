import request from '@/utils/request'

const api = {
  //一对一
  courseModelPageList: '/courseModel/pageList',
  courseModelPageListJPQL: '/courseModel/pageListByJPQL',
  courseModelSave: '/courseModel/save',
  courseModelEdit: '/courseModel/edit',
  courseModelDelete: '/courseModel/delete',
  courseModelQuery: '/courseModel/query',
  courseModelList: '/courseModel/list',
  courseModelListByJPQL: '/courseModel/listByJPQL',


}

export default api
//一对一
export function courseModelPageList (parameter) {
  return request({
    url: api.courseModelPageList,
    method: 'post',
    params: parameter
  })
}
export function courseModelPageListJPQL (parameter) {
  return request({
    url: api.courseModelPageListJPQL,
    method: 'post',
    params: parameter
  })
}
export function courseModelListByJPQL (parameter) {
  return request({
    url: api.courseModelListByJPQL,
    method: 'post',
    params: parameter
  })
}
export function courseModelList (parameter) {
  return request({
    url: api.courseModelList,
    method: 'post',
    params: parameter
  })
}
export function courseModelSave (parameter) {
  return request({
    url: api.courseModelSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function courseModelEdit (parameter) {
  return request({
    url: api.courseModelEdit,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function courseModelDelete (parameter) {
  return request({
    url: api.courseModelDelete,
    method: 'post',
    params: parameter
  })
}

export function courseModelQuery (parameter) {
  return request({
    url: api.courseModelQuery,
    method: 'post',
    params: parameter
  })
}