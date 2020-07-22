<template>
  <page-header-wrapper>
    <a-form :form="form" v-bind="formLayout">
      <a-card :bordered="false" class="parent" style="margin-bottom: 8px;height: 60px;">
        <a-row>
          <a-col :span="8">
            <a-button type="primary">
              <a-icon type="left-circle"/>
              返回
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <a-card title="学生信息" :bordered="false" style="margin-bottom: 8px;">
        <a-select
          slot="extra"
          show-search
          label-in-value
          :value="value"
          placeholder="请输入名称或者手机号码"
          style="width: 200px"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          @search="fetchUser"
          @change="handleChange"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
          <a-select-option v-for="(da,index) in data" :key="da.id">
            {{ da.studentName }}
          </a-select-option>
        </a-select>

        <div class="studentInfo">
          <span class="studentName">
            {{studentInfo.studentName?studentInfo.studentName:''}}
          </span>
          <span class="mobile">
            {{studentInfo.mobile?studentInfo.mobile:''}}
          </span>
          <span class="mobile">
            {{studentInfo.seekPerson?'('+seekPersonMap[studentInfo.seekPerson].text+')':''}}
          </span>
        </div>
      </a-card>

      <a-card title="课程与班级" :bordered="false" style="margin-bottom: 8px;height: 590px;">
        <div slot="extra">
          <a-button type="primary" style="margin-left: 10px">
            选择课程
          </a-button>
          <a-button type="primary" style="margin-left: 10px">
            选择班级
          </a-button>
        </div>
        <a-table :columns="columns" :data-source="tableData" bordered :pagination="false">
          <template slot="name" slot-scope="text">
            <a>{{ text }}</a>
          </template>

          <a-select default-value="lucy" slot="price" style="width: 120px" @change="handleChange">
            <a-select-option value="jack">
              Jack
            </a-select-option>

            <a-select-option value="Yiminghe">
              yiminghe
            </a-select-option>
          </a-select>

          <a-input-number :min="1" :max="100000" slot="number" :default-value="1" @change="onChange" />


          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" @click="handleAdd">增加</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              v-if="tableData.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record.key)"
            >
              <a href="javascript:;" ref="delete" :disabled="tableData.length<2">删除</a>
            </a-popconfirm>
          </template>

          <template slot="title" slot-scope="currentPageData">
            钢琴
          </template>
          <template slot="footer" slot-scope="currentPageData">
            合计
          </template>
        </a-table>


      </a-card>

      <a-card :bordered="false" style="margin-bottom: 8px;height: 60px;">
      </a-card>

      <a-card :bordered="false" style="margin-bottom: 8px;height: 190px;">
      </a-card>
    </a-form>
  </page-header-wrapper>
</template>

<script>
  import debounce from 'lodash/debounce';
  import {marketStudentList} from '@/api/market'

  const columns = [
    {
      title: '收费项目',
      dataIndex: 'name',
    },
    {
      title: '收费模式',
      dataIndex: 'price',
      scopedSlots: {customRender: 'price'},
    },
    {
      title: '数量',
      dataIndex: 'number',
      scopedSlots: {customRender: 'number'},
    },
    {
      title: '优惠',
      dataIndex: 'prefer',
    },
    {
      title: '小计',
      dataIndex: 'mintotal',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '35%',
      scopedSlots: {customRender: 'operation'},
    },
  ];
  const tableData = [
    {
      key: '1',
      name: '课程费用',
      price: 200,
      number: '1',
      prefer: '100',
      mintotal: '100',
    },
    {
      key: '2',
      name: '教材费用',
      price: 200,
      number: '1',
      prefer: '100',
      mintotal: '100',
    },

  ];
  export default {
    data() {
      this.formLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 20}
        }
      }
      this.lastFetchId = 0;
      this.fetchUser = debounce(this.fetchUser, 800);
      return {
        tableData,
        columns,
        count: 5,
        data: [],
        value: [],
        fetching: false,
        studentInfo: {},
        seekPersonMap: {1: {text: '母亲'}, 2: {text: '父亲'}, 3: {text: '本人'}, 4: {text: '其它'}},
        seekModelMap: {1: {text: '来电'}, 2: {text: '来访'}, 3: {text: '网络'}, 4: {text: '其它'}},
        statusMap: {1: {text: '待跟进'}, 2: {text: '跟进中'}, 3: {text: '已邀约'}, 4: {text: '已邀约'}, 5: {text: '已失效'}},
        sexMap: {1: {text: '男'}, 2: {text: '女'}, 3: {text: '未知'}},
      };
    },
    methods: {
      fetchUser(value) {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.data = [];
        this.fetching = true;
        this.value = []
        marketStudentList().then(res => {
          console.log(res);
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            console.log(fetchId, this.lastFetchId)
            return;
          }
          const data = res.result.filter(item => item.studentName.indexOf(value) > -1);
          this.data = data;
          this.fetching = false;
        });
      },
      handleChange(value) {
        const students = this.data.filter(item => item.id == value.key);
        this.studentInfo = students[0];
        Object.assign(this, {
          value,
          data: [],
          fetching: false,
        });
      },
      onDelete(key) {
        const tableData = [...this.tableData];
        this.tableData = tableData.filter(item => item.key !== key);
      },
      handleAdd() {
        const {count, tableData} = this;
        const newData = {
          key: '3',
          name: '教材费用',
          price: 200,
          number: '1',
          prefer: '100',
          mintotal: '100',
        }
        this.tableData = [...tableData, newData];
        this.count = count + 1;
      },
    },
  };
</script>

<style scoped>
  .parent {

  }

  .parent >>> .ant-card-body {
    padding: 15px 24px 0px;
  }

  #course-card >>> .ant-card-body {
    padding: 0px;
  }

  .studentInfo {
    font-size: 14px;
    font-family: 微软雅黑;
    margin-top: 6px;
    font-weight: bold;
  }

  .mobile {
    font-size: 10px;
    font-weight: normal;
  }


</style>