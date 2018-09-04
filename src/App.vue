<template>
  <div id="app">
    <template v-if="!visActive">
      <div class="bg-preload">
        <div class="bg" :class="bgPreload"></div>
        <div class="bg" :class="bgBlurPreload"></div>
      </div>
      <div class="bg" :class="bg"></div>
    </template>
    <div class="container" :class="{ visualizer: visActive }">
      <div v-if="!visActive" class="bg" :class="bgBlur"></div>
      <transition
        appear
        mode="out-in"
        :leave-class="transitionClass('leave')"
        :leave-active-class="transitionClass('leave-active')"
        :leave-to-class="transitionClass('leave-to')"
        :enter-class="transitionClass('enter')"
        :enter-active-class="transitionClass('enter-active')"
        :enter-to-class="transitionClass('enter-to')"
      >
        <router-view :class="{ content: !visActive }" />
      </transition>
    </div>
    <nav-bar v-if="!visActive" />
  </div>
</template>

<script>
import '@/js/EventListenerCleanup'

import NavBar from '@/components/NavBar'
const DEFAULT_TRANSITION = 'fade'

export default {
  data: () => ({
    fromTransition: DEFAULT_TRANSITION,
    toTransition: DEFAULT_TRANSITION,
    bgInterval: null,
    bg: null,
    bgBlur: null,
    bgPreload: null,
    bgBlurPreload: null
  }),

  computed: {
    visActive() {
      const visActive = this.$route.name === 'visualizer'
      document.body.classList.toggle('scrollbar', !visActive)
      return visActive
    }
  },

  created() {
    this.$router.beforeEach(this.updateTransition)
    this.updateTransition(this.$route, this.$route)
    this.changeBackground()
    this.changeBackground()
    this.bgInterval = setInterval(this.changeBackground, 30000)
  },

  destroyed() {
    clearInterval(this.bgInterval)
  },

  methods: {
    changeBackground() {
      const n = Math.floor(Math.random() * 20)

      this.bg = this.bgPreload
      this.bgBlur = this.bgBlurPreload
      this.bgPreload = `bg-${n}`
      this.bgBlurPreload = `bg-${n}b`
    },
    transitionClass(type) {
      let direction = type.match(/[^-]+/)[0]
      let transition = direction === 'enter' ? this.toTransition : this.fromTransition
      return `${transition}-${type}`
    },
    updateTransition(to, from, next) {
      window.scrollTo(0, 0)
      this.fromTransition = from.meta.transition || DEFAULT_TRANSITION
      this.toTransition = to.meta.transition || DEFAULT_TRANSITION
      if (next) next()
    }
  },

  components: { NavBar }
}
</script>

<style lang="scss">
@import './assets/main.scss';

@for $i from 0 through 19 {
  .bg-#{$i} {
    background: url('./assets/bg/bg-#{$i}.jpg') center center fixed / cover no-repeat;
  }
  .bg-#{$i}b {
    background: url('./assets/bg/bg-#{$i}b.jpg') center center fixed / cover no-repeat;
  }
}

.bg {
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  transition: background 2s ease;
}

.bg-preload {
  width: 0;
  height: 0;
  visibility: hidden;
}

#app {
  position: relative;
  display: flex;
  justify-content: center;

  width: 100%;
  min-height: 100vh;

  font-family: 'Comfortaa', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  > .bg {
    position: fixed;
  }
}

.container {
  position: relative;
  width: 100%;

  > .content {
    position: relative;
  }
}

.container:not(.visualizer) {
  max-width: var(--content-width);
  overflow: hidden;

  padding: 4rem;

  @media all and (max-width: 768px) {
    padding: 4rem 1rem;
  }
}
</style>
