<template>
  <div class="vis">
    <div class="vis__container" ref="container"></div>
    <template v-if="visualizer">
      <div
        class="vis__controls"
        :class="{ hidden: !showControls || showDonate }"
        @mousemove="detectedActive"
        @click="detectedActive"
        @click.self="userActive = false"
      >
        <nav-bar />
        <vis-settings ref="visSettings" :visualizer="visualizer" />
        <audio-controls :audio="audio" :microphone="microphone" :playlist="playlist" />
      </div>
      <audio-dropzone :playlist="playlist" />
      <div v-if="settings.showFPS" class="vis__fps">{{ visualizer.fps }}</div>
    </template>
    <modal :show="showWelcome">
      <div class="vis__welcome">
        <h2>Welcome to <rave /></h2>
        <p>
          Drag and drop audio files or toggle microphone to begin. To use with Spotify or YouTube,
          see <router-link to="setup">setup</router-link>
        </p>
        <p>
          <strong>Tip:</strong> If <rave />&nbsp;is slow or choppy,
          <template v-if="!chromeOrFirefox">
            try
            <a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>
            or
            <a href="https://www.mozilla.org/en-US/firefox/" target="_blank">Mozilla Firefox</a>, or
          </template>
          try turning down quality in the settings panel
        </p>
        <p class="center">Best viewed in fullscreen</p>
        <div class="flex center">
          <button @click="hideWelcome">enter raVe</button>
        </div>
      </div>
    </modal>
    <modal
      :show="settings.showDonate && showDonate && !showWelcome"
      :peek="!showControls"
      peekOffset="80px"
    >
      <donate-form h="h2" class="vis__donate" />
      <div class="flex">
        <label class="btn block" v-if="donateNumShow > 1">
          <input v-model="noMoreDonate" type="checkbox" /> don't show again
        </label>
        <div v-else></div>
        <button @click="hideDonate">dismiss</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import '@/js/CanvasUtils'

import AudioControls from '@/components/AudioControls'
import AudioDropzone from '@/components/AudioDropzone'
import DonateForm from '@/components/DonateForm'
import Modal from '@/components/Modal'
import NavBar from '@/components/NavBar'
import VisSettings from '@/components/VisSettings'

import AudioAnalyzer from '@/js/AudioAnalyzer'
import Microphone from '@/js/Microphone'
import Playlist from '@/js/Playlist'

import raVe from '@/js/raVe'

export default {
  data: () => ({
    acx: null,
    analyzer: null,
    audio: null,
    microphone: null,
    playlist: null,
    source: null,
    visualizer: null,

    autoQSamples: [],
    autoQLastTick: 0,
    autoQIV: 0,

    showDonate: false,
    showDonateTO: 0,
    showDonateIV: 0,
    noMoreDonate: false,
    donateNumShow: 0,

    showWelcome: true,

    userActive: true,
    userActiveTO: 0,

    chromeOrFirefox: false
  }),

  computed: {
    ...mapState(['settings']),

    showControls() {
      if (!this.visualizer) return true
      return this.userActive || this.source.paused
    }
  },

  methods: {
    ...mapMutations(['stopShowingDonate']),

    autoQuality() {
      const fps = this.visualizer.tick - this.autoQLastTick
      this.autoQLastTick = this.visualizer.tick

      this.autoQSamples.push(fps)
      if (this.autoQSamples.length > 5) {
        this.autoQSamples.shift()
        const avg = this.autoQSamples.reduce((a, x) => a + x) / 5

        if (avg < 55) {
          this.$refs.visSettings.changeScale(-1)
          this.autoQSamples = []
        }
      }
    },

    hideWelcome() {
      if (this.acx.resume) this.acx.resume()
      this.showWelcome = false
    },

    hideDonate() {
      this.showDonate = false
      if (this.noMoreDonate) this.stopShowingDonate()
    },

    displayDonate() {
      this.showDonate = true
      this.donateNumShow++
    },

    detectedActive() {
      this.userActive = true
      clearTimeout(this.userActiveTO)
      const delay = this.showDonate ? 7000 : 2000
      this.userActiveTO = setTimeout(() => {
        this.userActive = false
      }, delay)
    },

    manageAutoQIV() {
      clearInterval(this.autoQIV)

      if (this.settings.autoQ && !this.showControls && !document.hidden) {
        this.autoQLastTick = this.visualizer.tick
        this.autoQIV = setInterval(this.autoQuality, 1000)
      }
    }
  },

  watch: {
    showControls: 'manageAutoQIV'
  },

  created() {
    this.showDonateTO = setTimeout(this.displayDonate, 6e4 * 20) // first at 20 min
    this.showDonateIV = setInterval(this.displayDonate, 6e4 * 60) // then every 60 min

    const chrome = window.chrome !== undefined
    const firefox = navigator.userAgent.indexOf('Firefox') !== -1
    this.chromeOrFirefox = chrome || firefox

    // set up visualizer stuff
    this.audio = new Audio()
    this.audio.volume = 0.5
    this.acx = new (window.AudioContext || window.webkitAudioContext)()
    const src = this.acx.createMediaElementSource(this.audio)
    src.connect(this.acx.destination)

    const pt = this.acx.createGain()
    src.connect(pt)

    this.playlist = new Playlist(this.audio)
    this.microphone = new Microphone(this.audio, this.acx, pt)
    this.analyzer = new AudioAnalyzer(this.acx, pt)

    const audio = this.audio
    const microphone = this.microphone
    this.microphone.toggle()

    this.source = { paused: false }
    setTimeout(() => {
      Object.defineProperty(this.source, 'paused', {
        get: () => audio.paused && !microphone.enabled
      })
    }, 2000)
  },

  mounted() {
    const onVisibility = () => (document.hidden ? this.manageAutoQIV() : 0)
    document.addEventListener('visibilitychange', onVisibility, 'visualizer')

    const onKeydown = e => {
      if (e.code === 'KeyD') {
        this.showDonate = true
      }
      if (e.code === 'Escape') {
        e.preventDefault()
        this.userActive = false
      }
    }
    document.addEventListener('keydown', onKeydown, 'visualizer')

    this.gpuHack = document.createElement('canvas')
    this.gpuHackCtx = this.gpuHack.getContext('webgl')

    this.visualizer = new raVe({
      audio: this.source,
      analyzer: this.analyzer,
      container: this.$refs.container,
      scale: this.settings.scale
    })
  },

  beforeDestroy() {
    window.removeAllEventListeners('visualizer')

    clearTimeout(this.showDonateTO)
    clearTimeout(this.userActiveTO)

    clearInterval(this.autoQIV)
    clearInterval(this.showDonateIV)

    this.visualizer.destroy()
    delete this.visualizer

    this.audio.pause()
    this.audio.src = ''
    this.audio.load()
    delete this.audio

    delete this.gpuHack
    delete this.gpuHackCtx
  },

  components: {
    AudioControls,
    AudioDropzone,
    DonateForm,
    Modal,
    NavBar,
    VisSettings
  }
}
</script>

<style lang="scss">
.vis {
  &__welcome {
    max-width: 300px;

    h2 {
      text-align: center;
    }
  }

  &__donate .crypto-link__qr {
    background: #222;

    &::after {
      border-top-color: #222;
    }
  }

  &__container,
  &__controls {
    position: absolute;
    width: 100%;
    height: 100%;

    overflow: hidden;
  }

  &__container {
    background: #000;
  }

  &__controls {
    .nav {
      transition: top 300ms ease;
    }

    .vis-settings__open,
    .vis-settings__panel {
      transition: right 300ms ease;
    }

    .audio-controls {
      transition: bottom 300ms ease;
    }

    &.hidden {
      opacity: 0;
      cursor: none;

      .nav {
        top: -100px;
      }

      .vis-settings__open {
        right: -100px;
      }

      .vis-settings__panel {
        right: -300px;
      }

      .audio-controls {
        bottom: -100px;
      }
    }

    transition: all 300ms ease;
  }

  &__fps {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0.5em 1em;
    opacity: 0.5;
  }

  canvas {
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
  }
}
</style>
