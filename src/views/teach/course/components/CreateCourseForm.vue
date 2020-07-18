<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="表单"
    :width="740"
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
            <a-form-item label="课程名称">
              <a-input v-decorator="['name',{rules: [{required: true, min: 2, message: '请输入至少两个字符的课程名称！'}]}]"
                       placeholder="请输入名称">
              </a-input>
            </a-form-item>
            <a-form-item label="课程类型">
              <a-row>
                <a-col :span="18">
                  <a-select
                    v-decorator="['typeId', { rules: [{required: true,message: '请选择课程类型'}] }]"
                    style="width: 100%"
                    placeholder="选择课程类型"
                    option-label-prop="label"
                  >
                    <a-select-option v-for="(item,index) in model.types" :value="item.id" :label="item.name" :key="index">
                      {{item.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="6" style="padding-left: 17px">
                  <a-button type="primary" @click="toAddType">
                    新增
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="所属校区">
              <a-row>
                <a-col :span="12">
                  <a-radio-group button-style="solid" v-decorator="['selectType', { initialValue: '1' }]">
                    <a-radio-button value="1">
                      所有校区
                    </a-radio-button>
                    <a-radio-button value="2">
                      部分校区
                    </a-radio-button>
                  </a-radio-group>
                </a-col>
                <a-col :span="12">
                  <a-select
                    v-show="form.getFieldValue('selectType') === '2'"
                    v-decorator="['selectedSchool', { rules: [{required: false}] }]"
                    mode="multiple"
                    style="width: 100%"
                    placeholder="指定校区"
                    option-label-prop="label"
                  >
                    <a-select-option v-for="(item,index) in model.schools" :value="item.id" :label="item.name" :key="index">
                      {{item.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="教学模式">
              <a-radio-group v-decorator="['teachType', { initialValue: 1 }]">
                <a-radio :value="1">
                  一对一
                </a-radio>
                <a-radio :value="2">
                  班级
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-card>
        <a-card title="收费模式" :bordered="false">

            <a-row>
              <a-form-item label="按课时">
              <a-col>
                <a-switch v-model="swft" checked-children="开" un-checked-children="关" v-decorator="['switch']"/>
              </a-col>
              <a-col v-show="swft">
                <PayTable ref="payTable" :datas="model.payModel&&model.payModel.data"></PayTable>
              </a-col>
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item label="按课时">
              <a-col>
                <a-switch checked-children="开" un-checked-children="关" default-checked />
              </a-col>
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item label="按课时">
              <a-col>
                <a-switch checked-children="开" un-checked-children="关" default-checked />
              </a-col>
              </a-form-item>
            </a-row>
        </a-card>

        <a-form-item label="状态">
          <a-radio-group button-style="solid"   v-decorator="['forbidden', { initialValue: model.forbidden != undefined?(model.forbidden+''):'false' }]">
            <a-radio-button value='false'>
              开售
            </a-radio-button>
            <a-radio-button value='true'>
              下架
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import notification from "ant-design-vue/lib/notification";
  import PayTable from './PayTable'
  // 表单字段
  const fields = ['name','typeId', 'selectType','selectedSchool','id','teachType']

  export default {
    components: {
      PayTable
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
          sm: {span: 18}
        }
      }
      return {
        form: this.$form.createForm(this),
        value: [],
        swft:true,

        payJson:[]
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
        this.$refs.payTable.getPayJson()
        let payJson = {}
        payJson.payType = 1;//先固定1
        payJson.data = this.$refs.payTable.payJson
        this.payJson = payJson;
        this.$emit('ok')
      },
      toAddType(){
        this.$router.push({path:'/teach/course/courseTypeSetting'})
/*        //父组件 取子组件值
        console.log(this.$refs.payTable.dataSource);
        //取得父组件
        this.$parent

        console.log(this.$refs.test.cdata);

        //调用子件的方法
        this.$refs.payTable.cmethod()*/
      }
    }
  }
</script>
