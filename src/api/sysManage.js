import request from '@/utils/request'

const api = {
  pessions: '/sys/user/listByPage3',
  savePessions: '/sys/user/saveSysPermission',
  deletePession: '/sys/user/deleteSysPermission',
  editPession: '/sys/user/editSysPermission'
}

export default api

export function getPessionList (parameter) {
  return request({
    url: api.pessions,
    method: 'post',
    params: parameter
  })
}

export function savePession (parameter) {
  return request({
    url: api.savePessions,
    method: 'post',
    params: parameter
  })
}

export function deletePession (parameter) {
  return request({
    url: api.deletePession,
    method: 'post',
    params: parameter
  })
}

export function editPession (parameter) {
  return request({
    url: api.editPession,
    method: 'post',
    params: parameter
  })
}