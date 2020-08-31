<template>
  <a-modal
    :maskClosable="false"
    cancelText="取消"
    okText="确定"
    title="表单"
    :width="1060"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <template>
      <FullCalendar
        class='demo-app-calendar'
        :options='calendarOptions'
      >
       <!-- <template v-slot:eventContent='arg'>
          &lt;!&ndash;<b>{{ arg.event.start }}</b>
          <i>{{ arg.event.title }}</i>&ndash;&gt;
          <i>{{ arg.event.title }}</i>
        </template>-->
      </FullCalendar>
    </template>


  </a-modal>


</template>

<script>

  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import { INITIAL_EVENTS, createEventId } from '@/plugins/fullcalendar/event-utils'
  import pick from "lodash.pick";
  import tippy from "tippy.js";
  import 'tippy.js/dist/tippy.css';
  import 'tippy.js/themes/light.css';
  import 'tippy.js/animations/scale.css';
  import moment from 'moment'

  const fields = ['forbidden','name', 'id']
  let eventGuid = 0
  let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

  export default {
    components: {
      FullCalendar // make the <FullCalendar> tag available
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
    data: function() {
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
        calendarOptions: {
          plugins: [
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin // needed for dateClick
          ],
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          initialView: 'dayGridMonth',
          events: [],

          eventMouseEnter:function (info) {
            tippy(info.el, {
              content:`${info.event.title}\n${moment(info.event.start).format('HH:mm:ss')}~${moment(info.event.end).format('HH:mm:ss')}`,
              // trigger: 'click',
              //interactive: true,
              allowHTML: true,
              // content: info.event.extendedProps.name,
              // placement: "top-start",
              // arrowType: 'sharp',
              //  arrow: true,
              // size: "small",//
              delay: [300, 300],
              // 鼠标放在提示中提示不消失
              interactive: true,
            });
          },
          aspectRatio:2,
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          weekends: true,
          select: this.handleDateSelect,
          eventClick: this.handleEventClick,
          locale:"zh-cn",
          firstDay:"1",
          navLinks: true,
          allDaySlot:false,
          /*businessHours: {
            dow: [ 1, 2, 3, 4 ], // 周一 - 周四
            start: '10:00', // 上午10点开始
            end: '18:00', // 下午18点结束
          },*/
          //hiddenDays: [ 6, 0 ],
          //weekNumbers:true,
          buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            day: '日'
          },
          slotLabelFormat:{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false //设置时间为24小时
          },
          eventsSet: this.handleEvents,
          slotDuration:'00:05:00',
          showNonCurrentDates:false,
          /* you can update a remote database when these fire:
          eventAdd:
          eventChange:
          eventRemove:
          */
        },
      }
    },
    created() {
      /*this.calendarOptions.events = model.events*/

      this.$watch('model.events', () => {
        console.log("tttttttttttttttttttttttttttttttttt")
      })
    },
    computed:{
      cevents(){
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrr")
        return  this.model.events
      }
    },
    watch:{
      'model.events':{
        handler(value,oldValue){
          let opt = {...this.calendarOptions}
          opt.events = value;
          this.calendarOptions = opt
          console.log("xxxxxxxxxxxxxxxxxxxxxxxx",value)
        }
      }
    },
    methods: {
      handleWeekendsToggle() {
        this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
      },
      handleDateSelect(selectInfo) {
        let self = this;
        let calendarApi = selectInfo.view.calendar
        calendarApi.unselect() // clear date selection
          this.$confirm({
            title: '确认提示',
            content: `你确定要将${selectInfo.startStr}做为开始时间吗？`,
            onOk() {
              self.form.validateFields((errors, values) => {
                console.log(values);
                calendarApi.addEvent({
                  id: createEventId(),
                  title:`${values.classOrOneByOne.label}`,
                  start: selectInfo.startStr,
                  end: selectInfo.endStr,
                  allDay: selectInfo.allDay
                })
              });

            },
            onCancel() {},
          });
        /*let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar
        calendarApi.unselect() // clear date selection
        if (title) {
          console.log(selectInfo)
          calendarApi.addEvent({
            id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          })
        }*/
      },

      handleEventClick(clickInfo) {
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
          clickInfo.event.remove()
        }
      },
      handleEvents(events) {
        this.currentEvents = events
      }
    }
  }
</script>
<style scoped>
  h2 {
    margin: 0;
    font-size: 16px;
  }
  ul {
    margin: 0;
    padding: 0 0 0 1.5em;
  }
  li {
    margin: 1.5em 0;
    padding: 0;
  }
  b { /* used for event dates/times */
    margin-right: 3px;
  }
  .demo-app {
    display: flex;
    min-height: 100%;
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
    font-size: 14px;
  }
  .demo-app-sidebar {
    width: 300px;
    line-height: 1.5;
    background: #eaf9ff;
    border-right: 1px solid #d3e2e8;
  }
  .demo-app-sidebar-section {
    padding: 2em;
  }
  .demo-app-main {
    flex-grow: 1;
    padding: 3em;
  }
  .fc { /* the calendar root */
    max-width: 1100px;
    margin: 0 auto;
  }
</style>