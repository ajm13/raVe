<template>
  <div class="modal">
    <transition name="zoom">
      <div class="modal__cover" v-if="show">
        <div class="modal__content">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['show']
}
</script>


<style lang="scss">
.modal {
  &__cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: rgba(0, 0, 0, 0.3);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__content {
    border-radius: var(--border-radius);
    background: #111;
    line-height: 1.5;
    padding: 1.5em;
  }
}
</style>
