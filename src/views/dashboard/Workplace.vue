<template>
  <page-header-wrapper>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            :body-style="{ padding: 0}">
            <!--            <a slot="extra">全部项目</a>-->
            <span slot="title" style="font-weight: bolder">待办事项</span>
            <div>

              <a-card-grid class="project-card-grid">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" style="backgroundColor:#87d068" icon="credit-card"></a-avatar>
                      <a>请假申请</a>
                    </div>
                    <div slot="description" class="card-description">
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">累积未审批数</a>
                    <span class="datetime">128件</span>
                  </div>
                </a-card>
              </a-card-grid>
              <a-card-grid class="project-card-grid">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">

                      <a-avatar size="small" style="backgroundColor:#87d068" icon="read"/>
                      <a>作业点评</a>
                    </div>
                    <div slot="description" class="card-description">
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">积累未点评作业</a>
                    <span class="datetime">25课</span>
                  </div>
                </a-card>
              </a-card-grid>
              <a-card-grid class="project-card-grid">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" style="backgroundColor:#87d068" icon="gift"/>
                      <a>待回访</a>
                    </div>
                    <div slot="description" class="card-description">
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">本月未回访数</a>
                    <span class="datetime">28人</span>
                  </div>
                </a-card>
              </a-card-grid>
              <a-card-grid class="project-card-grid">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" style="backgroundColor:#87d068" icon="carry-out"/>
                      <a>待记上课</a>
                    </div>
                    <div slot="description" class="card-description">
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">累积待记课数</a>
                    <span class="datetime">1节</span>
                  </div>
                </a-card>
              </a-card-grid>
              <a-card-grid class="project-card-grid">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" style="backgroundColor:#87d068" icon="schedule"/>
                      <a>课堂点评</a>
                    </div>
                    <div slot="description" class="card-description">
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">累积待点评</a>
                    <span class="datetime">67节</span>
                  </div>
                </a-card>
              </a-card-grid>
              <a-card-grid class="project-card-grid">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" style="backgroundColor:#87d068" icon="appstore"/>
                      <a>待排课</a>
                    </div>
                    <div slot="description" class="card-description">
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">累积待排课</a>
                    <span class="datetime">18节</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading="loading" :bordered="false">
            <span slot="title" style="font-weight: bolder">近一个月咨询量</span>
            <MyCharts id="highcharts" class="high" :option="option"></MyCharts>
          </a-card>
          <!--          <div   ref="abc" id="myChart"  style="width: 100%;height: 400px; background-color: white" >abc</div>-->

        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <span slot="title" style="font-weight: bolder">快速开始 / 便捷导航</span>
            <div class="item-group">
              <a>新建咨询</a>
              <a>报名续费</a>
              <a>记上课</a>
              <a>积分操作</a>
              <a>作业点评</a>
              <a>课堂点评</a>
              <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
            </div>
          </a-card>
          <a-card
            style="margin-bottom: 24px"
            :loading="radarLoading"
            :bordered="false"
            :body-style="{ padding: 0 }">
            <span slot="title" style="font-weight: bolder">平台更新动态</span>

            <ul class="list">
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
              <li>2020-10-02：系统全面更新系统全面更新系统全面更新</li>
            </ul>
          </a-card>

          <a-card :loading="loading"  :bordered="false" :body-style="{ padding: 0 }">
            <span slot="title" style="font-weight: bolder">团队</span>
            <Balaner></Balaner>
          </a-card>

        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
  import MyCharts from './complate/MyCharts'
  import Balaner from './complate/Balaner'
  export default {
    name: 'Workplace',
    components: {
      MyCharts,
      Balaner
    },
    data() {
      return {
        option: {
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          yAxis: {
            title: {
              text: '人数'
            }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },
          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
              pointStart: 2010
            }
          },
          series: [{
            name: '咨询人数',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
          }, {
            name: '报名人数',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
          }],
          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        },
        loading: true,
        radarLoading: true,
      }
    },

    mounted() {
      setInterval(() => {
        this.loading = false
        this.radarLoading = false
      }, 1000);

    },
    methods: {}
  }
</script>


<style lang="less" scoped>
  @import "./Workplace.less";

  .ant-carousel {
    /deep/ .slick-slide {
      text-align: center;
      height: 160px;
      line-height: 160px;
      background: #364d79;
      overflow: hidden;
    }
  }

  .ant-carousel {
    /deep/ .slick-slide h3 {
      color: #fff;
    }
  }

    .project-list {

      .card-title {
        font-size: 0;

        a {
          color: rgba(0, 0, 0, 0.85);
          margin-left: 12px;
          line-height: 24px;
          height: 24px;
          display: inline-block;
          vertical-align: top;
          font-size: 14px;

          font-weight: bolder;

          &:hover {
            color: #1890ff;
          }
        }
      }

      .card-description {
        color: rgba(0, 0, 0, 0.45);
        height: 10px;
        overflow: hidden;
      }

      .project-item {
        display: flex;
        margin-top: 8px;
        overflow: hidden;
        font-size: 12px;
        height: 20px;
        line-height: 20px;

        a {
          color: rgba(0, 0, 0, 0.45);
          display: inline-block;
          flex: 1 1 0;

          &:hover {
            color: #1890ff;
          }
        }

        .datetime {
          color: rgba(0, 0, 0, 0.25);
          flex: 0 0 auto;
          float: right;
        }
      }

      .ant-card-meta-description {
        color: rgba(0, 0, 0, 0.45);
        height: 44px;
        line-height: 22px;
        overflow: hidden;
      }
    }

    .item-group {
      padding: 20px 0 8px 24px;
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.65);
        display: inline-block;
        font-size: 14px;
        margin-bottom: 13px;
        width: 25%;
      }
    }

    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;

        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, .65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }

        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }

    .mobile {

      .project-list {

        .project-card-grid {
          width: 100%;
        }
      }

      .more-info {
        border: 0;
        padding-top: 16px;
        margin: 16px 0 16px;
      }

      .headerContent .title .welcome-text {
        display: none;
      }
    }


    .list {
      list-style: none;
      min-height: 400px;
      margin-top: 20px;

      li {
        font-size: 14px;
        height: 40px;
        line-height: 40px;
      }
    }


</style>
