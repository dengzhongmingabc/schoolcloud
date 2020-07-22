<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="新建URL"
    destroyOnClose
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="类型">
          <a-radio-group button-style="solid" @change="changeBtn" v-decorator="['isLeaf',{ initialValue: isbutton }]">
            <a-radio-button value='false'>
              页面
            </a-radio-button>
            <a-radio-button value='true'>
              按钮
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="标题">
          <a-input  v-decorator="['title',{rules: [{required: true, message: '标题不能为空！'}]}]" />
        </a-form-item>
        <a-form-item v-if="isbutton=='false'" label="组件">
          <a-input v-decorator="['component',{rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="路径">
          <a-input v-decorator="['redirect',{rules: [{required: true, message: 'URL不能为空！'}]}]" />
        </a-form-item>
        <a-form-item label="图标">
          <a-input v-decorator="['icon',{rules: [{required: false}]}]" />
        </a-form-item>

        <a-form-item v-show="false" label="parentId">
          <a-input v-decorator="['parentId',{ initialValue: model&&model.parentId}]" disabled />
        </a-form-item>

        <a-form-item label="显示">
          <a-radio-group button-style="solid" v-decorator="['isShow',{ initialValue: 'true' }]">
            <a-radio-button value='true'>
              显示
            </a-radio-button>
            <a-radio-button value='false'>
              隐藏
            </a-radio-button>
          </a-radio-group>
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
      form: this.$form.createForm(this),
      isbutton:'true'
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
    changeBtn(){
      if(this.isbutton=='true'){
        this.isbutton='false'
        return
      }
      if(this.isbutton=='false'){
        this.isbutton='true'
        return
      }
    }
  }
}
</script>
