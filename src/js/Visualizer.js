export default class Visualizer {
  constructor(options, settings) {
    this.audio = options.audio
    this.analyzer = options.analyzer

    this.container = options.container

    this.scale = options.scale
    this.canvas = document.createElement('canvas')
    this.container.appendChild(this.canvas)

    this.settings = settings
    this.frameID = 0
    this.tick = 0

    this.debug = ''

    this.fps = 0
    this.lastTick = 0

    // hot reload multiple render fix
    this.id = Math.random()
      .toString(16)
      .substr(2)
    this.audio.visID = this.id

    this.fpsID = setInterval(this.calculateFPS.bind(this), 1000)
    this.resizeHandler = this.resize.bind(this)
    addEventListener('resize', this.resizeHandler)
  }

  createBuffer(width = 100, height = 100) {
    let buffer = document.createElement('canvas')
    buffer.width = width
    buffer.height = height
    return buffer
  }

  calculateFPS() {
    this.fps = this.tick - this.lastTick
    this.lastTick = this.tick
  }

  resize() {
    if (!this.ctx) return
    this.ctx.fullscreen(this.scale)
  }

  // returns bool of if should render
  render() {
    // hot reload multiple render fix
    if (this.id != this.audio.visID) return

    let firstRender = this.tick == 0
    if (firstRender) this.resize()

    cancelAnimationFrame(this.frameID)
    this.frameID = requestAnimationFrame(this.render.bind(this))

    let shouldRender = !this.audio.paused || firstRender
    if (shouldRender) this.tick++

    return shouldRender
  }

  destroy() {
    // for fps hot reload drop
    cancelAnimationFrame(this.frameID)
    clearInterval(this.fpsID)
    this.container.removeChild(this.canvas)
    this.audio.visID = 0

    removeEventListener('resize', this.resizeHandler)
  }
}
