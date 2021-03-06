import Vue from 'vue'
import Vuex from 'vuex'

const VERSION = '1.4'
const VERSION_KEY = 'raVe-v'
const STORAGE_KEY = 'raVe'

Vue.use(Vuex)

let version = localStorage.getItem(VERSION_KEY)
let saved = localStorage.getItem(STORAGE_KEY)

if (version === VERSION && saved !== null) {
  saved = JSON.parse(saved)
} else {
  saved = null
  localStorage.setItem(VERSION_KEY, VERSION)
}

const state = saved || {
  settings: {
    autoEnter: false,
    autoQ: true,
    scale: 1,
    showFPS: false,
    showDonate: true
  }
}

const mutations = {
  setAutoEnter(state, autoEnter) {
    state.settings.autoEnter = autoEnter
  },

  setAutoQ(state, autoQ) {
    state.settings.autoQ = autoQ
  },

  setScale(state, scale) {
    state.settings.scale = scale
  },

  setShowFPS(state, show) {
    state.settings.showFPS = show
  },

  stopShowingDonate(state) {
    state.settings.showDonate = false
  }
}

const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  })
}

export default new Vuex.Store({
  state,
  mutations,
  actions: {},
  plugins: [localStoragePlugin]
})
