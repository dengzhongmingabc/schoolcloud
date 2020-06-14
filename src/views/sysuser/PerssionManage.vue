<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="loadData"
        ref="table"
        size="default"
        rowKey="key"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
            <a-divider type="vertical" />
            <a>增加子节点</a>
          </template>
        </span>
      </a-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { getPessionList,savePession,deletePession,editPession } from '@/api/sysManage'
  import CreateForm from  './CreateForm'

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      key: 'icon',
      width: '8%',
    },
    {
      title: 'url',
      dataIndex: 'url',
      width: '25%',
      key: 'url',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '45%',
      scopedSlots: { customRender: 'action' }
    }
  ];



  export default {
    name: 'TableList',
    components: {
      CreateForm
    },
    data () {
      return {
        columns,
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: [],
      }
    },
    created () {
      this.loadDataRefresh()
    },
    methods: {
      loadDataRefresh(){
        getPessionList().then(response => {
          const result = response.result
          this.loadData = result;
        }).catch(error => {
        })
      },
      handleAdd () {
        this.mdl = null
        this.visible = true
      },
      handleEdit (record) {
        console.log(record);
        this.visible = true
        this.mdl = record
      },
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            if (values.id > 0) {
              editPession(values).then(response => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.loadDataRefresh()
                this.$message.info('修改成功')
              });
            } else {
              // 新增
              savePession(values).then(response =>{
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.loadDataRefresh()
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
      handleDel (record) {
        let self = this;
        let contents = record.name+" "+record.url;
        this.$confirm({
          title: '删除后不能恢复，您确定要删除吗?',
          content: contents,
          onOk() {
            deletePession(record).then(response =>{
              console.log(response);
              self.loadDataRefresh();
              self.$message.info('删除成功！')
            })
          },
          onCancel() {}
        });

      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
