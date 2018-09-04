<template>
  <transition name="note">
    <div class="audio-dropzone" v-show="visible" @dragover="no" @dragleave="dragLeave"
      @drop="drop">
      <div class="note">
        drop audio files anywhere
        <br />
        <span class="small">to add them to the queue</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      dragEnterHandler: null,
      visible: false
    }
  },

  props: {
    playlist: {
      type: Object,
      required: true
    }
  },

  methods: {
    no: e => e.preventDefault(),
    dragLeave() {
      this.visible = false
    },
    drop(e) {
      this.no(e)

      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        let file = e.dataTransfer.files[i]
        if (!~file.type.indexOf('audio')) continue

        let song = {
          title: file.name.substr(0, file.name.length - 4),
          blob: window.URL.createObjectURL(file)
        }

        this.playlist.add(song)
        // console.log('"' + song.title + '" dropped')
      }

      this.dragLeave()
    }
  },

  created() {
    this.dragEnterHandler = () => {
      this.visible = true
    }

    document.body.addEventListener('dragenter', this.dragEnterHandler, 'audio-dropzone')
  },

  beforeDestroy() {
    window.removeAllEventListeners('audio-dropzone')
  }
}
</script>

<style lang="scss">
.audio-dropzone {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(127, 127, 127, 0.3);
  z-index: 1000;

  transition: all 300ms ease;

  .note {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 1em 1.5em;
    white-space: nowrap;

    text-align: center;
    font-size: 2em;

    background-color: #111;
    transform: translate(-50%, -50%);
    pointer-events: none;

    transition: all 300ms ease;

    .small {
      font-size: 0.61em;
    }
  }
}

.note-enter,
.note-leave-active {
  opacity: 0;
}

.note-enter .note,
.note-leave-active .note {
  transform: translate(-50%, -50%) scale(1.1);
}
</style>
