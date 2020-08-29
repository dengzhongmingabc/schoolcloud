<template>
  <div>
    <a-modal
      :maskClosable="false"
      cancelText="取消"
      okText="确定"
      title="表单"
      :width="640"
      :visible="visible"
      :confirmLoading="loading"
      @ok="viewSubmit"
      @cancel="() => { $emit('viewCancel') }"
    >
      <a-spin :spinning="loading">
        <a-form :form="form" v-bind="formLayout">
          <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
          <a-form-item v-show="false" label="主键ID">
            <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
          </a-form-item>
          <a-form-item label="班级">
            <a-select label-in-value v-decorator="['classOrOneByOne', {rules:[{required: true, message: '班级'}]}]"  @change="" >
              <a-select-option  v-for="(item,index) in model.oneByOnes" :key="index" :value="item.id" :label="item.marketStudent.studentName">
                {{item.marketStudent.studentName+'('+item.course.name+')'}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="任课老师">
            <a-select label-in-value v-decorator="['teacher', {rules:[{required: true, message: '任课老师'}]}]"  @change="">
              <a-select-option  v-for="(item,index) in model.users" :key="index" :value="item.id" :label="item.realName">
                {{item.realName}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="开始日期">
            <a-date-picker v-decorator="['startDate', {rules: [{ type: 'object', required: true, message: 'Please select time!' }]}]" style="width: 100%" placeholder="请输入名称">
            </a-date-picker>
          </a-form-item>
          <a-form-item label="上课时间段">
            <template>
              <a-time-picker placeholder="开始时间" v-decorator="['startTime', {rules: [{required: true, message: '开始时间!' }]}]" :minute-step="5" :second-step="60" />
              <a-time-picker placeholder="结束时间" v-decorator="['endTime', {rules: [{required: true, message: '结束时间!' }]}]" :minute-step="5" :second-step="60" />
            </template>
          </a-form-item>
          <a-form-item label="排课方式">
            <a-radio-group button-style="solid"   v-decorator="['courseModel', { initialValue:'1' }]">
              <a-radio-button value="1">
                自由
              </a-radio-button>
              <a-radio-button value="2">
                重复
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="请选择日期">
            <vc-date-picker mode='multiple' v-model='dates'/>
          </a-form-item>
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
  import notification from "ant-design-vue/lib/notification";

  import CourseModelToView from "./CourseModelToView";
  // 表单字段
  const fields = ['name', 'id']

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
          sm: {span: 7}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 13}
        }
      }
      return {
        form: this.$form.createForm(this),
        value: [],
        dates: [],
        viewVisible:false,
        viewConfirmLoading:false,
        viewMdl:{events:[]},
      }
    },
    created() {
      // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))

      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    },
    methods: {
      submit() {
        let self = this;
        let events = [];
        self.form.validateFields((errors, values) => {
          for (let date of this.dates){
            console.log(values);
            console.log(date);
            let event = {}
            event.title =`${values.classOrOneByOne.label}`
            event.start = moment(date).format('YYYY-MM-DD')+' '+moment(values.startTime).format('HH:mm:ss')
            event.end = moment(date).format('YYYY-MM-DD')+' '+moment(values.endTime).format('HH:mm:ss')
            events.push(event)
           /* console.log('dateString',moment(date).format('YYYY-MM-DD'))
            console.log('timeString',moment(values.startTime).format('HH:mm:ss'))
           console.log('datetimeString',moment(date).format('YYYY-MM-DD')+' '+moment(values.startTime).format('HH:mm:ss'));*/
          }
        })
       console.log(events);


        //this.$emit('ok')
      },

      submitToView() {
        let self = this;
        let events = [];
        self.form.validateFields((errors, values) => {
          for (let date of this.dates){
            console.log(values);
            console.log(date);
            let event = {}
            event.title =`${values.classOrOneByOne.label}`
            event.start = moment(date).format('YYYY-MM-DD')+' '+moment(values.startTime).format('HH:mm:ss')
            event.end = moment(date).format('YYYY-MM-DD')+' '+moment(values.endTime).format('HH:mm:ss')
            events.push(event)
            /* console.log('dateString',moment(date).format('YYYY-MM-DD'))
             console.log('timeString',moment(values.startTime).format('HH:mm:ss'))
            console.log('datetimeString',moment(date).format('YYYY-MM-DD')+' '+moment(values.startTime).format('HH:mm:ss'));*/
          }
        })
        console.log(events);
        this.viewMdl.events = events
        this.viewVisible = true;

        //this.$emit('ok')
      },

      viewCancel(){
        this.viewVisible = false;
      },
      viewSubmit(){
        this.viewVisible = false;
      },
    }
  }
</script>
