<template>
  <div class="modal" :style="vars" :class="{ peek }">
    <transition name="zoom">
      <div class="modal__cover" v-if="show" v-on="$listeners">
        <div class="modal__content" @click.stop>
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    peek: Boolean,
    peekOffset: String
  },

  computed: {
    vars() {
      return {
        '--peek-offset': this.peekOffset
      }
    }
  }
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

    transition: transform 300ms ease, background 300ms ease;
  }

  &.peek {
    pointer-events: none;
  }

  &.peek &__cover {
    background: transparent;
  }

  &.peek &__content {
    transform: translateY(calc(50% + 50vh - var(--peek-offset)));
  }
}
</style>
