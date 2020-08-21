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

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
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

      <span slot="teacher" slot-scope="cellData">
          {{cellData.realName}}
      </span>
      <span slot="teachCourse" slot-scope="cellData">
          {{cellData.name}}
      </span>
      <span slot="school" slot-scope="cellData">
          {{cellData.name}}
      </span>
      <span slot="personCountCurrent" slot-scope="cellData,record">
          {{`${cellData}/${record.personCount}`}}
      </span>
      <span slot="status" slot-scope="cellData">
          {{cellData==1?'开放':'关闭'}}
      </span>
      <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm
                    title="您确定要删除吗?"
                    @confirm="() => classesDeleteF(record)"
                  >
                  <a  href="javascript:;" ref="classesDelete">删除</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item>
                    <a  @click="studentHandleAdd(record)">加入学员</a>
                </a-menu-item>
              </a-menu>
          </a-dropdown>

          </template>
        </span>
    </s-table>


    <CreateClassForm
      ref="createClassForm"
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
  import {classesSave, classesDelete, classesPageList, classesQuery,studentAddToClass, classesEdit} from '@/api/teach'

  import CreateClassForm from "./components/CreateClassForm";
  import SelectStudent from "./components/SelectStudent";

  import {courseList} from '@/api/teach'
  import {userList} from '@/api/sysManage'




  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '满班人数',
      dataIndex: 'personCount',
    },
    {
      title: '成班人数',
      dataIndex: 'classPersonCount',
    },
    {
      title: '现在学员',
      dataIndex: 'personCountCurrent',
      scopedSlots: {customRender: 'personCountCurrent'}
    },
    {
      title: '老师名称',
      dataIndex: 'teacher',
      scopedSlots: {customRender: 'teacher'}
    },
    {
      title: '课程名称',
      dataIndex: 'teachCourse',
      scopedSlots: {customRender: 'teachCourse'}
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      scopedSlots: {customRender: 'startDate'}
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      scopedSlots: {customRender: 'endDate'}
    },
    {
      title: '所属学校',
      dataIndex: 'school',
      scopedSlots: {customRender: 'school'}
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '招生状态',
      dataIndex: 'status',
      scopedSlots: {customRender: 'status'}
    },
    {
      title: '更新时间',
      dataIndex: 'createdDate',
      ellipsis: true,
      sorter: true
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
      CreateClassForm,
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
            search += ' and name like \'%' + requestParameters['name'] + '%\''
          }
          if (requestParameters['forbidden']) {
            search += ' and forbidden=' + requestParameters['forbidden']
          }
          requestParameters.search = search;
          return classesPageList(requestParameters).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        currentClassId:0,
        currentCourseId:0
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
        this.currentClassId = record.id
        this.currentCourseId = record.teachCourse.id
        this.$refs.selectStudent.getMock(record.teachCourse.id)
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
        let studentkeys = data.map((item)=>{
          return  item.key
        })
        let studentIds = studentkeys.join(",")
        value.studentIds = studentIds;
        studentAddToClass(value).then((res)=>{
          this.$refs.table.refresh(true)
          this.studentVisible = false
        })

      },
      handleAdd(record) {
        Promise.all([courseList(), userList()]).then((result) => {
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
        this.mdl = {...record}
        Promise.all([courseList(), userList()]).then((result) => {
          console.log(result);
          this.mdl.courses = result[0].result;
          this.mdl.users = result[1].result
          this.visible = true
        }).catch((error) => {
          console.log(error)
        })
      },
      handleOk() {
        const form = this.$refs.createClassForm.form
        const endDate = this.$refs.createClassForm.endDate
        const startDate = this.$refs.createClassForm.startDate
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            values.endDate = endDate;
            values.startDate = startDate;
            console.log('values', values)
            const param = JSON.stringify(values);

            if (values.id > 0) {
              // 修改 e.g.
              classesEdit(param).then((response) => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('修改成功')
              })
            } else {
              // 新增
              classesSave(param).then((response) => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('新增成功')
              })
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel() {
        this.visible = false
        const form = this.$refs.createClassForm.form
        form.resetFields() // 清理表单数据（可不做）
      },

      classesDeleteF(record) {
        let self = this;
        let params = {}
        params.id=record.id
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
