<template>
  <div class="nav">
    <div class="nav-scroll">
      <div class="nav-links">
        <router-link to="/"><rave /></router-link>
        <router-link to="setup">setup</router-link>
        <router-link to="about">about</router-link>
        <router-link to="contact">contact</router-link>
        <router-link to="donate">donate</router-link>
        <a href="https://github.com/ajm13/raVe" target="_blank">code</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.nav {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  transform: translate3d(0, 0, 0);

  &-scroll {
    width: 100%;
    max-width: var(--content-width);
    overflow-x: auto;

    z-index: 1000;

    margin: 0 auto;
    padding: 1em;

    border-radius: var(--border-radius);
    background: #111;
  }

  &-links {
    display: flex;
    justify-content: space-evenly;
    min-width: min-content;
  }

  a {
    position: relative;

    padding: 0.5em;
    margin: 0 0.5em;
    border: 0;

    color: inherit;
    text-decoration: none !important;

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

@media all and (max-width: 480px) {
  .nav a {
    margin: 0 0.5rem;
  }
}
</style>
