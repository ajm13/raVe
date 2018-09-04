<template>
  <div class="welcome center">
    <div class="dialog">
      <div class="heading">welcome to</div>
      <div class="title">
        <rave/>
      </div>
      <div class="subtitle">realtime audio visualizer experience</div>

      <router-link tag="button" to="/visualizer" class="enter-btn">
        <span class="darken">enter </span>
        <rave/>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.welcome {
  .dialog {
    font-size: 2rem;
    font-weight: 300;
    min-width: 500px;
  }

  .heading {
    opacity: 0.8;
  }

  .title {
    font-size: 3.5em;
  }

  .subtitle {
    font-size: 0.5em;
    opacity: 0.6;
  }

  .darken {
    opacity: 0.5;
  }

  .enter-btn {
    margin-top: 1em;
    border-color: rgba(#fff, 0.2);
  }
}
</style>
