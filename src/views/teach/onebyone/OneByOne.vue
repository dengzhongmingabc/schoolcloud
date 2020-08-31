<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col a-col :xxl="4" :xl="6" :md="12" :sm="24" style="padding-right: 0px">
              <a-form-item label="名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xl="8" :md="12" :sm="24" style="padding-right: 0px">
              <a-form-item label="状态">
                <a-radio-group default-value="" @change="$refs.table.refresh(true)" v-model="queryParam.forbidden"
                               button-style="solid">
                  <a-radio-button value="">
                    全部
                  </a-radio-button>
                  <a-radio-button value="false">
                    有效
                  </a-radio-button>
                  <a-radio-button value="true">
                    无效
                  </a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>


      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >

      <span slot="seekPerson" slot-scope="cellData">
          {{seekPersonMap[cellData].text}}
      </span>

        <span slot="courseModel" slot-scope="cellData">
          <a-tag v-if="cellData!=undefined" :color="'green'" >
             是
          </a-tag>
          <a-tag v-if="cellData==undefined" :color="'red'" >
             否
          </a-tag>
      </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <!--<a @click="handleEdit(record)">排课</a>
            <a-divider type="vertical"/>-->
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm
                    title="您确定要删除吗?"
                    @confirm="() => classesDeleteF(record)"
                  >
                  <a href="javascript:;" ref="classesDelete">删除</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item>
                    <a @click="studentHandleAdd(record)">分配任课老师</a>
                </a-menu-item>
                <a-menu-item>
                    <a @click="handleEdit(record)">排课</a>
                </a-menu-item>
                <a-menu-item>
                    <a @click="">上课记录</a>
                </a-menu-item>
                <a-menu-item>
                    <a @click="">课程表</a>
                </a-menu-item>
              </a-menu>
          </a-dropdown>

          </template>
        </span>
      </s-table>


      <CourseModel
        ref="courseModel"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :roles="roleListData"
        @cancel="handleCancel"
        @ok="handleOk"
      />

      <SelectStudent
        ref="selectStudent"
        :visible="studentVisible"
        :loading="studentConfirmLoading"
        :model="studentMdl"
        @cancel="studentHandleAddCancel"
        @ok="studentAdd"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import {STable, Ellipsis} from '@/components'
  import {
    classesDelete,
    oneByOnePageListJPQL,
    oneByOneListByJPQL,
    studentAddToClass,
  } from '@/api/teach'

  import CourseModel from "./components/CourseModel";
  import SelectStudent from "./components/SelectStudent";

  import {courseList} from '@/api/teach'
  import {userList} from '@/api/sysManage'
  import {courseModelSave} from '@/api/courseModel'


  const columns = [
    {
      title: '学生名称',
      dataIndex: 'marketStudent.studentName',
    },
    {
      title: '关系',
      dataIndex: 'marketStudent.seekPerson',
      scopedSlots: {customRender: 'seekPerson'}
    },
    {
      title: '电话',
      dataIndex: 'marketStudent.mobile',
    },
    {
      title: '课程',
      dataIndex: 'course.name',
    },
    {
      title: '任课老师',
      dataIndex: 'teacher.realName',
    },

    {
      title: '所属学校',
      dataIndex: 'school.name',
    },
    {
      title: '报名时间',
      dataIndex: 'createdDate',
      scopedSlots: {customRender: 'endDate'}
    },
   /* {
      title: '开始时间',
      dataIndex: 'startDate',
    },*/

    {
      title: '所剩课程数',
      dataIndex: 'courseCount',
    },

    {
      title: '是否已排课',
      dataIndex: 'courseModel',
      scopedSlots: {customRender: 'courseModel'}
    },

    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: {customRender: 'action'}
    }
  ]


  export default {
    name: 'TableList',
    components: {
      STable,
      Ellipsis,
      CourseModel,
      SelectStudent
    },
    data() {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: {roles: []},

        studentVisible: false,
        studentConfirmLoading: false,
        studentMdl: {roles: []},

        roleListData: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters:', requestParameters)
          console.log(requestParameters['name']);
          let search = '';
          if (requestParameters['name']) {
            search += ' and obj.marketStudent.studentName like \'%' + requestParameters['name'] + '%\''
          }
          if (requestParameters['forbidden']) {
            search += ' and obj.marketStudent.forbidden=' + requestParameters['forbidden']
          }
          requestParameters.search = search;
          return oneByOnePageListJPQL(requestParameters).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        currentClassId: 0,
        seekPersonMap: {1: {text: '母亲'}, 2: {text: '父亲'}, 3: {text: '本人'}, 4: {text: '其它'}},
        currentCourseId: 0
      }
    },
    filters: {
      statusFilter(type) {
        return statusMap[type].text
      },
      statusTypeFilter(type) {
        return statusMap[type].status
      }
    },
    created() {

    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      studentHandleAdd(record) {
        this.studentVisible = true
      },
      studentHandleAddCancel(record) {
        this.studentVisible = false
      },
      studentAdd(record) {
        let data = this.$refs.selectStudent.targetDatas
        let value = {};
        value.classId = this.currentClassId
        value.courseId = this.currentCourseId
        let studentkeys = data.map((item) => {
          return item.key
        })
        let studentIds = studentkeys.join(",")
        value.studentIds = studentIds;
        studentAddToClass(value).then((res) => {
          this.$refs.table.refresh(true)
          this.studentVisible = false
        })

      },
      handleAdd(record) {
        const requestParameters = {}
        let search = ' and teach_type=2 ';
        requestParameters.search = search;
        Promise.all([courseList(requestParameters), userList()]).then((result) => {
          console.log(result);
          this.mdl = {}
          this.mdl.courses = result[0].result;
          this.mdl.users = result[1].result
          this.visible = true
        }).catch((error) => {
          console.log(error)
        })
      },
      handleEdit(record) {
        const requestParameters = {}
        this.mdl = {...record}
        Promise.all([oneByOneListByJPQL(requestParameters), userList()]).then((result) => {
          console.log(result);
          this.mdl.teacher = record.teacherId == 0 ? 0 : {key:record.teacher.id, label:record.teacher.realName}
          this.mdl.classOrOneByOne = {key: record.id, label: record.course.name}
          this.mdl.oneByOnes = result[0].result;
          this.mdl.users = result[1].result
          console.log(this.mdl)
          this.visible = true
        }).catch((error) => {
          console.log(error)
        })
      },
      handleOk() {
        const form = this.$refs.courseModel.form
        this.confirmLoading = true
        let dates = this.$refs.courseModel.dates
        let events = [];
        form.validateFields((errors, values) => {
          if (!errors) {
            if(values.courseModel=='2'&&(!values.weekModel||values.weekModel.length<1)){
              this.$message.error('请选择上课星期！');
              this.confirmLoading = false
              return;
            }
            if(values.courseModel=='2'&&!values.startDate){
              this.$message.error('请选择开始时间！');
              this.confirmLoading = false
              return;
            }
            if(values.courseModel=='2'&&!values.repeatModel){
              this.$message.error('请选择循环周末！');
              this.confirmLoading = false
              return;
            }
            if(values.courseModel=='1'&&dates.length<1){
              this.$message.error('请选择日期！');
              this.confirmLoading = false
              return;
            }
            values.startDate = moment(values.startDate).format('YYYY-MM-DD')
            if (values.courseModel == 2) {
              let i = 0
              dates = []
              while (dates.length < 11) {
                let date = moment(values.startDate).add(i, 'days')
                var weekday = date.weekday();
                if (values.weekModel.includes(weekday + '')) {
                  dates.push(moment(date).format('YYYY-MM-DD'))
                }
                if(values.repeatModel=='2'&&weekday == 6){
                  i+=8
                }else {
                  i++;
                }
              }
              console.log(dates);
            }
            for (let date of dates) {
              console.log(values);
              console.log(date);
              let event = {}
              event.title = `${values.classOrOneByOne.label}`
              event.start = moment(date).format('YYYY-MM-DD') + ' ' + moment(values.startTime).format('HH:mm:ss')
              event.end = moment(date).format('YYYY-MM-DD') + ' ' + moment(values.endTime).format('HH:mm:ss')
              events.push(event)
            }
            values.events = events
            values.startTime = moment(values.startTime).format('HH:mm:ss')
            values.endTime = moment(values.endTime).format('HH:mm:ss')
            const param = JSON.stringify(values);
            courseModelSave(param).then((response) => {
              this.visible = false
              this.confirmLoading = false
              form.resetFields()
              this.$refs.table.refresh()
            })
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel() {
        this.visible = false
        const form = this.$refs.courseModel.form
        form.resetFields() // 清理表单数据（可不做）
      },

      classesDeleteF(record) {
        let self = this;
        let params = {}
        params.id = record.id
        classesDelete(params).then((response) => {
          self.$message.info(`${record.name} 删除成功`)
          self.$refs.table.refresh()
        })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      resetSearchForm() {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
