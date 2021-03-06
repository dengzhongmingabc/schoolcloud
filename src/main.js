// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './global.less'


import {Tree} from 'ant-design-vue'
import Print from 'vue-print-nb'
Vue.config.productionTip = false


import VCalendar from 'v-calendar';
Vue.use(VCalendar, {
  componentPrefix: 'vc'       // 其他设置
});


import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(Print);

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(Tree)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
