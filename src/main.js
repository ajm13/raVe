import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useSettingsStore } from './store'

import rave from '@/components/rave.vue'

const app = createApp(App).use(createPinia()).use(router).component('rave', rave)
const settings = useSettingsStore()

router.beforeEach((to, from) => {
  if (settings.autoEnter && to.name === 'home') {
    if (from.name === 'visualizer') {
      settings.autoEnter = false
    } else {
      return '/visualizer'
    }
  }
})

router.isReady().then(() => app.mount('#app'))
