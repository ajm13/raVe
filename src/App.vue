<template>
  <div id="app">
    <div class="container">
      <div class="nav">
        <router-link to="/">raVe</router-link>
        <router-link to="setup">setup</router-link>
        <router-link to="about">about</router-link>
        <router-link to="history">history</router-link>
        <router-link to="donate">donate</router-link>
      </div>
      <div class="content">
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
  },

  methods: {
    updateTransition(to, from, next) {
      this.fromTransition = from.meta.transition || DEFAULT_TRANSITION
      this.toTransition = to.meta.transition || DEFAULT_TRANSITION
      if (next) next()
    },
    transitionClass(type) {
      let direction = type.match(/[^-]+/)[0]
      let transition = direction === 'enter' ? this.toTransition : this.fromTransition
      return `${transition}-${type}`
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
  height: 100vh;

  font-family: 'Comfortaa', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  display: flex;
  flex-flow: column;

  width: 100%;
  max-width: 800px;
  height: 100%;
}

.content {
  flex: 1 1 100%;
  padding: 1em 2em;
  background: rgba(#000, 0.8);
}

.nav {
  position: sticky;
  top: 0;

  flex: 0 0 auto;
  display: flex;

  padding: 1em;
  background: #111;

  a {
    color: inherit;
    text-decoration: none;
    padding: 0.5em;
    margin: 0 1em;

    &.router-link-exact-active {
      box-shadow: 0 2px 0 #ddd;
    }
  }
}
</style>
