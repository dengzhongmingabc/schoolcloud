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
        <a-card title="基本信息" :bordered="false">
          <a-form-item v-show="false" label="主键ID">
            <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
          </a-form-item>
          <a-form-item label="学员名称">
            <a-input v-decorator="['studentName',{rules: [{required: true, min: 2, message: '请输入至少两个字符的名称！'}]}]"
                     placeholder="学员名称">
            </a-input>
          </a-form-item>
          <a-form-item label="联系电话">
            <a-input-group compact>
              <a-select  style="width: 120px" v-decorator="['seekPerson',{ initialValue: '1'  }, { rules: [{required: true,message: '请选择代理人'}] }]" placeholder="代理人">
                <a-select-option value="1">
                  母亲
                </a-select-option>
                <a-select-option value="2">
                  父亲
                </a-select-option>
                <a-select-option value="3">
                  本人
                </a-select-option>
                <a-select-option value="4">
                  其它
                </a-select-option>
              </a-select>
              <a-input style="width: 50%" v-decorator="['mobile',{rules: [{required: true, min: 2, message: '请输入联系电话！'}]}]" placeholder="联系电话" />
            </a-input-group>

          </a-form-item>
          <a-form-item label="性别">
            <a-radio-group v-decorator="['studentSex', { initialValue: 1 }]">
              <a-radio :value="1">
                男
              </a-radio>
              <a-radio :value="2">
                女
              </a-radio>
              <a-radio :value="3">
                未知
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="介绍人">
            <a-input v-decorator="['introduce',{rules: [{required: true, message: '请输入介绍人！'}]}]"
                     placeholder="介绍人">
            </a-input>
          </a-form-item>
        </a-card>
        <a-card title="咨询信息" :bordered="false">
          <a-form-item label="咨询方式">
            <a-radio-group button-style="solid" v-decorator="['seekModel', { initialValue: '1'  }]">
              <a-radio-button value="1">
                来电
              </a-radio-button>
              <a-radio-button value="2">
                来访
              </a-radio-button>
              <a-radio-button value="3">
                网络
              </a-radio-button>
              <a-radio-button value="4">
                其它
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="意向课程">
            <a-row>
              <a-col :span="10">
                <a-select
                  v-decorator="['seekCourse', { rules: [{required: true,message: '请选择意向课程'}] }]"
                  placeholder="意向课程"
                  mode="multiple"
                >
                  <a-select-option v-for="(item,index) in model.courses" :value="item.id" :label="item.name" :key="index">
                    {{item.name}}
                  </a-select-option>
                </a-select>
              </a-col>

              <a-col :span="14">
                <a-form-item label="意向程度" style="margin-bottom: 0px;margin-left: 5px;">
                  <a-rate  v-model="seekDepth"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item label="跟进状态">
            <a-row>
              <a-col :span="6">
                <a-select v-decorator="['status', { initialValue: '1'}]" placeholder="跟进状态">
                  <a-select-option value="1">
                    待跟进
                  </a-select-option>
                  <a-select-option value="2">
                    跟进中
                  </a-select-option>
                  <a-select-option value="3">
                    已邀约
                  </a-select-option>
                  <a-select-option value="4">
                    已试听
                  </a-select-option>
                  <a-select-option value="5">
                    已失效
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="沟通内容">
            <a-textarea
              v-decorator="['talkMark']"
              placeholder="沟通内容"
              :auto-size="{ minRows: 8, maxRows: 8 }"
            />
          </a-form-item>
        </a-card>
        <a-card title="其它信息" :bordered="false">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="咨询校区" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-select v-decorator="['seekSchoolId', {rules: [{ required: false, message: 'Please select your gender!' }]} ]">
                  <a-select-option v-for="(item,index) in model.schools" :value="item.id" :label="item.name" :key="index">
                    {{item.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="录入人" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-input v-decorator="[ 'creater', {rules: [{ required: false, message: 'Please input your note!' }]}]" disabled/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="主销售人" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-select
                  v-decorator="['marketPersonFirstId',{rules: [{ required: false, message: 'Please select your gender!' }]}]" >
                  <a-select-option v-for="(item,index) in model.users" :value="item.id" :label="item.realName" :key="index">
                    {{item.realName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="副销售人" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-select
                  v-decorator="[  'marketPersonSecondId', {rules: [{ required: false, message: 'Please select your gender!' }]} ]">
                  <a-select-option v-for="(item,index) in model.users" :value="item.id" :label="item.realName" :key="index">
                    {{item.realName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import notification from "ant-design-vue/lib/notification";
  import ARate from 'ant-design-vue/lib/rate';
  import 'ant-design-vue/dist/antd.css';

  // 表单字段
  const fields = ['studentName', 'seekPerson','mobile','id','studentSex','introduce','forbidden','seekDepth','seekModel','seekCourse','status','talkMark','seekSchoolId','creater','marketPersonFirstId','marketPersonSecondId']

  export default {
    components: {
      ARate
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
          sm: {span: 20}
        }
      }
      return {
        form: this.$form.createForm(this),
        value: [],
        seekDepth: 3,
        talkMark:''
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
      }
    }
  }
</script>

<style scoped>
  .ant-rate {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum';
    display: inline-block;
    margin: 0;
    padding: 0;
    color: #fadb14;
    font-size: 20px;
    line-height: 20px;
    list-style: none;
    outline: none;
  }

  .ant-rate[data-v-08315b97] {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum';
    display: inline-block;
    margin: 0;
    padding: 0;
    color: #fadb14;
    font-size: 20px;
    line-height: 20px;
    list-style: none;
    outline: none;
    margin-left: 5px;
  }

</style>
