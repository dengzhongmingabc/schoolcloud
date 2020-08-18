<template>
  <a-card>
    <div>

      <div
        class="tables"
      >
        <div style="width: 1000px" id="pdfDom">
          <p align="center" class="title">业务凭证</p>
          <div style="width: 100%;margin-bottom: 10px;">
            <div style="width: 35%;float: left;font-weight:bold">学员姓名 :{{mdl.marketStudent.studentName}} </div>
            <div style="width: 35%;float: left;font-weight:bold">订单号:{{mdl.orderNo}} </div>
            <div style="width: 30%;float: right;font-weight:bold">经办日期:{{mdl.createdDate}}</div>
          </div>
          <table class="table" id="printpdf">
            <div style="padding:0 0 0 0;border: white solid 0px" v-for="(item,index) in mdl.orderContent">
              <tr >
                <td colspan="2" width="220">课程名</td>
                <td colspan="2" width="220">班级名</td>
                <td colspan="2" width="220">上课时间</td>
                <td colspan="2" width="200">价格</td>
                <td colspan="2" width="170">优惠</td>
                <td colspan="2" width="170">应收</td>
              </tr>
              <tr>
                <td colspan="2" width="200">{{item[0].xname}}</td>
                <td colspan="2" width="170"></td>
                <td colspan="2" width="170"></td>
                <td colspan="2" width="170">{{`${item[0].priceCurrent}X${item[0].number}`}}</td>
                <td colspan="2" width="170">{{item[0].prefer}}</td>
                <td colspan="2" width="170">{{item[0].mintotal}}</td>
              </tr>
              <tr>
                <td colspan="12" width="300">教材杂费：{{feeToString(item)}}</td>
              </tr>
              <tr>
                <td colspan="12" width="300">备注：</td>
              </tr>
            </div>

            <div>
              <tr>
                <td colspan="3" width="200">应收款：{{mdl.orderMoney}}</td>
                <td colspan="3" width="270">实收款：{{mdl.getOrderMoneyReality}}</td>
                <td colspan="3" width="270">使用余额:{{0}}</td>
                <td colspan="3" width="270">欠款:{{mdl.oweUp}}</td>
              </tr>
            </div>

          </table>
          <div style="width: 100%;margin-bottom: 10px;">
            <div style="width: 30%;float: left;font-weight:bold">经办人签字:</div>
            <div style="width: 35%;float: left;font-weight:bold">客户签字:</div>
          </div>
        </div>
        <div style="width: 100%;margin: 10px;text-align: center">
          <a-button v-print="'#pdfDom'" type="primary" style="margin-right: 10px">打印</a-button>
          <a-button @click="receipt(billNo)" type="primary" style="margin-right: 10px">查看学员信息</a-button>
          <a-button @click="receipt(billNo)" type="primary" style="margin-right: 10px">查看订单</a-button>
          <a-button @click="()=>this.$router.push({name:'handler'})" type="primary" >返回办理中心</a-button>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
  export default {
    name: 'BillPrint',
    data () {
      return {

        mdl:{}

        }
    },
    methods: {

      feeToString(item){
        let feeString = '';
        for(let index=1;index<item.length;index++){
          feeString += `${item[index].xname}(${item[index].price}元)x${item[index].number}=${item[index].mintotal}元;`
        }
        return feeString
      },
      print(){
        this.$print(this.$refs.printMe)
      }
    },
    created () {
      this.mdl = this.$route.params.record
    }
  }
</script>

<style scoped>
  .table p {
    text-align: center;
    margin: 10px 0;
    color: #000c17;
    font-size: 18px;
  }
  .table{
    border-style: solid;
    border-width: 1.0pt;
    font-variant: normal;
  }
  td{
    border-style: solid;
    border-width: 1.0pt;
  }
  .centent > p{
    float: left;
    font-size: 18px;
    font-variant: normal;
    color: #000c17;
  }
  .tables{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #pdfDom{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title{
    font-size: 30px;
    font-variant: normal;
  }
</style>