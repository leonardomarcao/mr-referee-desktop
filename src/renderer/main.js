import Vue from 'vue'
import axios from 'axios'
import Lottie from 'vue-lottie/src/lottie'
import VueToast from 'vue-toast-notification'
// Import one of available themes
import 'vue-toast-notification/dist/theme-default.css'

// Other Plugin
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// -----------------------------

import App from './App'
import router from './router'
import store from './store'

Vue.use(BootstrapVue)
Vue.use(Lottie)
Vue.use(VueToast)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
