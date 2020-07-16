import request from '@/utils/request'

const api = {
  //课程
  coursePageList: '/teachCourse/pageList',
  courseSave: '/teachCourse/save',
  courseEdit: '/teachCourse/edit',
  courseDelete: '/teachCourse/delete',
  courseQuery: '/teachCourse/query',

  courseTypePageList: '/teachCourseType/pageList',
  courseTypeSave: '/teachCourseType/save',
  courseTypeEdit: '/teachCourseType/edit',
  courseTypeDelete: '/teachCourseType/delete',
  courseTypeQuery: '/teachCourseType/query',
  courseTypeList: '/teachCourseType/list',
}

export default api

//--------------------------------------------------------课程
export function coursePageList (parameter) {
  return request({
    url: api.coursePageList,
    method: 'post',
    params: parameter
  })
}

export function courseSave (parameter) {
  return request({
    url: api.courseSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function courseEdit (parameter) {
  return request({
    url: api.courseEdit,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function courseDelete (parameter) {
  return request({
    url: api.courseDelete,
    method: 'post',
    params: parameter
  })
}

export function courseQuery (parameter) {
  return request({
    url: api.courseQuery,
    method: 'post',
    params: parameter
  })
}


export function courseTypePageList (parameter) {
  return request({
    url: api.courseTypePageList,
    method: 'post',
    params: parameter
  })
}


export function courseTypeSave (parameter) {
  return request({
    url: api.courseTypeSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function courseTypeEdit (parameter) {
  return request({
    url: api.courseTypeEdit,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}



export function courseTypeDelete (parameter) {
  return request({
    url: api.courseTypeDelete,
    method: 'post',
    params: parameter
  })
}

export function courseTypeQuery (parameter) {
  return request({
    url: api.courseTypeQuery,
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export function courseTypeList (parameter) {
  return request({
    url: api.courseTypeList,
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}