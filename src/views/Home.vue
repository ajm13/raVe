<template>
  <div class="welcome center">
    <div class="welcome__dialog">
      <div class="welcome__heading">welcome to</div>
      <div class="welcome__title">
        <rave />
      </div>
      <div class="welcome__subtitle">real-time audio visualizer experience</div>

      <router-link tag="button" to="/visualizer" class="welcome__enter">
        <span>enter </span><rave />
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.welcome {
  &__dialog {
    font-weight: 300;
    min-width: 500px;
  }

  &__heading {
    font-size: 2rem;
    opacity: 0.8;
  }

  &__title {
    font-size: 7rem;
  }

  &__subtitle {
    font-size: 1em;
    opacity: 0.6;
  }

  &__enter {
    font-size: 1.5rem;
    margin: 1em 0;
    border-color: rgba(#fff, 0.2);

    > span:first-child {
      opacity: 0.5;
    }
  }
}
</style>
