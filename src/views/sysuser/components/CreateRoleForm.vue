<template>
  <a-modal
    :maskClosable="false"
    title="角色编辑"
    :width="840"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { this.selectSchool=false;$emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="角色名称">
          <a-input v-decorator="['roleName', { initialValue: model && model.roleName },{rules: [{required: true, min: 2, message: '请输入至少两个字符的规则描述！'}]}]" />
        </a-form-item>
        <a-form-item label="状态">
            <a-radio-group button-style="solid" v-decorator="['invalid', { initialValue: model.invalid?(model.invalid+''):'true' }]">
              <a-radio-button value='true'>
                有效
              </a-radio-button>
              <a-radio-button value='false'>
                无效
              </a-radio-button>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="所属校区">
          <a-row>
            <a-col :span="12">
              <a-radio-group button-style="solid" v-decorator="['selectType', { initialValue: '1' }]">
                <a-radio-button value='1'>
                  所有校区
                </a-radio-button>
                <a-radio-button value='2'>
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['description', 'id','selectedSchool','selectType']

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
      default: () => {}
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods:{

  }
}
</script>
