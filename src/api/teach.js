import request from '@/utils/request'

const api = {
  //一对一
  oneByOnePageList: '/teachOneByOne/pageList',
  oneByOnePageListJPQL: '/teachOneByOne/pageListByJPQL',
  oneByOneSave: '/teachOneByOne/save',
  oneByOneEdit: '/teachOneByOne/edit',
  oneByOneDelete: '/teachOneByOne/delete',
  oneByOneQuery: '/teachOneByOne/query',
  oneByOneList: '/teachOneByOne/list',
  oneByOneListByJPQL: '/teachOneByOne/listByJPQL',
//班级
  classesPageList: '/teachClasses/pageList',
  classesSave: '/teachClasses/save',
  classesEdit: '/teachClasses/edit',
  classesDelete: '/teachClasses/delete',
  classesQuery: '/teachClasses/query',
  classesList: '/teachClasses/list',

  //课程
  coursePageList: '/teachCourse/pageList',
  courseSave: '/teachCourse/save',
  courseEdit: '/teachCourse/edit',
  courseDelete: '/teachCourse/delete',
  courseQuery: '/teachCourse/query',
  courseList: '/teachCourse/list',
  noClassSelectStudentList: '/teachClasses/noClassSelectStudentList',
  studentAddToClass: '/teachClasses/studentAddToClass',

//课程类型
  courseTypePageList: '/teachCourseType/pageList',
  courseTypeSave: '/teachCourseType/save',
  courseTypeEdit: '/teachCourseType/edit',
  courseTypeDelete: '/teachCourseType/delete',
  courseTypeQuery: '/teachCourseType/query',
  courseTypeList: '/teachCourseType/list',




}

export default api
//一对一
export function oneByOnePageList (parameter) {
  return request({
    url: api.oneByOnePageList,
    method: 'post',
    params: parameter
  })
}
export function oneByOnePageListJPQL (parameter) {
  return request({
    url: api.oneByOnePageListJPQL,
    method: 'post',
    params: parameter
  })
}
export function oneByOneListByJPQL (parameter) {
  return request({
    url: api.oneByOneListByJPQL,
    method: 'post',
    params: parameter
  })
}
export function oneByOneList (parameter) {
  return request({
    url: api.oneByOneList,
    method: 'post',
    params: parameter
  })
}
export function oneByOneSave (parameter) {
  return request({
    url: api.oneByOneSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function oneByOneEdit (parameter) {
  return request({
    url: api.oneByOneEdit,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function oneByOneDelete (parameter) {
  return request({
    url: api.oneByOneDelete,
    method: 'post',
    params: parameter
  })
}

export function oneByOneQuery (parameter) {
  return request({
    url: api.oneByOneQuery,
    method: 'post',
    params: parameter
  })
}
//班级
export function classesPageList (parameter) {
  return request({
    url: api.classesPageList,
    method: 'post',
    params: parameter
  })
}
export function classesList (parameter) {
  return request({
    url: api.classesList,
    method: 'post',
    params: parameter
  })
}
export function classesSave (parameter) {
  return request({
    url: api.classesSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function classesEdit (parameter) {
  return request({
    url: api.classesEdit,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function classesDelete (parameter) {
  return request({
    url: api.classesDelete,
    method: 'post',
    params: parameter
  })
}

export function classesQuery (parameter) {
  return request({
    url: api.classesQuery,
    method: 'post',
    params: parameter
  })
}
//--------------------------------------------------------课程
export function coursePageList (parameter) {
  return request({
    url: api.coursePageList,
    method: 'post',
    params: parameter
  })
}
export function courseList (parameter) {
  return request({
    url: api.courseList,
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

export function noClassSelectStudentList (parameter) {
  return request({
    url: api.noClassSelectStudentList,
    method: 'post',
    params: parameter
  })
}

export function studentAddToClass (parameter) {
  return request({
    url: api.studentAddToClass,
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