<template>
  <div>
    <a-table bordered :pagination="false" :data-source="datas" :columns="columns">
      <span slot="number" slot-scope="text, record">
          <a-input-number name="inputNumber"  :min="1" :max="100000" :default-value="text" :step="1" />
      </span>
      <span slot="totalPrice"  slot-scope="text,record">
          <a-input :default-value="text" name="inputMoney" prefix="￥" suffix="RMB" />
      </span>
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:;"  @click="handleAdd">增加</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          v-if="datas.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a href="javascript:;" ref="delete" :disabled="datas.length<2">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>

  export default {
    components: {

    },
    props:{
      datas: {
        type: Array,
        default() {
          return [{
            key:this.key,
            number: 1,
            totalPrice: 100
          }];
        }
      },

    },
    data() {
      return {
        payJson:[],
        key:0,
        columns: [
          {
            title: '课时（节）',
            dataIndex: 'number',
            width:'30%',
            scopedSlots: { customRender: 'number' },
          },
          {
            title: '总价（元）',
            dataIndex: 'totalPrice',
            width:'35%',
            scopedSlots: { customRender: 'totalPrice' },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width:'35%',
            scopedSlots: { customRender: 'operation' },
          },
        ],
      };
    },
    created() {
      this.$nextTick(()=>{

      })
    },
    mounted() {
    },
    methods: {
      onDelete(key) {
        const datas = [...this.datas];
        this.datas = datas.filter(item => item.key !== key);
      },
      handleAdd() {
        const { datas } = this;
        this.key = this.key+1;
        const newData = {
          key:this.key,
          number: 1,
          totalPrice: 100
        };
        this.datas = [...datas, newData];
      },
      getPayJson(){
        let numbers = [];
        let totalPrices = [];
        document.getElementsByName('inputNumber').forEach((v, key) => {
          console.log(v.value)
          numbers.push(v.value);
        })
        document.getElementsByName('inputMoney').forEach((v, key) => {
          console.log(v.value)
          totalPrices.push(v.value)
        })

        this.payJson=[];
        let i=0;
        for(i=0;i<numbers.length;i++){
          const o = {}
          o.number = numbers[i];
          o.totalPrice = totalPrices[i];
          o.key=Math.random();
          this.payJson.push(o);
        }
        console.log(this.payJson);
      }
    },
  };
</script>
<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>
