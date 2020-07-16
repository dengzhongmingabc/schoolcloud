<template>
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
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      <span slot="forbidden" slot-scope="forbidden">
          {{forbidden?'无效':'有效'}}
      </span>
      <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a @click="courseTypeDelete(record)">删除</a>
          </template>
        </span>
    </s-table>


    <CreateCourseTypeForm
      ref="createCourseTypeForm"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      :roles="roleListData"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
  import moment from 'moment'
  import {STable, Ellipsis} from '@/components'
  import {courseTypeSave, courseTypeDelete, courseTypePageList, courseTypeQuery, courseTypeEdit} from '@/api/teach'

  import CreateCourseTypeForm from "./components/CreateCourseTypeForm";

  const columns = [
    {
      title: '#',
      scopedSlots: {customRender: 'serial'}
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'forbidden',
      scopedSlots: {customRender: 'forbidden'}
    },
    {
      title: '更新时间',
      dataIndex: 'createdDate',
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
      CreateCourseTypeForm
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
          console.log(requestParameters['name']);
          let search = '';
          if (requestParameters['name']) {
            search += ' and name like \'%' + requestParameters['name'] + '%\''
          }
          if (requestParameters['forbidden']) {
            search += ' and forbidden=' + requestParameters['forbidden']
          }
          requestParameters.search = search;
          return courseTypePageList(requestParameters).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: []
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
      handleAdd(record) {
        this.mdl = {}
        this.visible = true
      },

      handleEdit(record) {
        this.mdl = {...record}
        this.visible = true
      },
      handleOk() {
        const form = this.$refs.createCourseTypeForm.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            const param = JSON.stringify(values);

            if (values.id > 0) {
              // 修改 e.g.
              courseTypeEdit(param).then((response) => {
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
              courseTypeSave(param).then((response) => {
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

        const form = this.$refs.createCourseTypeForm.form
        form.resetFields() // 清理表单数据（可不做）
      },

      courseTypeDelete(record) {
        let self = this;
        let contents = `${record.realName} 即将被删除！`
        this.$confirm({
          title: '删除后不能恢复，您确定要删除吗?',
          content: contents,
          onOk() {
            courseTypeDelete(record).then((response) => {
              self.$message.info(`${record.realName} 删除成功`)
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
