<template>
  <page-header-wrapper>
    <a-form v-bind="formLayout">
      <a-card :bordered="false" class="parent" style="margin-bottom: 8px;height: 60px;">
        <a-row>
          <a-col :span="8">
            <a-button type="primary" @click="returnHandler">
              <a-icon type="left-circle" />
              返回
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <a-card title="学生信息" :bordered="false" style="margin-bottom: 8px;">
        <template slot="extra">
          <a-select
            show-search
            label-in-value
            :value="value"
            placeholder="请输入名称或者手机号码"
            style="width: 200px"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchUser"
            @change="handleChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="(da,index) in data" :key="da.id">
              {{ da.studentName }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="()=>this.$router.push({path:'/market/seekManager/seek'})">
            新建学员
          </a-button>
        </template>


        <div class="studentInfo">
          <span class="studentName">
            {{studentInfo.studentName?studentInfo.studentName:''}}
          </span>
          <span class="mobile">
            {{studentInfo.mobile?studentInfo.mobile:''}}
          </span>
          <span class="mobile">
            {{studentInfo.seekPerson?'('+seekPersonMap[studentInfo.seekPerson].text+')':''}}
          </span>
        </div>
      </a-card>

      <a-card title="课程与班级" :bordered="false" style="margin-bottom: 8px;min-height: 290px;">
        <div slot="extra">
          <a-button type="primary" @click="toAddCourse" style="margin-left: 10px">
            选择课程
          </a-button>
          <a-button type="primary" @click="toAddClass" style="margin-left: 10px">
            选择班级
          </a-button>
        </div>
        <a-table :columns="columns"
                 rowKey="key"
                 v-for="(table,index) in tables"
                 :data-source="table"
                 bordered
                 :pagination="false"
                 style="margin-bottom: 10px"
                 :key="index"
        >
          <template slot="name" slot-scope="text, record">
            <a>{{ text }}</a>
          </template>


          <template slot="price" slot-scope="price, record">
            <a-select v-if="price.data!=undefined" :default-value="price.data[0].totalPrice+'|'+price.data[0].number" style="width: 120px"
                      @change="(value)=>changePrice(record,value)">
              <a-select-option :value="ps.totalPrice+'|'+ps.number" v-for="(ps,index) in price.data" :key="index" >
                {{'￥'+ps.totalPrice+'('+ps.number+'节)'}}
              </a-select-option>
            </a-select>
            <span v-if="price.data==undefined">
              {{price}}
            </span>
          </template>

          <a-input-number :min="1" :max="100" slot="number" slot-scope="text,record" :default-value="1"
                          @change="(value)=>numberChange(record,value)"/>

          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" @click="handleAdd(record)">增加</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              v-if="table.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record)"
            >
              <a href="javascript:;" ref="delete" :disabled="record.price.data!=undefined">删除</a>
            </a-popconfirm>
          </template>


          <template slot="title" slot-scope="currentPageData">
            {{table[0].xname+'('+courseTypeMap[table[0].teachType].text+')'}}
            <a-select
              style="width: 150px;margin-left: 10px"
              placeholder="班级或老师选择"
              option-label-prop="label"
              @change="(value)=>changeClass(table[0],value)"
            >
              <a-select-option v-for="(item,index) in table[0].classesOrTeachers" :value="item.id" :label="item.name" :key="index" >
                {{item.name}}
              </a-select-option>
            </a-select>
          </template>
          <template slot="footer" slot-scope="currentPageData">
            合计{{'('+table[0].addUp+')'}}
          </template>
        </a-table>

      </a-card>

      <a-card title="经办信息" :bordered="false" style="margin-bottom: 8px;min-height: 100px;">
        <a-form :form="form" v-bind="formLayout">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="经办校区" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                <a-select
                  v-decorator="['seekSchoolId',{ initialValue: this.$store.getters.userInfo.currentSchoolId }, {rules: [{ required: false, message: 'Please select your gender!' }]} ]">
                  <a-select-option v-for="(item,index) in mdl.schools" :value="item.id" :label="item.name" :key="index">
                    {{item.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="经办人" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                <a-input  v-decorator="[ 'creater',{ initialValue: this.$store.getters.userInfo.name },  {rules: [{ required: false, message: 'Please input your note!' }]}]"
                         disabled/>
              </a-form-item>
            </a-col>
          </a-row>
          <!--<a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="主销售人" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                <a-select
                  v-decorator="['marketPersonFirstId',{rules: [{ required: false, message: 'Please select your gender!' }]}]">
                  <a-select-option v-for="(item,index) in mdl.users" :value="item.id" :label="item.realName"
                                   :key="index">
                    {{item.realName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="副销售人" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                <a-select
                  v-decorator="[  'marketPersonSecondId', {rules: [{ required: false, message: 'Please select your gender!' }]} ]">
                  <a-select-option v-for="(item,index) in mdl.users" :value="item.id" :label="item.realName"
                                   :key="index">
                    {{item.realName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>-->
        </a-form>
      </a-card>

      <a-card :bordered="false" style="margin-bottom: 8px;height: 64px;">
        <div slot="extra">
          <span style="margin-right: 32px">
            应收：{{'(￥'+totalUp+')'}}
          </span>
          <span style="margin-right: 32px">
            实收：<a-input-number :min="0" :max="1000000" v-model="realyUp" @change=""/>
          </span>
          <span>
            欠费：{{'(￥'+oweUp+')'}}
          </span>


          <a-button type="primary" style="margin-left: 10px" @click="saveOrder">
            确定
          </a-button>
        </div>
      </a-card>
    </a-form>
    <SelectCourse
      ref="selectCourse"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />

    <SelectClass
      ref="selectClass"
      :visible="classVisible"
      :loading="classConfirmLoading"
      :model="classMdl"
      @cancel=""
      @ok=""
    />
  </page-header-wrapper>
</template>

<script>
  import debounce from 'lodash/debounce';
  import {marketStudentList} from '@/api/market'
  import SelectCourse from "./components/SelectCourse";
  import SelectClass from "./components/SelectClass";

  import {courseList,classesList} from '@/api/teach'
  import {userList} from '@/api/sysManage'
  import {schoolQuery} from '@/api/school'
  import {handlerSave} from '@/api/handler'
  import notification from 'ant-design-vue/es/notification'

  const columns = [
    {
      title: '项目类型',
      dataIndex: 'name',
      scopedSlots: {customRender: 'name'},
    },
    {
      title: '项目名称',
      dataIndex: 'xname'
    },
    {
      title: '收费标准',
      dataIndex: 'price',
      scopedSlots: {customRender: 'price'},
    },
    {
      title: '数量',
      dataIndex: 'number',
      scopedSlots: {customRender: 'number'},
    },
    {
      title: '优惠',
      dataIndex: 'prefer',
    },
    {
      title: '小计',
      dataIndex: 'mintotal',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '35%',
      scopedSlots: {customRender: 'operation'},
    },
  ];


  export default {
    components: {
      SelectCourse,
      SelectClass
    },

    data() {
      this.formLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 20}
        }
      };

      this.lastFetchId = 0;
      this.fetchUser = debounce(this.fetchUser, 800);
      return {
        form: this.$form.createForm(this),

        classVisible: false,
        classConfirmLoading: false,
        classMdl: {},

        visible: false,
        confirmLoading: false,
        mdl: {roles: []},
        columns,
        count: 5,
        tableId: 1,
        data: [],
        value: [],
        fetching: false,
        studentInfo: {},
        seekPersonMap: {1: {text: '母亲'}, 2: {text: '父亲'}, 3: {text: '本人'}, 4: {text: '其它'}},
        seekModelMap: {1: {text: '来电'}, 2: {text: '来访'}, 3: {text: '网络'}, 4: {text: '其它'}},
        statusMap: {1: {text: '待跟进'}, 2: {text: '跟进中'}, 3: {text: '已邀约'}, 4: {text: '已邀约'}, 5: {text: '已失效'}},
        sexMap: {1: {text: '男'}, 2: {text: '女'}, 3: {text: '未知'}},
        courseTypeMap: {1: {text: '一对一'}, 2: {text: '班级'}},
        tables: [],
        realyUp: 0,

      }
    },
    created() {
      Promise.all([courseList(), schoolQuery(), userList()]).then((result) => {
        console.log(result);
        this.mdl = {}
        this.mdl.courses = result[0].result;
        this.mdl.schools = result[1].result
        this.mdl.users = result[2].result
      }).catch((error) => {
        console.log(error)
      })
    },
    computed: {
      totalUp: function () {
        let allUp = 0;
        let tableIndex = 0
        let table = this.tables[tableIndex];
        for (; tableIndex < this.tables.length; tableIndex++) {
          table = this.tables[tableIndex];
          allUp += table[0].addUp
        }
        this.realyUp = allUp
        return allUp;
      },
      oweUp: function () {
        return this.totalUp - this.realyUp;
      }
    },
    methods: {
      changeClass(record, value) {
        console.log("this.tables1",this.tables)
        console.log(record)
        console.log(value)

        record.currentClassOrTeacher = value
        const {tables} = this;
        this.editTables(tables, record)
        console.log("this.tables2",this.tables)
      },
      toAddClass(record) {
        this.classVisible = true
      },
      saveOrder() {
        if(!this.studentInfo.id){
          notification.error({
            message: '错误提示',
            description: '请选择用户信息'
          })
          return
        }
        if(this.tables.length<1){
          notification.error({
            message: '错误提示',
            description: '请选择课程'
          })
          return
        }
        let value = {}
        value.studentId = this.studentInfo.id
        value.orderType = 1
        value.orderContent = this.tables
        value.orderMoney = this.totalUp
        value.getOrderMoneyReality = this.realyUp
        value.oweUp = this.oweUp
        value.remark = ""
        const param = JSON.stringify(value);
        handlerSave(param).then((response) => {
          console.log(param)
          console.log(response)
          //this.$router.push({path:'/handler/handler'})
          this.$router.push({name:'voucher',params:{record:response.result}})
        })

      },

      returnHandler(){
        this.$router.push({path:'/handler/handler'})
      },

      addUp(tables, argsrecord) {
        let tableIndex = 0
        let recordIndex = 0
        let table = tables[tableIndex];
        f:for (; tableIndex < tables.length; tableIndex++) {
          table = tables[tableIndex];
          recordIndex = 0
          s:for (; recordIndex < table.length; recordIndex++) {
            if (table[recordIndex].key == argsrecord.key) {
              break f;
              break s;
            }
          }
        }
        let record2 = table[0]
        let addUp = 0;
        let index = 0
        for (; index < table.length; index++) {
          let record = table[index];
          addUp += record.mintotal;
        }
        record2.addUp = addUp
        this.editTables(tables, record2)
      },
      editTables(tables, record) {
        let tableIndex = 0
        let recordIndex = 0
        let table = tables[tableIndex];
        f:for (; tableIndex < tables.length; tableIndex++) {
          table = tables[tableIndex];
          recordIndex = 0
          s:for (; recordIndex < table.length; recordIndex++) {
            if (table[recordIndex].key == record.key) {
              break f;
              break s;
            }
          }
        }
        console.log(table)
        console.log(tableIndex)
        console.log(recordIndex)
        table.splice(recordIndex, 1, record);
        this.tables.splice(tableIndex, 1, table);
      },
      numberChange(record, value) {
        if (record.price.data) {//如果是课程（主）
          record.mintotal = record.priceCurrent * value - record.prefer
        } else {
          record.mintotal = record.price * value - record.prefer
        }
        record.number = value;
        const {tables} = this;

        console.log('record', record)
        console.log('tables', tables)
        this.editTables(tables, record)
        this.addUp(tables, record)
      },
      changePrice(record, value) {
        console.log(record)

        record.priceCurrent = value.split("|")[0]
        record.mintotal = record.priceCurrent * record.number - record.prefer
        record.courseCount = value.split("|")[1]

        const {tables} = this;
        this.editTables(tables, record)
        this.addUp(tables, record)
      },
      toAddCourse(record) {
        this.visible = true
      },
      fetchUser(value) {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.data = [];
        this.fetching = true;
        this.value = []
        marketStudentList().then(res => {
          console.log(res);
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            console.log(fetchId, this.lastFetchId)
            return;
          }
          const data = res.result.filter(item => item.studentName.indexOf(value) > -1);
          this.data = data;
          this.fetching = false;
        });
      },
      handleChange(value) {
        const students = this.data.filter(item => item.id == value.key);
        this.studentInfo = students[0];
        Object.assign(this, {
          value,
          data: [],
          fetching: false,
        });
      },
      onDelete(record) {
        console.log(record)
        const {tables} = this;
        console.log(tables);
        var index = 0
        let table = tables[index];
        for (; index < tables.length; index++) {
          console.log(tables[index]);
          if (tables[index][0].tableId == record.tableId) {
            table = tables[index];
            break;
          }
        }
        let tableData = table.filter(item => item.key !== record.key);
        this.tables.splice(index, 1, tableData);

        this.addUp(tables, record)
        /*const tableData = [...this.tableData];
        this.tableData = tableData.filter(item => item.key !== key);*/
      },
      handleAdd(record) {
        console.log(record)
        console.log(record.tableId)

        const {tables} = this;
        console.log(tables);
        var index = 0
        let table = tables[index];
        for (; index < tables.length; index++) {
          console.log(tables[index]);
          if (tables[index][0].tableId == record.tableId) {
            table = tables[index];
            break;
          }
        }
        console.log(table)
        console.log(index)
        let data = {
          key: Math.random(),
          tableId: record.tableId,
          name: '教材杂费',
          xname: '书本',
          price: 80,
          number: 1,
          prefer: 10,
          mintotal: 70
        }
        table = [...table, data]
        this.tables.splice(index, 1, table);
        this.addUp(tables, record)
      },
      handleOk() {
        let requestParameters = {}
        Promise.all([classesList(requestParameters),userList()]).then((result) => {
          let classData = result[0].result
          let teacherData = result[1].result
          const targetDatas = this.$refs.selectCourse.targetDatas
          console.log("yyy", targetDatas)

          let jiaoji = this.tables.filter((item) => {
            for (var i = 0; i < targetDatas.length; i++) {
              if (targetDatas[i].key == item[0].key) {
                return true
              }
            }
            return false
          })

          console.log("jiaoji", jiaoji)
          let tableAdd = targetDatas.filter((item) => {
            if (jiaoji.length < 1) {
              return true
            }
            for (var a = 0; a < jiaoji.length; a++) {
              if (jiaoji[a][0].key != item.key) {
                return true
              }
            }
            return false
          })
          console.log("tableAdd", tableAdd)
          this.tables = [...jiaoji];
          for (var data of tableAdd) {
            this.tableId = this.tableId + 1
            const table = []
            let d = {};
            d.key = data.key
            d.tableId = this.tableId
            d.xname = data.title
            d.name = '课程'
            d.prefer = 100
            d.number = 1
            d.price = data.payModel;
            // d.numberCurrent = d.number
            d.priceCurrent = d.price.data[0].totalPrice
            d.courseCount = d.price.data[0].number
            d.mintotal = d.priceCurrent * d.number - d.prefer;
            d.addUp = d.mintotal
            d.teachType = data.teachType

            //如果是一对一，老师列表，如果是班级课程，班级列表
            if(data.teachType == 1){
              d.classesOrTeachers = teacherData.map((item)=>{
                let teacher = {};
                teacher.id = item.id
                teacher.name = item.realName;
                return teacher
              })
            }else{
              d.classesOrTeachers = classData.filter((item)=>{
                console.log("item.teachCourse.id",item.teachCourse.id)
                console.log("data.key",data.key)
                return item.teachCourse.id==data.key
              });
            }


            console.log("d.classesOrTeachers",d.classesOrTeachers)
            d.currentClassOrTeacher = ''
            table.push(d);
            this.tables.push(table);
          }
          console.log(this.tables)
          this.visible = false
        }).catch((error) => {
          console.log(error)
        })


      },
      handleCancel() {
        this.visible = false
      },
    },
  }
</script>

<style scoped>
  .parent {

  }

  .parent >>> .ant-card-body {
    padding: 15px 24px 0px;
  }

  #course-card >>> .ant-card-body {
    padding: 0px;
  }

  .studentInfo {
    font-size: 14px;
    font-family: 微软雅黑;
    margin-top: 6px;
    font-weight: bold;
  }

  .mobile {
    font-size: 10px;
    font-weight: normal;
  }


</style>