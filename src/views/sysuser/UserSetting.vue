<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="真实名称">
                <a-input v-model="queryParam.realName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.invalid" placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="false">锁定</a-select-option>
                  <a-select-option value="true">解锁</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号码">
                  <a-input v-model="queryParam.mobile" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="用户名">
                  <a-input v-model="queryParam.userName" placeholder="请输入用户名"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="true"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="invalid" slot-scope="invalid">
          {{invalid?'解锁':'锁定'}}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="deleteSysUser(record)">删除</a>
          </template>
        </span>
      </s-table>


      <create-user-form
        ref="createUserModal"
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
  import { STable, Ellipsis } from '@/components'
  import { userPageList,saveSysUser,deleteSysUser,roleList,detailSysUser,editSysUser} from '@/api/sysManage'

  import CreateUserForm from "./components/CreateUserForm";

  const columns = [
    {
      title: '#',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '职位',
      dataIndex: 'position',
    },
    {
      title: '手机',
      dataIndex: 'mobile',
    },
    {
      title: '状态',
      dataIndex: 'invalid',
      scopedSlots: { customRender: 'invalid' }
    },
    {
      title: '更新时间',
      dataIndex: 'createTime',
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]

  const statusMap = {
    0: {
      status: 'default',
      text: '关闭'
    },
    1: {
      status: 'processing',
      text: '运行中'
    },
    2: {
      status: 'success',
      text: '已上线'
    },
    3: {
      status: 'error',
      text: '异常'
    }
  }

  export default {
    name: 'TableList',
    components: {
      STable,
      Ellipsis,
      CreateUserForm
    },
    data () {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        roleListData:null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters:', requestParameters)
          return userPageList(requestParameters)
            .then(res => {
              return res.result
            })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    created () {

    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      handleAdd () {
        roleList().then((response)=>{
          this.mdl = {}
          this.mdl.roles = response.result
          this.visible = true
        })
      },
      handleEdit (record) {
        Promise.all([detailSysUser(record),roleList()]).then((result) => {
          console.log(result);
          this.mdl = {...record}
          this.mdl.roles = result[1].result
          this.mdl.newRoles = result[0].result.roles
          this.visible = true
        }).catch((error) => {
          console.log(error)
        })
      },
      handleOk () {
        const form = this.$refs.createUserModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            values.newRoles = values.newRoles.join(',')
            console.log('values', values)
            if (values.id > 0) {
              // 修改 e.g.
              editSysUser(values).then((response)=>{
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
              saveSysUser(values).then((response)=>{
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
      handleCancel () {
        this.visible = false

        const form = this.$refs.createUserModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleSub (record) {
        if (record.status !== 0) {
          this.$message.info(`${record.no} 订阅成功`)
        } else {
          this.$message.error(`${record.no} 订阅失败，规则已关闭`)
        }
      },
      deleteSysUser(record){
        let self = this;
        let contents = `${record.realName} 即将被删除！`
        this.$confirm({
          title: '删除后不能恢复，您确定要删除吗?',
          content: contents,
          onOk() {
            deleteSysUser(record).then((response)=>{
              self.$message.info(`${record.realName} 删除成功`)
              self.$refs.table.refresh()
            })
          },
          onCancel() {}
        });



      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
