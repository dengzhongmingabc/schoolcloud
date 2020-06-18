import request from '@/utils/request'

const api = {
  pessions: '/sys/user/listByPage3',
  savePessions: '/sys/user/saveSysPermission',
  deletePession: '/sys/user/deleteSysPermission',
  editPession: '/sys/user/editSysPermission',

  rolePageList: '/sys/user/rolePageList',
  saveRole: '/sys/user/saveRole',
  roleListPermission: '/sys/user/roleListPermission',
  settingRolePermission: '/sys/user/settingRolePermission'
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

export function getRolePageList (parameter) {
  return request({
    url: api.rolePageList,
    method: 'post',
    params: parameter
  })
}

export function saveRole (parameter) {
  return request({
    url: api.saveRole,
    method: 'post',
    params: parameter
  })
}

export function roleListPermission (parameter) {
  return request({
    url: api.roleListPermission,
    method: 'post',
    params: parameter
  })
}
export function settingRolePermission (parameter) {
  return request({
    url: api.settingRolePermission,
    method: 'post',
    params: parameter
  })
}