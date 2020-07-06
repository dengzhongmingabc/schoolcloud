<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="修改URL"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item label="主键ID">
          <a-input v-decorator="['id', { initialValue: model.id }]" disabled />
        </a-form-item>
        <a-form-item label="标题">
          <a-input  v-decorator="['title',{ initialValue: model.title }, {rules: [{required: true, message: '名称不能为空！'}]}]" />
        </a-form-item>
        <a-form-item label="组件">
          <a-input v-decorator="['component', { initialValue: model.component },{rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', { initialValue: model.name },{rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="跳转">
          <a-input v-decorator="['redirect', { initialValue: model.url },{rules: [{required: true, message: 'URL不能为空！'}]}]" />
        </a-form-item>
        <a-form-item label="图标">
          <a-input v-decorator="['icon', { initialValue: model.icon },{rules: [{required: false}]}]" />
        </a-form-item>

        <a-form-item v-show="false" label="isLeaf">
          <a-input v-decorator="['isLeaf', { initialValue: model.isLeaf }]" disabled />
        </a-form-item>
        <a-form-item v-show="false" label="parentId">
          <a-input v-decorator="['parentId', { initialValue: model.parentId }]" disabled />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['description', 'id']

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
      form: this.$form.createForm(this)
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
  }
}
</script>
