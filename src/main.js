import axios from 'axios'
import Vue from 'vue'
import lodash from 'lodash'
global.axios = axios;
global.Vue = Vue;
global._ = lodash;

import VueMq from 'vue-mq';

import App from './App.vue'

import './components/index';
console.log(axios.options)
axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*'
};

Vue.config.productionTip = false

Vue.use(VueMq, {
  breakpoints: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: Infinity,
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
