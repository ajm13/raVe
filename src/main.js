import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import PageViewTime from './plugins/PageViewTime'

import rave from '@/components/rave'
Vue.component('rave', rave)

Vue.config.productionTip = false

const prod = process.env.NODE_ENV === 'production'
const debug = !prod && false

Vue.use(VueAnalytics, {
  id: 'UA-125037714-1',
  router,
  debug: {
    enabled: debug,
    sendHitTask: prod
  }
})

Vue.use(PageViewTime, {
  router
})

router.beforeEach((to, from, next) => {
  const { autoEnter } = store.state.settings
  if (autoEnter && to.name === 'home') {
    if (from.name === 'visualizer') {
      store.commit('setAutoEnter', false)
    } else {
      return next('/visualizer')
    }
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
