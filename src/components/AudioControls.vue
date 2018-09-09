<template>
  <div class="audio-controls" :class="{ micOnly: microphone.enabled }">
    <div class="button prev" @click="audio.currentTime = 0">
      <i class="material-icons">skip_previous</i>
    </div>
    <div class="button playPause" @click="togglePlay()">
      <i v-show="paused" class="material-icons">play_arrow</i>
      <i v-show="!paused" class="material-icons">pause</i>
    </div>
    <div class="button next" @click="playlist.next()">
      <i class="material-icons">skip_next</i>
    </div>
    <div class="title">{{ title }}</div>
    <div class="button microphone" @click="microphone.toggle()">
      <i v-show="!microphone.enabled" class="material-icons off">mic_off</i>
      <i v-show="microphone.enabled" class="material-icons">mic</i>
    </div>
    <div class="button playlist" @click="showPlaylist = !showPlaylist" :class="{ off: !showPlaylist }">
      <i class="material-icons">queue_music</i>
      <transition name="playlist">
        <div class="list" v-show="showPlaylist">
          <ul>
            <li v-for="(song, i) in playlist.queue" :key="song.blob" @click="playlist.dequeue(i)">
              <div class="song-title">{{ song.title }}</div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <br />
    <div class="progress" ref="progress">
      <div class="scrubber"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    audio: {
      type: HTMLAudioElement,
      required: true
    },
    playlist: {
      type: Object,
      required: true
    },
    microphone: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    paused: true,
    seeking: false,
    showPlaylist: false,
    timePassed: '',
    timeRemaining: ''
  }),

  computed: {
    title() {
      if (this.microphone.enabled) return 'microphone on'
      else return this.audio.title || 'drag and drop audio or enable mic'
    }
  },

  methods: {
    playlistNext() {
      this.playlist.next()
    },
    timeUpdate() {
      let p = this.audio.currentTime / this.audio.duration
      let bar = document.querySelector('.progress > .scrubber')
      bar.style.width = p * bar.parentElement.offsetWidth + 'px'

      let t = Math.floor(this.audio.currentTime)
      this.timePassed = t
      this.timeRemaining = Math.floor(this.audio.duration) - t
    },
    togglePlay() {
      if (this.audio.ended && this.playlist.hasNext()) this.playlist.next()

      if (this.audio.paused && this.audio.readyState == 4) this.audio.play()
      else this.audio.pause()
    },
    updatePaused() {
      this.paused = this.audio.paused
    },
    stopMicOnPlay() {
      if (this.microphone.enabled) this.microphone.toggle()
    },
    scrub(e) {
      let { progress } = this.$refs
      let p = e.offsetX / progress.offsetWidth
      let paused = this.audio.paused
      this.audio.currentTime = p * this.audio.duration
      if (paused) this.audio.pause()
    },
    mousedown(e) {
      if (!this.audio.src) return
      this.seeking = e.pageX - e.offsetX
      this.scrub(e)
    },
    mousemove(e) {
      if (this.seeking) {
        let { progress } = this.$refs
        let offset = e.pageX - this.seeking
        offset = Math.max(0, Math.min(progress.offsetWidth, offset))
        if (offset == progress.offsetWidth) this.seeking = false
        this.scrub({ offsetX: offset })
      }
    },
    mouseup() {
      this.seeking = false
    },
    keyup(e) {
      e.preventDefault()
      switch (e.keyCode) {
        case 32:
          this.togglePlay()
          break
        case 37:
          this.audio.currentTime = 0
          break
        case 39:
          this.playlist.next()
          break
        case 77:
          this.microphone.toggle()
          break
      }
    }
  },

  mounted() {
    let { progress } = this.$refs

    this.audio.addEventListener('loadedmetadata', this.timeUpdate, 'audio-controls')
    this.audio.addEventListener('timeupdate', this.timeUpdate, 'audio-controls')
    this.audio.addEventListener('pause', this.updatePaused, 'audio-controls')
    this.audio.addEventListener('play', this.updatePaused, 'audio-controls')
    this.audio.addEventListener('ended', this.playlist, 'audio-controls')
    this.audio.addEventListener('play', this.stopMicOnPlay, 'audio-controls')

    progress.addEventListener('mousedown', this.mousedown, 'audio-controls')
    document.addEventListener('mousemove', this.mousemove, 'audio-controls')
    document.addEventListener('mouseup', this.mouseup, 'audio-controls')
    document.addEventListener('keyup', this.keyup, 'audio-controls')
  },

  beforeDestroy() {
    window.removeAllEventListeners('audio-controls')
  }
}
</script>

<style lang="scss">
.audio-controls {
  position: fixed;
  bottom: 2em;
  left: 50%;

  padding: 1em;
  text-align: center;
  cursor: default;
  white-space: nowrap;

  border-radius: var(--border-radius);
  background-color: #111;

  transform: translateX(-50%);
  user-select: none;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    position: relative;
  }

  > .button {
    cursor: pointer;
  }

  > .button:active {
    color: #555;
  }

  .playPause i {
    transform: scale(1.2);
  }

  .off {
    color: #888;
  }

  .playlist {
    .list {
      position: absolute;
      bottom: 100%;
      right: 50%;
      margin-bottom: 2em;
      max-height: 400px;
      width: 300px;

      border-radius: var(--border-radius);
      background-color: #111;

      transform: translateX(50%);
      transition: all 300ms ease-out;
    }

    .playlist-enter,
    .playlist-leave-active {
      opacity: 0;
      bottom: 50% !important;
    }

    .cover {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .list ul {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 400px;
      width: 100%;
      overflow: auto;
    }

    .list ul:empty:before {
      content: 'queue empty';
      display: block;
      padding: 1em 1em;
    }

    .list li {
      position: relative;
    }

    .list li .song-title {
      position: relative;
      text-align: left;
      padding: 0.5em 1em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    li:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0%;
      height: 100%;

      background-color: #222;
      transition: all 200ms ease-out;
    }

    li:hover:before {
      width: 100%;
    }
  }

  .title {
    width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .progress {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 4px;
    background-color: #222;
  }

  .progress::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 20px;
    transform: translateY(-50%);
  }

  .progress > .scrubber {
    position: relative;
    width: 0;
    height: 100%;
    background-color: #333;
  }

  .progress > .scrubber::after {
    content: '';
    position: absolute;
    opacity: 0;
    top: 0;
    right: 0;
    width: 5px;
    height: 13px;
    margin-top: -5px;
    background-color: #555;
    border-radius: 1px;

    transform: translateX(50%);
    transition: opacity 300ms ease-out;
    transition-delay: 1000ms;
  }

  .progress:hover > .scrubber::after {
    opacity: 1;
    transition: none;
  }
}
</style>
