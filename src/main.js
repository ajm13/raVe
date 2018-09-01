import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import LoremIpsum from 'vue-lorem-ipsum'
import rave from '@/components/rave'

Vue.component('lorem', LoremIpsum)
Vue.component('rave', rave)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
