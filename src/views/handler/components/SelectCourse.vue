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

      <template>
        <a-transfer
          :data-source="mockData"
          show-search
          :filter-option="filterOption"
          :target-keys="targetKeys"
          :render="item => item.title"
          @change="handleChange"
          @search="handleSearch"
        />
      </template>

    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import notification from "ant-design-vue/lib/notification";
  import ATransfer from 'ant-design-vue/lib/transfer';
  import 'ant-design-vue/dist/antd.css';
  import {courseList} from '@/api/teach'
  // 表单字段
  const fields = ['name', 'id']

  export default {
    components: {
      ATransfer
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

        mockData: [],
        targetKeys: [],

        targetDatas:[]
      }
    },
    mounted() {
      this.getMock();
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
      },

      getMock() {
        const targetKeys = [];
        var mockData = [];
        /*for (let i = 0; i < 20; i++) {
          const data = {
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: Math.random() * 2 > 1,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }*/
        courseList().then((response)=>{
          for(let data of response.result){
            let d = {};
            d.title = data.name;
            d.key = data.id.toString();
            d.description = data.name
            d.payModel = data.payModel
            mockData.push(d);
          }
        })
        this.mockData = mockData
        this.targetKeys = targetKeys;

      },
      filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
      },
      handleChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.targetKeys = targetKeys;
        this.targetDatas = this.mockData.filter(item => targetKeys.includes(item.key));
        console.log(this.targetDatas)
      },
      handleSearch(dir, value) {
        console.log('search:', dir, value);
      },
    }
  }
</script>
