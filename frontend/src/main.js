import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueSocketio from 'vue-socket.io-extended';
import store from './store'
import socket from './socket-instance.js'
Vue.use(VueSocketio, socket,{store});
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
