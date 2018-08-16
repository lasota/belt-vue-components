import Vue from 'vue'
import App from './App.vue'
import lodash from 'lodash';
global._ = lodash;

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
