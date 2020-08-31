<template>
  <div>
    <a-modal
      :maskClosable="false"
      cancelText="取消"
      okText="确定"
      title="表单"
      :width="940"
      :visible="visible"
      :confirmLoading="loading"
      @ok="viewSubmit"
      @cancel="() => { $emit('cancel') }"
    >
      <a-spin :spinning="loading">
        <a-form :form="form" v-bind="formLayout">
          <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
          <a-form-item v-show="false" label="主键ID">
            <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
          </a-form-item>
          <a-form-item label="班级">
            <a-select label-in-value
                      v-decorator="['classOrOneByOne',{initialValue: model.classOrOneByOne},{rules:[{required: true, message: '班级'}]}]"
                      @change="" disabled>
              <a-select-option v-for="(item,index) in model.oneByOnes" :key="index" :value="item.id"
                               :label="item.marketStudent.studentName">
                {{item.marketStudent.studentName+'('+item.course.name+')'}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="任课老师">
            <a-select label-in-value
                      v-decorator="['teacher',{initialValue: model.teacher==0?'':model.teacher}, {rules:[{required: true, message: '任课老师'}]}]"
                      @change="">
              <a-select-option v-for="(item,index) in model.users" :key="index" :value="item.id" :label="item.realName">
                {{item.realName}}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="上课时间段">
            <template>
              <a-time-picker placeholder="开始时间"
                             v-decorator="['startTime', {initialValue: this.startTime},{rules: [{required: true, message: '开始时间!' }]}]"
                             :minute-step="5" :second-step="60" @change="startTimeChange"/>
              <a-time-picker placeholder="结束时间"
                             v-decorator="['endTime',{initialValue: this.endTime},{rules: [{required: true, message: '结束时间!' }]}]" :minute-step="5"
                             :second-step="60" @change="endTimeChange"/>
            </template>
          </a-form-item>
          <a-form-item label="排课方式">
            <a-radio-group button-style="solid" v-decorator="['courseModel', { initialValue:this.courseModel+''}]"
                           @change="changeCourseModel">
              <a-radio-button value="1">
                自由排课
              </a-radio-button>
              <a-radio-button value="2">
                重复排课
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="请选择日期" v-if="this.courseModel=='1'">
            <vc-date-picker mode='multiple' v-model='dates' style="width: 100px"/>
          </a-form-item>


          <template v-if="this.courseModel=='2'">

            <a-form-item label="开始日期">
              <a-date-picker
                v-decorator="['startDate', { initialValue:this.model.courseModel?null:moment(this.model.courseModel.startDate,'YYYY-MM-DD')},{rules: [{ type: 'object', required: true, message: 'Please select time!' }]}]"
                style="width: 100%" placeholder="请输入名称" @change="startDateChange">
              </a-date-picker>
            </a-form-item>

            <a-form-item label="上课星期">
              <a-checkbox-group v-decorator="['weekModel', { initialValue:this.weekModel}]" @change="weekModelChange">
                <a-checkbox value="0">
                  星期一
                </a-checkbox>
                <a-checkbox value="1">
                  星期二
                </a-checkbox>
                <a-checkbox value="2">
                  星期三
                </a-checkbox>
                <a-checkbox value="3">
                  星期四
                </a-checkbox>
                <a-checkbox value="4">
                  星期五
                </a-checkbox>
                <a-checkbox value="5">
                  星期六
                </a-checkbox>
                <a-checkbox value="6">
                  星期日
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>

            <a-form-item label="循环周期">
              <a-radio-group v-decorator="['repeatModel', { initialValue:this.repeatModel+''}]" @change="repeatChange">
                <a-radio value="1">
                  每周
                </a-radio>
                <a-radio value="2">
                  隔周
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </template>
        </a-form>
      </a-spin>


      <template slot="footer">
        <a-button type="primary" @click="()=>{submitToView()}">预览</a-button>
        <a-button @click="() => { $emit('cancel') }">取消</a-button>
        <a-button type="primary" @click="submit">确认</a-button>
      </template>
    </a-modal>

    <CourseModelToView
      ref="courseModelToView"
      :visible="viewVisible"
      :loading="viewConfirmLoading"
      :model="viewMdl"
      @cancel="viewCancel"
      @ok="viewSubmit"
    />
  </div>

</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import CourseModelToView from "./CourseModelToView";
  import notification from "ant-design-vue/lib/notification";
  // 表单字段
  const fields = ['id']

  export default {
    components: {
      CourseModelToView
    },
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      loading: {
        type: Boolean,
        default: () => false
      },
      model: {
        type: Object,
        default: () => {
        }
      },
    },
    data() {
      this.formLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 19}
        }
      }
      return {
        form: this.$form.createForm(this),
        value: [],
        dates: [],
        viewVisible: false,
        viewConfirmLoading: false,
        viewMdl: {events: []},
        courseModel: '1',//
        weekModel: [],
        repeatModel: '1',
        startDate: '',
        startTime:null,
        endTime:null
      }
    },
    created() {
      // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))

      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        console.log("bbbbbbbbbbbbbbbbbbbbbb",this.model.courseModel)
        this.courseModel = this.model.courseModel==null||this.model.courseModel==undefined?'1':this.model.courseModel.courseModel+''
        this.weekModel = this.model.courseModel==undefined?[]:this.model.courseModel.weekModel
        this.repeatModel = this.model.courseModel==undefined||this.model.courseModel.courseModel=='1'?'1':this.model.courseModel.repeatModel
        this.startDate = this.model.courseModel==undefined||this.model.courseModel.courseModel=='1'?null:this.model.courseModel.startDate
        this.startTime = this.model.courseModel==undefined?null:moment(this.model.courseModel.startTime, 'HH:mm:ss')
        this.endTime = this.model.courseModel==undefined?null:moment(this.model.courseModel.endTime, 'HH:mm:ss')
        this.dates = this.model.courseModel==undefined||this.model.courseModel.courseModel=='2'?[]:this.model.courseModel.events.map((item)=>{
          return new Date(moment(item.start,'YYYY-MM-DD').valueOf())
        })
        console.log(this.dates);
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    },
    methods: {
      startTimeChange(time, timeString){
        console.log(time, timeString);
        this.startTime = timeString
      },
      endTimeChange(time, timeString){
        console.log(time, timeString);
        this.endTime = timeString
      },
      changeDates(value){
        console.log(value)
      },
      moment,
      submit() {
        this.$emit('ok')
      },
      startDateChange(date, dateString) {
        this.startDate = dateString
      },
      weekModelChange(checkedValues) {
        this.weekModel = checkedValues
      },
      changeCourseModel(e) {
        console.log(e);
        this.courseModel = e.target.value
      },
      repeatChange(e) {
        this.repeatModel = e.target.value
      },
      submitToView() {
        let self = this;
        let events = [];
        let dates = self.dates;
        self.form.validateFields((errors, values) => {

          if(self.courseModel=='2'&&(!self.weekModel||self.weekModel.length<1)){
            this.$message.error('请选择上课星期！');
            return;
          }
          if(self.courseModel=='2'&&!self.startDate){
            this.$message.error('请选择开始时间！');
            return;
          }
          if(self.courseModel=='2'&&!self.repeatModel){
            this.$message.error('请选择循环周末！');
            return;
          }
          if(self.courseModel=='1'&&self.dates.length<1){
            this.$message.error('请选择日期！');
            return;
          }
          if(!self.startTime){
            this.$message.error('请选择时间段！');
            return;
          }
          if(!self.endTime){
            this.$message.error('请选择时间段！');
            return;
          }
          if (!errors) {
            if (self.courseModel == 2) {
              let i = 0
              dates = []
              while (dates.length < this.model.courseCount) {
                let date = moment(self.startDate).add(i, 'days')
                var weekday = date.weekday();
                if (self.weekModel.includes(weekday + '')) {
                  dates.push(moment(date).format('YYYY-MM-DD'))
                }
                if(self.repeatModel=='2'&&weekday == 6){
                  i+=8
                }else {
                  i++;
                }
              }
              console.log(dates);
            }
            for (let date of dates) {
              /*console.log(values);
              console.log(date);*/
              let event = {}
              event.title = `${values.classOrOneByOne.label}`
              event.start = moment(date).format('YYYY-MM-DD') + ' ' + moment(values.startTime).format('HH:mm:ss')
              event.end = moment(date).format('YYYY-MM-DD') + ' ' + moment(values.endTime).format('HH:mm:ss')
              events.push(event)
            }
            self.viewMdl.events = events
            self.viewVisible = true;
          }
        })
      },
      viewCancel() {
        this.viewVisible = false;
      }
      ,
      viewSubmit() {
        this.viewVisible = false;
      }
      ,
    }
  }
</script>
