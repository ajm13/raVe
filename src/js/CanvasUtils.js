CanvasRenderingContext2D.prototype.fullscreen = function(s, w, h) {
  w = w ? w : window.innerWidth
  h = h ? h : window.innerHeight

  // this.canvas.style.width = w + 'px'
  // this.canvas.style.height = h + 'px'
  this.canvas.width = w * s
  this.canvas.height = h * s
  this.canvas.w = w
  this.canvas.h = h

  let ss = this.strokeStyle
  let fs = this.fillStyle

  this.setTransform(1, 0, 0, 1, 0, 0)
  this.translate((w * s) / 2, (h * s) / 2)
  this.scale(s, s)

  this.strokeStyle = ss
  this.fillStyle = fs
}

CanvasRenderingContext2D.prototype.clear = function() {
  this.save()
  this.setTransform(1, 0, 0, 1, 0, 0)
  this.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.restore()
}
