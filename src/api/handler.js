import request from '@/utils/request'

const api = {
  //课程
  handlerPageList: '/handler/pageList',
  handlerPageListByJPQL: '/handler/pageListByJPQL',
  handlerSave: '/handler/save',
  handlerEdit: '/handler/edit',
  handlerDelete: '/handler/delete',
  handlerQuery: '/handler/query',
  handlerList: '/handler/list',
}

export default api

//--------------------------------------------------------办理中心

export function handlerPageList (parameter) {
  return request({
    url: api.handlerPageList,
    method: 'post',
    params: parameter
  })
}

export function handlerPageListByJPQL (parameter) {
  return request({
    url: api.handlerPageListByJPQL,
    method: 'post',
    params: parameter
  })
}

export function handlerSave (parameter) {
  return request({
    url: api.handlerSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function handlerEdit (parameter) {
  return request({
    url: api.handlerEdit,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}



export function handlerDelete (parameter) {
  return request({
    url: api.handlerDelete,
    method: 'post',
    params: parameter
  })
}

export function handlerQuery (parameter) {
  return request({
    url: api.handlerQuery,
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export function handlerList (parameter) {
  return request({
    url: api.handlerList,
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}