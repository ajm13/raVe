<template>
  <div class="vis">
    <div class="vis__container" ref="container"></div>
    <template v-if="visualizer">
      <div class="vis__controls" :class="{ hidden: !showControls && !source.paused }" @mousemove="displayControls"
        @click="displayControls">
        <nav-bar/>
        <vis-settings :visualizer="visualizer" />
        <audio-controls :audio="audio" :microphone="microphone" :playlist="playlist" />
      </div>
      <audio-dropzone :playlist="playlist" />
      <div v-if="settings.showFPS" class="vis__fps">{{ visualizer.fps }}</div>
    </template>
    <modal :show="settings.showWelcome && showWelcome">
      <div class="vis__welcome">
        <h2>Welcome to
          <rave/>
        </h2>
        <p>To start, drag and drop audio files or toggle microphone. For detailed instructions
          see
          <router-link to="setup">setup</router-link>
        </p>
        <p>
          <strong>Tip:</strong> If <rave/> is slow or choppy,
          <template v-if="!chromeOrFirefox">try
            <a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>
            or
            <a href="https://www.mozilla.org/en-US/firefox/" target="_blank">Mozilla Firefox</a>, or
          </template>try turning down render scale in the settings panel</p>
        <div class="flex">
          <label class="btn block">
            <input v-model="noMoreWelcome" type="checkbox"> don't show again
          </label>
          <button @click="hideWelcome">dismiss</button>
        </div>
      </div>
    </modal>
    <modal :show="settings.showDonate && showDonate && !showWelcome">
      <donate-form/>
      <br>
      <div class="flex">
        <label class="btn block" v-if="donateNumShow > 1">
          <input v-model="noMoreDonate" type="checkbox"> don't show again
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
    analyzer: null,
    audio: null,
    microphone: null,
    playlist: null,
    source: null,
    visualizer: null,
    showControls: false,
    showDonate: false,
    showWelcome: true,
    hideControlsTimeout: 0,
    donateNumShow: 0,
    noMoreDonate: false,
    noMoreWelcome: false,
    chromeOrFirefox: false
  }),

  computed: mapState(['settings']),

  methods: {
    ...mapMutations(['stopShowingDonate', 'stopShowingWelcome']),

    hideDonate() {
      this.showDonate = false
      if (this.noMoreDonate) this.stopShowingDonate()
    },

    hideWelcome() {
      this.showWelcome = false
      if (this.noMoreWelcome) this.stopShowingWelcome()
    },

    displayDonate() {
      this.showDonate = true
      this.donateNumShow++
    },

    displayControls() {
      this.showControls = true
      clearTimeout(this.hideControlsTimeout)
      this.hideControlsTimeout = setTimeout(() => {
        this.showControls = false
      }, 2000)
    }
  },

  created() {
    this.showWelcome = this.settings.showWelcome
    setTimeout(this.displayDonate, 6e4 * 20) // first at 20 min
    setInterval(this.displayDonate, 6e4 * 60) // then every 60 min

    const chrome = window.chrome !== undefined
    const firefox = navigator.userAgent.indexOf('Firefox') !== -1
    this.chromeOrFirefox = chrome || firefox

    this.audio = new Audio()
    this.audio.volume = 0.5
    const acx = new (window.AudioContext || window.webkitAudioContext)()
    const src = acx.createMediaElementSource(this.audio)
    src.connect(acx.destination)

    const pt = acx.createGain()
    src.connect(pt)

    this.playlist = new Playlist(this.audio)
    this.microphone = new Microphone(this.audio, acx, pt)
    this.analyzer = new AudioAnalyzer(acx, pt)

    const audio = this.audio
    const microphone = this.microphone

    this.source = {
      get paused() {
        return audio.paused && !microphone.enabled
      }
    }
  },

  mounted() {
    this.gpu_hack = document.createElement('canvas').getContext('webgl')

    this.visualizer = new raVe({
      audio: this.source,
      analyzer: this.analyzer,
      container: this.$refs.container,
      scale: this.settings.scale || devicePixelRatio
    })
  },

  beforeDestroy() {
    this.visualizer.destroy()
    delete this.visualizer
    this.audio.pause()
    delete this.audio
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
      // opacity: 0;
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
