<template>
  <page-header-wrapper>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col a-col :xxl="4" :xl="6" :md="12" :sm="24" style="padding-right: 0px">
            <a-form-item label="名称">
              <a-input v-model="queryParam.studentName" placeholder=""/>
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
      <a-button type="primary" icon="plus" @click="handleAdd()">批量分配</a-button>
      <a-button type="primary" icon="plus" @click="handleAdd()">批量导入</a-button>
    </div>
    <s-table
      :scroll="{ x: 1300 }"
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowSelection="rowSelection"
      showPagination="auto"
    >

      <span slot="seekPerson" slot-scope="celldata">
          {{seekPersonMap[celldata].text}}
      </span>
      <span slot="studentSex" slot-scope="celldata">
          {{sexMap[celldata].text}}
      </span>
      <span slot="seekModel" slot-scope="celldata">
          {{seekModelMap[celldata].text}}
      </span>
      <span slot="seekDepth" slot-scope="celldata">
          <a-rate :value="celldata" disabled></a-rate>
      </span>
      <span slot="status" slot-scope="celldata">
          {{statusMap[celldata].text}}
      </span>

      <span slot="seekSchool" slot-scope="celldata">
          {{celldata.name}}
      </span>


      <span slot="talkMark" slot-scope="celldata">
        <ellipsis :length="4" tooltip>{{ celldata[0].content }}</ellipsis>
      </span>
      <span slot="createdDate" slot-scope="celldata">
        <ellipsis :length="10" tooltip>{{ celldata }}</ellipsis>
      </span>
      <span slot="seekCourse" slot-scope="celldata">
        <a-tag :color="'green'" v-for="(item,index) in celldata" :key="index">{{item.name}}</a-tag>
      </span>
      <span slot="forbidden" slot-scope="forbidden">
          {{forbidden?'无效':'有效'}}
      </span>

      <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">分配</a>
            <a-divider type="vertical"/>
            <a @click="marketStudentDelete(record)">领取</a>
            <a-divider type="vertical"/>
            <a @click="marketStudentDelete(record)">详情</a>
          </template>
        </span>
    </s-table>
  </a-card>
  </page-header-wrapper>
</template>


<script>
  import moment from 'moment'
  import {STable, Ellipsis} from '@/components'
  import {marketStudentSave, marketStudentDelete, marketStudentPageList, marketStudentQuery, marketStudentEdit} from '@/api/market'
  import {courseList} from '@/api/teach'
  import {userList} from '@/api/sysManage'
  import {schoolList} from '@/api/school'
  import {schoolQuery} from '@/api/school'
  import ARate from 'ant-design-vue/lib/rate';
  import 'ant-design-vue/dist/antd.css';

  const columns = [

    {
      title: '名称',
      dataIndex: 'studentName',
      fixed: 'left',
      width:'100px',
    },
    {
      title: '性别',
      dataIndex: 'studentSex',
      width:'100px',
      scopedSlots: {customRender: 'studentSex'}
    },
    {
      title: '咨询人',
      dataIndex: 'seekPerson',
      width:'100px',
      scopedSlots: {customRender: 'seekPerson'}
    },
    {
      title: '咨询人电话',
      dataIndex: 'mobile',
      width:'150px',
      scopedSlots: {customRender: 'mobile'}
    },
    {
      title: '介绍人',
      width:'100px',
      dataIndex: 'introduce',
    },
    {
      title: '咨询方式',
      dataIndex: 'seekModel',
      width:'100px',
      scopedSlots: {customRender: 'seekModel'}
    },
    {
      title: '咨询课程',
      dataIndex: 'seekCourse',
      width:'150px',
      scopedSlots: {customRender: 'seekCourse'}
    },
    {
      title: '意向度',
      dataIndex: 'seekDepth',
      width:'200px',
      scopedSlots: {customRender: 'seekDepth'}
    },
    {
      title: '跟进状态',
      dataIndex: 'status',
      width:'100px',
      scopedSlots: {customRender: 'status'}
    },
    {
      title: '咨询学校',
      dataIndex: 'seekSchool',
      width:'100px',
      scopedSlots: {customRender: 'seekSchool'}
    },
    {
      title: '沟通内容',
      dataIndex: 'talkMark',
      width:'100px',
      scopedSlots: {customRender: 'talkMark'}
    },
    {
      title: '状态',
      dataIndex: 'forbidden',
      width:'100px',
      scopedSlots: {customRender: 'forbidden'}
    },
    {
      title: '更新时间',
      dataIndex: 'createdDate',
      width:'150px',
      scopedSlots: {customRender: 'createdDate'},
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: {customRender: 'action'},
      fixed: 'right',
    }
  ]


  export default {
    name: 'TableList',
    components: {
      STable,
      Ellipsis,
      ARate
    },
    data() {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: {roles: []},
        roleListData: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters:', requestParameters)
          console.log(requestParameters['studentName']);
          let search = '';
          if (requestParameters['studentName']) {
            search += ' and student_name like \'%' + requestParameters['studentName'] + '%\''
          }
          if (requestParameters['forbidden']) {
            search += ' and forbidden=' + requestParameters['forbidden']
          }
          requestParameters.search = search;
          return marketStudentPageList(requestParameters).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        seekPersonMap: { 1: {text: '母亲'},2: {text: '父亲'}, 3: {text: '本人'}, 4: {text: '其它'}},
        seekModelMap: { 1: {text: '来电'},2: {text: '来访'}, 3: {text: '网络'}, 4: {text: '其它'}},
        statusMap: { 1: {text: '待跟进'},2: {text: '跟进中'}, 3: {text: '已邀约'}, 4: {text: '已邀约'}, 5: {text: '已失效'}},
        sexMap: { 1: {text: '男'},2: {text: '女'}, 3: {text: '未知'}},
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
      handleAdd() {
        Promise.all([courseList(),schoolQuery(),userList()]).then((result) => {
          console.log(result);
          this.mdl = {}
          this.mdl.courses = result[0].result;
          this.mdl.schools = result[1].result
          this.mdl.users = result[2].result
          this.visible = true
        }).catch((error) => {
          console.log(error)
        })
      },

      handleEdit(record) {
        let self = this;
        Promise.all([courseList(),schoolQuery(),userList()]).then((result) => {
          console.log(record);
          self.mdl = {...record}
          self.mdl.seekModel = record.seekModel+''
          self.mdl.status = record.status+''
          self.mdl.talkMark = record.talkMark[0].content
          self.mdl.seekCourse = record.seekCourse.map((item,index)=>{
            return item.id
          })
          this.$nextTick(()=>{
            this.$refs.createMarketStudentForm.seekDepth = record.seekDepth
          })


          self.mdl.courses = result[0].result;
          self.mdl.schools = result[1].result
          self.mdl.users = result[2].result
          self.visible = true
        }).catch((error) => {
          console.log(error)
        })
      },
      handleOk() {
        const form = this.$refs.createMarketStudentForm.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            let cs = this.mdl.courses.map((item,index)=>{
              if(values.seekCourse&&values.seekCourse.indexOf(item.id)>-1){
                let data = {}
                data.id = item.id
                data.name = item.name
                return data
              }
            })
            values.seekCourse=cs.filter((item,index)=>{
              return item !== undefined
            });
            console.log(values.seekCourse);
            values.seekDepth = this.$refs.createMarketStudentForm.seekDepth
            const param = JSON.stringify(values);

            if (values.id > 0) {
              // 修改 e.g.
              marketStudentEdit(param).then((response) => {
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
              marketStudentSave(param).then((response) => {
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
        const form = this.$refs.createMarketStudentForm.form
        form.resetFields() // 清理表单数据（可不做）
      },

      marketStudentDelete(record) {
        let self = this;
        let contents = `即将被删除！`
        this.$confirm({
          title: '删除后不能恢复，您确定要删除吗?',
          content: contents,
          onOk() {
            let param = {}
            param.id=record.id;
            marketStudentDelete(param).then((response) => {
              self.$message.info(`删除成功`)
              self.$refs.table.refresh()
            })
          },
          onCancel() {
          }
        });
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
