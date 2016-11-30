import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Hello from 'components/hello';

Vue.use(VueRouter)
Vue.use(Vuex)

/* eslint-disable */
new Vue({
  el: '#app-root',
  render: h => h(Hello)
});
