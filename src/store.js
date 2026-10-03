import { reactive, toRefs, watch } from 'vue'
import { defineStore } from 'pinia'

const VERSION = '1.4'
const VERSION_KEY = 'raVe-v'
const STORAGE_KEY = 'raVe'

function load() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (localStorage.getItem(VERSION_KEY) === VERSION && saved !== null) {
    return JSON.parse(saved).settings
  }

  localStorage.setItem(VERSION_KEY, VERSION)
  return {
    autoEnter: false,
    autoQ: true,
    scale: 1,
    showFPS: false,
    showDonate: true
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive(load())

  // Keep the v1.4 storage format so that saved settings stay valid
  watch(settings, () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings })), {
    deep: true
  })

  return toRefs(settings)
})
