import 'babel-polyfill';

window.$ = window.Zepto = require('webpack-zepto')
require("../src/util/zepto-adapter");//zepto 公共扩展
require("../src/util/common");       //zepto 私有扩展

import Vue from 'vue';
import store from './store/index';
import router from './router'
import FastClick from 'fastclick';
import main from './main';



import FN from './index';
Vue.use(FN);

//全局使用 fastclick
document.addEventListener('DOMContentLoaded', function() {
  FastClick.attach(document.body);
}, false);

//开启debug模式
Vue.config.debug =  process.env.NODE_ENV === "development" ? true : false;
//取消 Vue 所有的日志与警告。
//全局配置 勿动
Vue.config.silent = process.env.NODE_ENV === "development" ? false : true;

console.log(`%c 正在访问 ${process.env.NODE_ENV} 环境`, 'color:orange;font-size:20px;text-shadow: 1px 1px 1px grey;font-weight:bold')


new Vue({
  store, // injects the Store into all components
  router, // make Router work with the application
  el: '#app',
  render: h => h(main),
})
