<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" v-action:add disabled @click="handleAdd">新建</a-button>
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
        <span slot="leaf" slot-scope="leaf" >
          <a-tag v-if="leaf" :color="'green'" >
             按钮
          </a-tag>
          <a-tag v-if="!leaf" :color="'red'" >
             页面
          </a-tag>
        </span>


         <span slot="action"   slot-scope="text, record">
                   <a v-action:edit disabled @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a v-action:deletePession disabled @click="handleDel(record)">删除</a>
            </a-menu-item>
            <a-menu-item>
              <a v-action:add disabled @click="addchildren(record)">增加子节点</a>
            </a-menu-item>
          <!--  <a-menu-item>
              <a @click="handleButton(record)">增加按钮</a>
            </a-menu-item>-->
          </a-menu>
        </a-dropdown>
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

      <button-form
        ref="buttonModal"
        :visible="bvisible"
        :loading="bconfirmLoading"
        :model="bmdl"
        @cancel="bhandleCancel"
        @ok="bhandleOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { getPessionList,savePession,deletePession,editPession } from '@/api/sysManage'
  import AddForm from  './AddForm'
  import EditForm from "./EditForm";
  import ButtonForm from './ButtionForm'

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '10%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
      width: '10%',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: '8%',
    },
    {
      title: '路径',
      dataIndex: 'url',
      width: '20%',
      key: 'url',
    },
    {
      title: '类型',
      dataIndex: 'leaf',
      width: '20%',
      scopedSlots: { customRender: 'leaf' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '10%',
      scopedSlots: { customRender: 'action' }
    }
  ];



  export default {
    name: 'TableList',
    components: {
      AddForm,
      EditForm,
      ButtonForm
    },
    data () {
      return {
        buttonShow:false,
        columns,
        avisible: false,
        aconfirmLoading: false,
        evisible: false,
        econfirmLoading: false,
        bvisible: false,
        bconfirmLoading: false,
        tableloading:false,
        amdl: {},
        emdl: {},
        bmdl: {},
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
            const result = response.result
            this.loadData = result;
            this.tableloading=false
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
      handleButton (record) {
        this.bvisible = true
        let obj = {};
        obj.parentId=record.id;
        this.bmdl = obj
      },
      addchildren (record) {
        this.avisible = true
        let obj = {};
        obj.parentId=record.id;
        obj.level = record.level
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
                if(response.success){
                  this.$message.info('修改成功')
                }
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
                if(response.success){
                  this.$message.info('新增成功')
                }
              })
            }
          } else {
            this.aconfirmLoading = false
          }
        })
      },
      bhandleOk () {
        const form = this.$refs.buttonModal.form
        this.aconfirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
              // 新增
              savePession(values).then(response =>{
                this.bvisible = false
                this.bconfirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.loadDataRefresh()
                if(response.success)
                  this.$message.info('新增成功')
              })
          } else {
            this.bconfirmLoading = false
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
              if(response.success)
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
      bhandleCancel () {
        this.bvisible = false
        const form = this.$refs.buttonModal.form
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
              if(response.success)
                self.$message.info('删除成功')
            })
          },
          onCancel() {}
        });

      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      tagClose(){
        console.log("---------------------------------sss")
        return ;
      }

    }
  }
</script>
