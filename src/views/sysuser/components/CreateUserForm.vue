<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="用户表单"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item label="用户账号">
          <a-input v-decorator="['userName',{rules: [{required: true, min: 2, message: '请输入至少两个字符的用户名！'}]}]"
                   placeholder="请输入用户名" :disabled="model && model.id > 0">
            <a-icon slot="prefix" type="user"/>
            <a-tooltip slot="suffix" title="用户登录账号，建议手机号码">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)"/>
            </a-tooltip>
          </a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-decorator="['password', {rules: [{required: false, min: 6, message: '请输入至少6个字符'}]}]"
                            :placeholder="this.model.id!==undefined?'可以不输入，输入密码即修改以前的密码':'请输入密码'"/>
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input v-decorator="['mobile', {rules: [{required: true, min: 2, message: '请输入至少两个字符的规则描述！'}]}]">
            <a-icon slot="prefix" type="phone"/>
          </a-input>
        </a-form-item>
        <a-form-item label="角色">
          <a-row>
            <a-col :span="18">
              <a-select
                v-decorator="['newRoles', { rules: [{required: true,message: '请选择角色'}] }]"
                mode="multiple"
                style="width: 100%"
                placeholder="选择角色"
                option-label-prop="label"
              >
                <a-select-option v-for="(item,index) in model.roles" :value="item.id" :label="item.realName" :key="index">
                  {{item.realName}}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6" style="padding-left: 17px">
              <a-button type="primary" @click="toAddRole">
                新增
              </a-button>
            </a-col>
          </a-row>

        </a-form-item>
        <a-form-item label="用户姓名">
          <a-input v-decorator="['realName', {rules: [{required: true, min: 2, message: '请输入至少两个字符的姓名！'}]}]"/>
        </a-form-item>
        <a-form-item label="职位">
          <a-input v-decorator="['position',{rules: [{required: false, min: 2, message: '请输入至少两个字符的规则描述！'}]}]"/>
        </a-form-item>


        <a-form-item label="状态">
          <a-radio-group button-style="solid" v-decorator="['isLock', { initialValue: model.isLock != undefined?(model.isLock+''):'false' }]">
            <a-radio-button value='false'>
              可用
            </a-radio-button>
            <a-radio-button value='true'>
              禁用
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
  const fields = ['userName', 'realName', 'id', 'password', 'position', 'mobile', 'newRoles']

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
        if(!this.model.id||this.model.id < 1){
          if(!this.form.getFieldValue('password')){
            this.$notification.error({
              message: '错误提示',
              description: '密码必需要填写.'
            })
            return
          }
        }
        this.$emit('ok')
      },
      toAddRole(){
        this.$router.push({path:'/sysusermanager/usermanage/roleSetting'})
      }
    }
  }
</script>
