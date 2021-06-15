import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

//引入v-charts的配置文件
import '@/plugins/vcharts'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import CategorySelector from '@/components/CategorySelector'
import HintButton from '@/components/HintButton'


import * as API from '@/api'
import {hasBtnPermission} from '@/utils/permission'


// $API = {
//   treademark:{},
//   attr:{},
//   sku:{}
// }


// 全局注册组件
Vue.component('CategorySelector',CategorySelector)
Vue.component('HintButton',HintButton)




/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$API = API //把所有的接口请求函数最终整体的对象挂到vue原型身上，以便在每个组件当中去使用
Vue.prototype.$hasBP = hasBtnPermission
// API = {
//     trademark：{getPageList}
//     attr：{}
//  }
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
