<template>
  <div class="vis-settings" ref="settings" v-if="visualizer">
    <div class="vis-settings__open" :class="{ hidden: showSettings }" @click="showSettings = true">
      settings
    </div>
    <div class="vis-settings__panel" :class="{ hidden: !showSettings }">
      <i class="vis-settings__close material-icons" @click="showSettings = false">chevron_right</i>
      <h3>Settings</h3>
      <label class="btn toggle">
        <input type="checkbox" v-model="fullscreen" @click.prevent="toggleFullscreen" />
        <div>fullscreen</div>
      </label>
      <label class="btn toggle">
        <input type="checkbox" v-model="showFPS" @change="setShowFPS(showFPS)" />
        <div>show FPS</div>
      </label>
      <br />
      <label>quality</label>
      <div class="vis-settings__quality">
        <button :disabled="visualizer.scale <= quality.min" @click="changeScale(-1)">
          <i class="material-icons">chevron_left</i>
        </button>
        <div>{{ quality[visualizer.scale] }}</div>
        <button :disabled="visualizer.scale >= quality.max" @click="changeScale(1)">
          <i class="material-icons">chevron_right</i>
        </button>
      </div>
      <label class="btn toggle">
        <input type="checkbox" v-model="autoQ" @change="setAutoQ(autoQ)" />
        <div>auto quality</div>
      </label>
      {{ visualizer.canvas.width }}x{{ visualizer.canvas.height }}
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Utils from '@/js/Utils'

export default {
  props: ['visualizer'],

  data: () => ({
    quality: {
      min: 0.5,
      max: 3,
      '0.5': 'low',
      '1': 'medium',
      '1.5': 'high',
      '2': 'ultra',
      '2.5': 'insane',
      '3': 'ludicrous'
    },
    autoQ: false,
    showFPS: false,
    showSettings: true,
    fullscreen: false
  }),

  computed: mapState(['settings']),

  methods: {
    ...mapMutations(['setAutoQ', 'setScale', 'setShowFPS']),

    changeScale(dir) {
      const v = this.visualizer
      const { min, max } = this.quality

      let scale = Math.floor(v.scale * 2 + dir) / 2
      scale = Utils.clamp(scale, min, max)

      if (scale !== v.scale) {
        v.scale = scale
        this.setScale(v.scale)
        v.resize()
      }
    },

    toggleFullscreen() {
      if (this.fullscreen) {
        document.exitFullscreen()
      } else {
        document.body.requestFullscreen()
      }
    },

    fullscreenHandler() {
      this.fullscreen = !!document.fullscreenElement
    }
  },

  created() {
    this.autoQ = this.settings.autoQ
    this.showFPS = this.settings.showFPS

    const resizeHandler = Utils.debounce(this.$forceUpdate.bind(this))
    window.addEventListener('resize', resizeHandler, 'vis-settings')
    window.addEventListener('fullscreenchange', this.fullscreenHandler, 'vis-settings')
  },

  beforeDestroy() {
    window.removeAllEventListeners('vis-settings')
  }
}
</script>

<style lang="scss">
.vis-settings {
  user-select: none;

  &__panel,
  &__open {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    border-radius: var(--border-radius);
    background: #111;
    transition: right 300ms ease;

    &.hidden {
      right: -200px;
    }
  }

  &__open,
  &__close {
    cursor: pointer;
  }

  &__open {
    right: 0;
    padding: 1em 1.5em;
    transform: rotate(-90deg) translate(50%, -100%);
    transform-origin: right top;
  }

  &__close {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
  }

  &__panel {
    right: 2em;
    width: 200px;
    text-align: center;
    padding: 1.5em;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > label,
    > div {
      width: 100%;
      margin-bottom: 0.5em;
    }
  }

  &__quality {
    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid rgba(#fff, 0.2);
    border-radius: var(--border-radius);
    overflow: hidden;

    button {
      border: 0;
      border-radius: 0;
      padding: 0.25em;
      line-height: 0;
      flex: 0;

      i {
        font-size: inherit;
        line-height: 1;
      }
    }

    div {
      flex: 1;
      padding: 0.25em 1em;
    }
  }
}
</style>
