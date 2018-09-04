<template>
  <div class="vis-settings" ref="settings" v-if="visualizer">
    <div class="vis-settings__open" :class="{ hidden: showSettings }" @click="showSettings = true">settings</div>
    <div class="vis-settings__panel" :class="{ hidden: !showSettings }">
      <i class="vis-settings__close material-icons" @click="showSettings = false">close</i>
      <h3>Settings</h3>
      <label class="btn">
        <input type="checkbox" v-model="showFPS" @change="setShowFPS(showFPS)"> show FPS
      </label>
      <br>
      <label>render scale</label>
      <div class="vis-settings__scale">
        <button @click="changeScale(-1)">-</button>
        <div>{{ visualizer.scale }}</div>
        <button @click="changeScale(1)">+</button>
      </div>
      {{ visualizer.canvas.width }}x{{ visualizer.canvas.height }}
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  props: ['visualizer'],

  data: () => ({
    showFPS: false,
    showSettings: false
  }),

  computed: mapState(['settings']),

  methods: {
    ...mapMutations(['setScale', 'setShowFPS']),

    changeScale(dir) {
      const v = this.visualizer
      v.scale = Math.floor(v.scale * 10 + dir) / 10
      v.scale = Math.max(0.5, Math.min(5, v.scale))
      this.setScale(v.scale)
      v.resize()
    },
    resizeHandler() {
      this.$forceUpdate()
    }
  },

  created() {
    this.showFPS = this.settings.showFPS
    window.addEventListener('resize', this.resizeHandler)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
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

  &__scale {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    button,
    div {
      padding: 0.25em 1em;
      border: 1px solid rgba(#fff, 0.2);
    }

    button {
      flex: 0;
    }

    div {
      flex: 1;
      border-left-width: 0;
      border-right-width: 0;
    }

    button:first-of-type {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    button:last-of-type {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
