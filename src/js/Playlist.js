export default class Playlist {
  constructor(audio) {
    this.audio = audio
    this.queue = []
    this.shuffle = false
  }

  add(song) {
    this.queue.push(song)

    if (this.audio.src == '' || this.audio.ended) {
      this.next()
    }
  }

  next() {
    if (!this.hasNext()) return

    let i = this.shuffle ? Math.floor(this.queue.length * Math.random()) : 0
    this.dequeue(i)
  }

  dequeue(i) {
    if (this.audio.src.substr(0, 4) == 'blob') {
      window.URL.revokeObjectURL(this.audio.src)
    }

    let song = this.queue.splice(i, 1)[0]
    this.audio.src = song.blob
    this.audio.title = song.title
    this.audio.play()
  }

  hasNext() {
    return !!this.queue.length
  }
}
