<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="表单"
    :width="640"
    :visible="visible"
    :confirmLoading="loading1"
    @ok="submit"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading1">

      <template>
          <div>
            <div style="margin-bottom: 16px">
                <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `已选择 ${selectedRowKeys.length}` }}
              </template>
            </span>
          </div>
          <a-table
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="data"
            :pagination="false"
          >
            <span slot="teacher" slot-scope="cellData">
          {{cellData.realName}}
      </span>
            <span slot="teachCourse" slot-scope="cellData">
          {{cellData.name}}
      </span>
          </a-table>
        </div>
      </template>

    </a-spin>
  </a-modal>
</template>

<script>
  import {classesSave, classesDelete, classesList, classesQuery, classesEdit} from '@/api/teach'
  const columns = [
    {
      title: '班级名称',
      dataIndex: 'name',
    },
    {
      title: '所属课程',
      dataIndex: 'teachCourse',
      scopedSlots: {customRender: 'teachCourse'}
    },
    {
      title: '老师名称',
      dataIndex: 'teacher',
      scopedSlots: {customRender: 'teacher'}
    }
  ];

 const data = [];
  /*for (let i = 0; i < 46; i++) {
   data.push({
     key: i,
     name: `Edward King ${i}`,
     age: 32,
     address: `London, Park Lane no. ${i}`,
   });
 }*/

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      loading1: {
        type: Boolean,
        default: () => false
      },
      model: {
        type: Object,
        default: () => {}
      },
    },
    data() {
      return {
        data:[],
        columns,
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
      };
    },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0;
      },
    },
    created() {
      let requestParameters = {}
      classesList(requestParameters).then(res => {
        console.log("res.result",res.result)
        this.data = res.result
      })
    },
    methods: {
      submit() {
        this.$emit('ok')
      },
      start() {
        this.loading = true;
        // ajax request after empty completing
        setTimeout(() => {
          this.loading = false;
          this.selectedRowKeys = [];
        }, 1000);
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
      },
    },
  };
</script>
