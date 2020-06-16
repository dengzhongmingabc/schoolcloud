<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <a-table
        :columns="columns"
        :loading="tableloading"
        :data-source="loadData"
        ref="table"
        size="default"
        rowKey="id"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
            <a-divider type="vertical" />
            <a @click="addchildren(record)">增加子节点</a>
          </template>
        </span>
      </a-table>

      <Add-form
        ref="addModal"
        :visible="avisible"
        :loading="aconfirmLoading"
        :model="amdl"
        @cancel="ahandleCancel"
        @ok="ahandleOk"
      />
      <edit-form
        ref="editModal"
        :visible="evisible"
        :loading="econfirmLoading"
        :model="emdl"
        @cancel="ehandleCancel"
        @ok="ehandleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { getPessionList,savePession,deletePession,editPession } from '@/api/sysManage'
  import AddForm from  './AddForm'
  import EditForm from "./EditForm";

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
      width: '15%',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: '8%',
    },
    {
      title: '跳转',
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
      AddForm,
      EditForm
    },
    data () {
      return {
        columns,
        avisible: false,
        aconfirmLoading: false,
        evisible: false,
        econfirmLoading: false,
        tableloading:false,
        amdl: null,
        emdl: null,
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
        this.tableloading=true
        getPessionList().then(response => {
          setTimeout(()=>{
            const result = response.result
            this.loadData = result;
            this.tableloading=false
          },500)
        }).catch(error => {
          this.tableloading=false
        })
      },
      handleAdd () {
        this.amdl = null
        this.avisible = true
      },
      handleEdit (record) {
        this.evisible = true
        this.emdl = record
      },
      addchildren (record) {
        this.avisible = true
        let obj = {};
        obj.parentId=record.id;
        this.amdl = obj
      },
      ahandleOk () {
        const form = this.$refs.addModal.form
        this.aconfirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            if(values.parentId>0){
              savePession(values).then(response =>{
                this.avisible = false
                this.aconfirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.loadDataRefresh()
                this.$message.info('新增成功')
              })
            }else{
              // 新增
              savePession(values).then(response =>{
                this.avisible = false
                this.aconfirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.loadDataRefresh()
                this.$message.info('新增成功')
              })
            }
          } else {
            this.aconfirmLoading = false
          }
        })
      },
      ehandleOk () {
        const form = this.$refs.editModal.form
        this.econfirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            editPession(values).then(response => {
              this.evisible = false
              this.econfirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.loadDataRefresh()
              this.$message.info('修改成功')
            });
          } else {
            this.econfirmLoading = false
          }
        })
      },
      ahandleCancel () {
        this.avisible = false
        const form = this.$refs.addModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      ehandleCancel () {
        this.evisible = false
        const form = this.$refs.editModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleDel (record) {
        let self = this;
        let contents = record.name+" "+record.url;
        this.$confirm({
          title: '子节点也一并删除，您确定要删除吗?',
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
