<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="表单"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="false" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item label="类型名称">
          <a-input v-decorator="['name',{rules: [{required: true, min: 2, message: '请输入至少两个字符的类型名称！'}]}]"
                   placeholder="请输入名称">
          </a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group button-style="solid"   v-decorator="['forbidden', { initialValue: model.forbidden != undefined?(model.forbidden+''):'false' }]">
            <a-radio-button value='false'>
              有效
            </a-radio-button>
            <a-radio-button value='true'>
              无效
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

  // 表单字段
  const fields = ['name', 'id']

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
