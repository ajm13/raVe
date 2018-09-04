export default class Microphone {
  constructor(audio, audioContext, output) {
    this.audio = audio
    this.output = output
    this.audioContext = audioContext
    this.enabled = false
    this.stream = {}
  }

  toggle() {
    if (this.enabled) {
      this.enabled = false
      this.stream.disconnect()
      this.stream = {}
      return
    }

    if (!this.audio.paused) this.audio.pause()

    if (!this.stream.connect || !this.stream.mediaStream.active) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(e => {
          this.enabled = true
          this.stream = this.audioContext.createMediaStreamSource(e)
          this.stream.connect(this.output)
        })
        .catch(() => {
          this.enabled = false
        })
    }
  }
}
