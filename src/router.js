import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { transition: 'zoom' }
    },
    {
      path: '/visualizer',
      name: 'visualizer',
      component: () => import('./views/Visualizer.vue')
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('./views/Setup.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('./views/Contact.vue')
    },
    {
      path: '/donate',
      name: 'donate',
      component: () => import('./views/Donate.vue')
    }
  ]
})
