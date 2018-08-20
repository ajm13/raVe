<template>
  <div id="app">
    <div class="container">
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
        <router-view />
        </transition>
    </div>
    <div class="nav">
      <div class="nav-links">
        <router-link to="/">ra<span>V</span>e</router-link>
        <router-link to="setup">setup</router-link>
        <router-link to="about">about</router-link>
        <router-link to="history">history</router-link>
        <router-link to="donate">donate</router-link>
      </div>
    </div>
  </div>
</template>

<script>
const DEFAULT_TRANSITION = 'fade'

export default {
  data: () => ({
    fromTransition: DEFAULT_TRANSITION,
    toTransition: DEFAULT_TRANSITION
  }),

  created() {
    this.$router.beforeEach(this.updateTransition)
    this.updateTransition(this.$route, this.$route)
    this.changeBackground()
    this.changeBackground()
    setInterval(this.changeBackground, 20000)
  },

  methods: {
    changeBackground() {
      let docEl = document.documentElement
      let style = getComputedStyle(docEl)
      let n = Math.floor(Math.random() * 20)

      let preload_bg = style.getPropertyValue(`--preload-bg`)
      let bg = style.getPropertyValue(`--bg-${n}`)

      docEl.style.setProperty(`--bg`, preload_bg)
      docEl.style.setProperty(`--preload-bg`, bg)
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
  }
}
</script>


<style lang="scss">
@import './assets/main.scss';

#app {
  display: flex;
  justify-content: center;

  width: 100vw;
  min-height: 100vh;

  background: var(--bg) center center fixed / cover no-repeat;
  transition: background 2s ease;

  font-family: 'Comfortaa', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  position: relative;

  width: 100%;
  max-width: $content-width;
  overflow: hidden;

  padding: 1em 2em;
  padding-top: 5em;
  background: rgba(#000, 0.8);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: -1em;
    bottom: 0;
    left: -1em;

    background: var(--bg) center center fixed / cover no-repeat;
    transition: background 2s ease;

    filter: blur(1em) brightness(0.5);
  }

  > div {
    position: relative;
  }
}

.nav {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  transform: translate3d(0, 0, 0);

  &-links {
    width: 100%;
    max-width: $content-width;

    z-index: 1000;
    display: flex;

    margin: 0 auto;
    padding: 1em;

    background: #111;
  }

  a {
    position: relative;

    padding: 0.5em;
    margin: 0 1em;

    color: inherit;
    text-decoration: none;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);

      width: 0%;
      height: 2px;

      background: #888;
      transition: all 0.3s ease;
    }

    &:hover:after,
    &.router-link-exact-active:after {
      width: 100%;
    }

    &.router-link-exact-active:after {
      background: #ddd;
    }
  }
}
</style>
