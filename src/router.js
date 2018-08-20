import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { transition: 'zoom' }
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import(/* webpackChunkName: "setup" */ './views/Setup.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import(/* webpackChunkName: "history" */ './views/History.vue')
    },
    {
      path: '/donate',
      name: 'donate',
      component: () => import(/* webpackChunkName: "donate" */ './views/Donate.vue')
    }
  ]
})
