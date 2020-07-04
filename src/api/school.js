import request from '@/utils/request'

const api = {
  schoolList: '/school/schoolList',
  schoolAdd: '/school/schoolAdd',
  schoolDelete: '/school/schoolDelete',
  schoolIdSetting: '/school/schoolIDSetting',
  schoolQuery: '/school/schoolQuery',
}

export default api

export function schoolList (parameter) {
  return request({
    url: api.schoolList,
    method: 'post',
    params: parameter
  })
}

export function schoolAdd (parameter) {
  return request({
    url: api.schoolAdd,
    method: 'post',
    params: parameter
  })
}

export function schoolDelete (parameter) {
  return request({
    url: api.schoolDelete,
    method: 'post',
    params: parameter
  })
}

export function schoolIdSetting (parameter) {
  return request({
    url: api.schoolIdSetting,
    method: 'post',
    params: parameter
  })
}
export function schoolQuery (parameter) {
  return request({
    url: api.schoolQuery,
    method: 'post',
    params: parameter
  })
}