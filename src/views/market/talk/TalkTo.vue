<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="学生姓名">
                <a-input v-model="queryParam.studentName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="联系电话">
                <a-input v-model="queryParam.mobile" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="沟通日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="经办校区">
                  <a-select v-model="queryParam.school" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">誉飞画室</a-select-option>
                    <a-select-option value="2">誉飞武馆</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="沟通人">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">李教师</a-select-option>
                    <a-select-option value="2">赵教师</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <!--<a-button type="primary" icon="plus" @click="handleAdd()">批量分配</a-button>
        <a-button type="primary" icon="plus" @click="handleAdd()">批量导入</a-button>-->
      </div>
      <s-table
        :scroll="{ x: 1300 }"
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="您确定要删除吗?"
              @confirm="() => classesDeleteF(record)"
            >
              <a href="javascript:;" ref="classesDelete">删除</a>
              </a-popconfirm>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>


<script>
  import moment from 'moment'
  import {STable, Ellipsis} from '@/components'
  import {marketMarketToPageList} from '@/api/marketTalkTo.js'
  import ARate from 'ant-design-vue/lib/rate';
  import 'ant-design-vue/dist/antd.css';

  const columns = [
    {
      title: '学员姓名',
      dataIndex: 'studentName',
      fixed: 'left',
      width: '100px',
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      //needTotal: true,
      width: '100px',
    },
    {
      title: '沟通类型',
      dataIndex: 'type',
      width: '100px',
    },
    {
      title: '经办校区',
      width: '100px',
      dataIndex: 'school',
    },
    {
      title: '沟通人',
      dataIndex: 'personId',
      width: '100px',
    },
    {
      title: '沟通时间',
      dataIndex: 'createdDate',
      width: '150px',
    },
    {
      title: '沟通内容',
      dataIndex: 'content',
      width: '150px',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: {customRender: 'action'},
      fixed: 'right',
    }
  ]


  export default {
    name: 'TableList',
    components: {
      STable,
      Ellipsis,
      ARate
    },
    data() {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: {roles: []},
        roleListData: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters:', requestParameters)
          console.log(requestParameters['studentName']);
          let search = '';
          if (requestParameters['studentName']) {
            search += ' and student_name like \'%' + requestParameters['studentName'] + '%\''
          }
          if (requestParameters['forbidden']) {
            search += ' and forbidden=' + requestParameters['forbidden']
          }
          requestParameters.search = search;
          return marketMarketToPageList(requestParameters).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: [],

      }
    },
    filters: {
      statusFilter(type) {
        return statusMap[type].text
      },
      statusTypeFilter(type) {
        return statusMap[type].status
      }
    },
    created() {

    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {

      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm() {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
