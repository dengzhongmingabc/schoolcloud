<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="规则编号">
              <a-input v-model="queryParam.id" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="调用次数">
                <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
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
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowSelection="rowSelection"
      showPagination="true"
    >
      <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">配置权限</a>
          </template>
        </span>
    </s-table>



    <create-role-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />

    <create-role-tree-form
      ref="createRoleTreeModal"
      :visible="visibleTree"
      :loading="confirmLoadingTree"
      :model="mdlTree"
      @cancel="handleTreeCancel"
      @ok="handleTreeOk"
    />

  </a-card>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { settingRolePermission,roleListPermission,getRolePageList } from '@/api/sysManage'

  import CreateRoleForm from "./components/CreateRoleForm";
  import {saveRole} from "../../api/sysManage";

  import CreateRoleTreeForm from "./components/CreateRoleTreeForm";

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: '10%'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '8%',
      scopedSlots: { customRender: 'status' }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '12%',
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '70%',
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
      CreateRoleForm,
      CreateRoleTreeForm
    },
    data () {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,

        visibleTree: false,
        confirmLoadingTree: false,
        mdlTree: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters--------:', requestParameters)
          return getRolePageList(requestParameters)
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
      getRoleList({ t: new Date() })
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
        this.mdl = null
        this.visible = true
      },
      handleEdit (record) {
        this.visible = true
        this.mdl = { ...record }
      },

      handleTreeOk (args) {
        this.visibleTree = false
        this.confirmLoadingTree = false
        this.$message.info('修改成功')
      },

      handleOk (){
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            if (values.id > 0) {
              saveRole(values).then(response =>{
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('修改成功')
              })
            } else {
              saveRole(values).then(response =>{
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

        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleTreeCancel () {
        this.visibleTree = false

       /* const form = this.$refs.createRoleTreeModal.form
        form.resetFields() // 清理表单数据（可不做）*/
      },
      handleSub (record) {
        let self = this;
        let args = {}
        args.roleId = record.id;
        roleListPermission(args).then(response =>{
          self.mdlTree = {};
          self.mdlTree.result = response.result;
          self.mdlTree.roleId=record.id
          this.$refs.createRoleTreeModal.reloadTree(self.mdlTree);
          self.visibleTree = true
         })
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
