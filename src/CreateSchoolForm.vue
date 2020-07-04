<template>
  <a-modal
    title="用户表单"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="学校名">
          <a-input v-decorator="['name',{rules: [{required: true, min: 2, message: '请输入至少两个字符的用户名！'}]}]" placeholder="请输入用户名">
          </a-input>
        </a-form-item>

        <a-form-item label="手机号码">
          <a-input v-decorator="['mobile', { initialValue: model && model.mobile },{rules: [{required: true, min: 2, message: '请输入至少两个字符的规则描述！'}]}]" >
            <a-icon slot="prefix" type="phone" />
          </a-input>
        </a-form-item>

        <a-form-item label="地址">
          <a-input v-decorator="['address',{rules: [{required: true, min: 2, message: '请输入至少两个字符的规则描述！'}]}]" />
        </a-form-item>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// 表单字段
const fields = ['name', 'mobile','address']

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
      default: () => null
    },
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
      value:[],
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
