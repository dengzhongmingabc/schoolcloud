import request from '@/utils/request'

const api = {
  //招生中心
  marketStudentPageList: '/marketStudent/pageList',
  marketStudentSave: '/marketStudent/save',
  marketStudentEdit: '/marketStudent/edit',
  marketStudentDelete: '/marketStudent/delete',
  marketStudentQuery: '/marketStudent/query',
  marketStudentList: '/marketStudent/list',
}

export default api

//--------------------------------------------------------课程



export function marketStudentPageList (parameter) {
  return request({
    url: api.marketStudentPageList,
    method: 'post',
    params: parameter
  })
}


export function marketStudentSave (parameter) {
  return request({
    url: api.marketStudentSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function marketStudentEdit (parameter) {
  return request({
    url: api.marketStudentEdit,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}



export function marketStudentDelete (parameter) {
  return request({
    url: api.marketStudentDelete,
    method: 'post',
    params: parameter
  })
}

export function marketStudentQuery (parameter) {
  return request({
    url: api.marketStudentQuery,
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export function marketStudentList (parameter) {
  return request({
    url: api.marketStudentList,
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}