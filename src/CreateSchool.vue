<template>
  <a-row type="flex" justify="center">
    <a-col :span="12" class="a-colstyle" style="width: 960px">
      <div class="top">

        <a-row type="flex" justify="space-around">

          <a-col :span="12" class="colleftstype">
            <img src="~@/assets/logo.svg" class="logo" alt="logo"><span style="font-size: 16px">智能教培</span>
          </a-col>
          <a-col :span="12" class="colstype">
            <span>{{userInfo.name}}</span>&nbsp;&nbsp;&nbsp;
            <a-divider type="vertical"/>
            <a href="#" @click="handleLogout">退出</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </a-col>

        </a-row>
      </div>
      <div class="middle">
        <div class="head">
          <a-row type="flex" justify="space-around">
            <a-col :span="12" class="colleftstype">
              <img src="~@/assets/user.svg" class="logo" alt="user"><span style="font-size: 14px">{{userInfo.mobile?userInfo.mobile:userInfo.username}}</span>
            </a-col>
            <a-col :span="12" class="colstype">
              <a-button type="primary" @click="toSchoolAdd">
                新增校区
              </a-button>
            </a-col>

          </a-row>
        </div>
        <div class="bodydiv" style="padding: 20px">
          <a-row style="margin-bottom: 10px;" v-for="(items,index) in schoolList" :key="index">
            <a-col v-for="(item,index) in items" :span="8" :key="index">
              <a-card hoverable style="width: 300px" @click="toSchool(item.id)">
                <template slot="actions" class="ant-card-actions">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>提交审核</span>
                    </template>
                    <a-icon type="file-sync" />
                  </a-tooltip>
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>修改校区</span>
                    </template>
                    <a-icon key="edit" type="edit"/>
                  </a-tooltip>
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>删除校区</span>
                    </template>
                    <a-icon type="delete" @click.stop="schoolDelete(item.id)"/>
                  </a-tooltip>
                </template>
                <h2>{{item.name}}</h2>
                <p>地址：{{item.address}}</p>
                <p>审核状态：未审核</p>
              </a-card>
            </a-col>
          </a-row>

        </div>
      </div>
      <div class="button">
        Copyright©2010~2020 智能教培 All Rights Reserved
      </div>
    </a-col>

    <create-school-form
      ref="createSchoolModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-row>


</template>

<script>

  import {schoolList,schoolAdd,schoolDelete,schoolIdSetting} from '@/api/school'

  import CreateSchoolForm from './CreateSchoolForm'
  import {Modal} from "ant-design-vue";
  import {mapActions, mapState} from 'vuex'
  export default {
    name: 'Article',
    components: {CreateSchoolForm},

    data() {
      return {
        schoolList: [],
        visible: false,
        confirmLoading: false,
        mdl: {}
      }
    },
    created() {
      this.reflushList();
    },
    computed: {
      ...mapState({
        nickname: (state) => state.user.nickname,
        welcome: (state) => state.user.welcome
      }),
      currentUser () {
        return {
          name: 'Serati Ma',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        }
      },
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    methods: {
      ...mapActions(['Login', 'Logout']),
      reflushList(){
        schoolList().then((response) => {
          this.schoolList = response.result;
        })
      },
      toSchool(schoolId) {
        const school = {}
        school.schoolId = schoolId;
        schoolIdSetting(school).then((response)=>{
          if(response.success){
            console.log(this.$router)
            this.$router.push({path: '/dashboard/workplace'})
          }
        })
      },
      toSchoolAdd(){
        this.mdl = {}
        this.visible = true
      },
      schoolDelete(schoolId){
        const record = {}
        record.schoolId=schoolId
        let self = this;
        this.$confirm({
          title: '您确定要删除吗?',
          content: '删除会导致该校区所有数据，账号不可用！',
          onOk() {
            schoolDelete(record).then(response =>{
              console.log(response);
              self.reflushList();
              self.$message.info('删除成功！')
            })
          },
          onCancel() {}
        });
      },
      handleOk () {
        const form = this.$refs.createSchoolModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            if (values.id > 0) {
              // 修改 e.g.
              editSysUser(values).then((response)=>{
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                this.reflushList();
                // 刷新表格
                this.$message.info('修改成功')
              })
            } else {
              // 新增
              schoolAdd(values).then((response)=>{
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.reflushList();
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
      handleLogout (e) {
        Modal.confirm({
          title: this.$t('提示'),
          content: this.$t('您确定要退出吗？'),
          onOk: () => {
            return new Promise((resolve, reject) => {
              /*setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
              let data = {};
              axios.post(`${this.$url}/test/testRequest`,data).then(res=>{
                  console.log('res=>',res);
              })*/

              /*logout().then(response=>{
                this.$router.red.push({ redirect: '/user/login' })
              })*/

              this.Logout().then(() => {
                setTimeout(() => {
                  window.location.reload()
                }, 100)
                resolve()
              })
            }).catch(() => console.log('Oops errors!'))
          },
          onCancel () {}
        })
      }

    }
  }
</script>

<style scoped>
  .top {
    height: 60px;
    padding: 0 5px 0 5px;
  }

  .middle {
    height: 550px;
    background: #f2f2f5;
    padding: 5px;
  }

  .button {
    height: 50px;
    background: white;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
  }

  .head {
    height: 50px;
    background: #f2f2f5;
  }

  .bodydiv {
    height: 490px;
    background: white;
  }

  .colstype {
    text-align: right;
    line-height: 50px;
  }

  .colleftstype {
    line-height: 50px;
    font-size: 10px;
  }

  .logo {
    height: 20px;
    margin-right: 6px;
    margin-bottom: 6px;
  }
</style>
