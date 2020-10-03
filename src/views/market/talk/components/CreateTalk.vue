<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="表单"
    :width="840"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-card title="班级信息" :bordered="false">
          <a-form-item v-show="false" label="主键ID">
            <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
          </a-form-item>
          <a-form-item label="班级名称">
            <a-input v-decorator="['name',{rules: [{required: true, min: 2, message: '请输入至少两个字符的类型名称！'}]}]"
                     placeholder="请输入名称">
            </a-input>
          </a-form-item>
          <a-form-item label="所属课程">
                <a-select
                  v-decorator="['teachCourseId', { rules: [{required: true,message: '所属课程'}] }]"
                  style="width: 100%"
                  placeholder="选择所属课程"
                  option-label-prop="label"
                >
                  <a-select-option v-for="(item,index) in model.courses" :value="item.id" :label="item.name" :key="index"><!--v-for="(item,index) in model.types" :value="item.id" :label="item.name" :key="index" {{item.name}}-->
                    {{item.name}}
                  </a-select-option>
                </a-select>
          </a-form-item>
          <a-form-item label="满班人数">
            <a-input-number v-decorator="['personCount',{ initialValue: 1 },  { rules: [{required: true,message: '满班人数'}] }]"  :min="1" :max="100" @change=""/>
          </a-form-item>

          <a-form-item label="每次上课">
            学员扣除<a-input-number v-decorator="['studentDeleteCourses', { initialValue: 1 }, { rules: [{required: true,message: '扣除'}] }]" style="margin-right: 5px;margin-left: 5px" :min="1" :max="100"  @change=""/>节，
            老师加上<a-input-number v-decorator="['teacherAddCourses',{ initialValue: 1 }, { rules: [{required: true,message: '加上'}] }]" style="margin-right: 5px;margin-left: 5px" :min="1" :max="100"  @change=""/>节
          </a-form-item>


          <a-form-item label="招生状态">
            <a-select
              v-decorator="['status',{ initialValue: 1 }, { rules: [{required: true,message: '招生状态'}] }]"
              style="width: 100%"
              placeholder="招生状态"
              option-label-prop="label"
            >
              <a-select-option :value="1" label="开放"><!--v-for="(item,index) in model.types" :value="item.id" :label="item.name" :key="index" {{item.name}}-->
                开放
              </a-select-option>
              <a-select-option :value="2" label="关闭"><!--v-for="(item,index) in model.types" :value="item.id" :label="item.name" :key="index" {{item.name}}-->
                关闭
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="开班日期">
            <a-date-picker format="YYYY-MM-DD" v-decorator="['startDate', { rules: [{required: false,message: '开班日期'}] }]" @change="onStartDateChange" />
          </a-form-item>

          <a-form-item label="结班日期">
            <a-date-picker format="YYYY-MM-DD" v-decorator="['endDate', { rules: [{required: false,message: '结班日期'}] }]" @change="onEndDateChange" />
          </a-form-item>

          <a-form-item label="成班人数">
            <a-input-number v-decorator="['classPersonCount',{ initialValue: 1 }, { rules: [{required: false,message: '所属课程'}] }]" :min="1" :max="100" @change=""/>
          </a-form-item>
        </a-card>
        <a-card title="其它信息" :bordered="false">
          <a-form-item label="班主任">
            <a-select
              v-decorator="['teacherId', { rules: [{required: false,message: '班主任'}] }]"
              style="width: 100%"
              placeholder="班主任"
              option-label-prop="label"
            >
              <a-select-option v-for="(item,index) in model.users" :value="item.id" :label="item.realName" :key="index"><!--v-for="(item,index) in model.types" :value="item.id" :label="item.name" :key="index" {{item.name}}-->
                {{item.realName}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea
              v-decorator="['remark']"
              placeholder="备注"
              :auto-size="{ minRows: 8, maxRows: 8 }"
            />
          </a-form-item>
        </a-card>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import notification from "ant-design-vue/lib/notification";

  // 表单字段
  const fields = ['name', 'id','teachCourseId','personCount','studentDeleteCourses','teacherAddCourses','status','startDate','endDate','classPersonCount','teacherId','remark']

  export default {
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

        startDate:'',
        endDate:''
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
        this.$emit('ok')
      },
      onStartDateChange(date, dateString) {
        this.startDate = dateString
        console.log(dateString);
      },
      onEndDateChange(date, dateString) {
        this.endDate = dateString
        console.log(dateString);
      },
    }
  }
</script>
