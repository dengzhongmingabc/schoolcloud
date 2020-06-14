<template>
  <a-modal
    title="新建URL"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-if="model && model.key > 0" label="主键ID">
          <a-input v-decorator="['key', { initialValue: model && model.key }]" disabled />
        </a-form-item>
        <a-form-item label="名称">
          <a-input  v-decorator="['permissionName',{ initialValue: model &&model.name }, {rules: [{required: true, message: '名称不能为空！'}]}]" />
        </a-form-item>
        <a-form-item label="URL">
          <a-input v-decorator="['permissionUrl', { initialValue: model &&model.url },{rules: [{required: true, message: 'URL不能为空！'}]}]" />
        </a-form-item>
        <a-form-item label="ICON">
          <a-input v-decorator="['icon', { initialValue: model &&model.icon },{rules: [{required: false}]}]" />
        </a-form-item>
        <a-form-item v-show="false" label="isLeaf">
          <a-input v-decorator="['isLeaf', { initialValue: model &&model.isLeaf },{ initialValue: false }]" disabled />
        </a-form-item>
        <a-form-item v-show="false" label="parentId">
          <a-input v-decorator="['parentId', { initialValue: model &&model.parentId },{ initialValue: -1 }]" disabled />
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
