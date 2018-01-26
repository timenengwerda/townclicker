// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import { Decimal } from 'decimal.js';

Vue.config.productionTip = false

Vue.filter('prettifyFixed', function (value) {

  if (value < 1000) {
    return value.toFixed(1)
  }

  return parseInt(Decimal(value).toString().replace('"', '')).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
})

Vue.filter('prettify', function (value) {

  if (value < 1000) {
    return value.toFixed(0)
  }

  return parseInt(Decimal(value).toString().replace('"', '')).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
