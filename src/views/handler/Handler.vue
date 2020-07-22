<template>
  <page-header-wrapper>
    <a-card :bordered="false"style="margin-bottom: 8px;">
      <a-button type="primary" icon="form"  :size="size" @click="showDrawer">报名/续费</a-button>
      <a-button type="primary" style="margin-left:10px;" icon="money-collect" :size="size" @click="handleAdd">充值</a-button>
      <a-button type="primary" style="margin-left:10px;" icon="pay-circle" :size="size" @click="handleAdd">补费</a-button>
      <a-button type="primary" style="margin-left:10px;" icon="reload" :size="size" @click="handleAdd">转课</a-button>
      <a-button type="primary" style="margin-left:10px;" icon="transaction" :size="size" @click="handleAdd">退费</a-button>
      <a-button type="primary" style="margin-left:10px;" icon="transaction" :size="size" @click="handleAdd">教学资料</a-button>
      <a-button type="primary" style="margin-left:10px;" icon="transaction" :size="size" @click="handleAdd">积分</a-button>
    </a-card>
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
            <a @click="handlerDelete(record)">删除</a>
          </template>
        </span>
    </s-table>

    <a-drawer
      title="Basic Drawer"
      :placement="placement"
      :closable="false"
      :visible="visibledrawer"
      @close="onClose"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>

  </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import {STable, Ellipsis} from '@/components'
  import {handlerSave, handlerDelete, handlerPageList, handlerQuery, handlerEdit} from '@/api/handler'

  import CreateHandlerForm from "./components/CreateHandlerForm";

  const columns = [
    {
      title: '#',
      scopedSlots: {customRender: 'serial'}
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
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
      CreateHandlerForm
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
          return handlerPageList(requestParameters).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        size:'default',
        visibledrawer: false,
        placement: 'top',
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
        const form = this.$refs.CreateHandlerForm.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            const param = JSON.stringify(values);

            if (values.id > 0) {
              // 修改 e.g.
              handlerEdit(param).then((response) => {
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
              handlerSave(param).then((response) => {
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

        const form = this.$refs.CreateHandlerForm.form
        form.resetFields() // 清理表单数据（可不做）
      },

      handlerDelete(record) {
        let self = this;
        let contents = `${record.realName} 即将被删除！`
        this.$confirm({
          title: '删除后不能恢复，您确定要删除吗?',
          content: contents,
          onOk() {
            handlerDelete(record).then((response) => {
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
      },
      showDrawer() {
          //this.visibledrawer = true;
       this.$router.push({path:'/handler/signRenew'})
      },
      onClose() {
        this.visibledrawer = false;
      },
      onChange(e) {
        this.placement = e.target.value;
      }
    }

  }
</script>
