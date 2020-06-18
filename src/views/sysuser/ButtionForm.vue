<template>
  <a-modal
    title="Title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            v-decorator="[
          '按钮名',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]"
            placeholder="请按钮名"
          >
          </a-input>
        </a-form-item>
        <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
          <a-input
            v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
            type="password"
            placeholder="Password"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" >
            Log in
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  export default {
    name:'ButtonForm',
    props:{
      visible: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
      };
    },
    mounted() {

    },
    methods: {

    },
  };
</script>