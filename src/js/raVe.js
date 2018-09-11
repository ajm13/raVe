/* eslint-disable */

import Visualizer from './Visualizer'
import Utils from './Utils'

let { abs, cos, floor, max, min, sin, PI } = Math
let tau = 2 * PI

function poly(n = 0, a = 0, r = 1) {
  let pin = PI / n
  if (n !== 0) r *= cos(pin) / cos(((a + 0.5 * PI) % (2 * pin)) - pin)
  return { x: r * cos(a), y: r * sin(a) }
}

export default class extends Visualizer {
  constructor(options, settings) {
    super(options, settings)
    this.analyzer.setOptions([
      {
        filters: [{ type: 'lowpass', frequency: 5000 }],
        smoothingTimeConstant: 0.2,
        minDecibels: -70,
        maxDecibels: -30,
        dataType: 'byte',
        dataSet: 'both'
      },
      {
        filters: [{ type: 'lowpass', frequency: 100 }],
        dataType: 'float',
        dataSet: 'time'
      }
    ])

    this.buffer = this.createBuffer()
    this.buf = this.buffer.getContext('2d', { alpha: false })
    this.ctx = this.canvas.getContext('2d', { alpha: false })
    this.bassbuf = new Array(15).fill(0)
    super.render()
  }

  drawInner(ctx, data, bass, bassSpike, R, white) {
    let l = floor(data[0].time.length / 3)

    let d128 = 1 / 128
    let d2l = 1 / (2 * l)

    ctx.save()

    if (white) {
      // ctx.fillStyle = `hsl(0, 0%, ${bassSpike ? 100 : 0}%)`
      ctx.fillStyle = '#000'
      ctx.strokeStyle = '#fff'
    } else {
      let h = this.tick / 10 + 10 * sin(this.tick / 10)
      let l = 55 - 20 * bass
      ctx.strokeStyle = `hsl(${h % 360}, 100%, ${l}%)`
      ctx.globalCompositeOperation = 'lighter'
    }

    ctx.lineWidth = bassSpike ? (white ? 3 : 5) : 1

    let start = floor(0.5 * l)
    let end = floor(1.5 * l)
    let offset = Utils.getMaxes(data[0].time, 1, start, end)[0][0] - start

    let q = 0.5 + 0.5 * cos(this.tick / 500)

    ctx.beginPath()
    for (let j = 0; j < 2 * l; j += 2) {
      let i = ~~abs(l - (j % (2 * l)))
      let t0 = data[0].time[i + offset] * d128 - 1
      let t1 = data[0].time[i + offset + 1] * d128 - 1
      let r = R + 10 * (t0 + t1) + 20 * bass
      let a = tau * (j * d2l) - 0.5 * PI

      let s0 = poly(0, a, r)
      let s1 = poly(6, a, 1.25 * r)
      let x = Utils.lerp(s0.x, s1.x, q)
      let y = Utils.lerp(s0.y, s1.y, q)

      ctx[j == 0 ? 'moveTo' : 'lineTo'](x, y)
    }
    if (white) ctx.fill()
    ctx.closePath()
    ctx.stroke()

    ctx.restore()
  }

  drawOuter(ctx, data, bass, R, white) {
    let l = floor(data[0].freq.length / 3)
    let avg = Utils.average(data[0].freq, 1, l)
    let rs = 1 + avg / 255

    let d255 = 1 / 255
    let d4l = 1 / (4 * l)

    ctx.save()

    if (white) {
      ctx.fillStyle = '#fff'
    } else {
      let h = this.tick / 10 + 10 + 10 * sin(this.tick / 10)
      let l = 52 + floor(bass * 5)
      ctx.fillStyle = `hsl(${h % 360}, 100%, ${l}%)`
      ctx.globalCompositeOperation = 'lighter'
    }

    let q = 0.5 + 0.5 * cos(this.tick / 500)

    ctx.beginPath()
    for (let j = 0; j < 4 * l; j++) {
      let i = ~~abs(l - (j % (2 * l)))
      let f = rs * max(0, data[0].freq[i] - avg) * d255
      let t = data[1].time[i * 2] + 0.5
      let r = R + 50 * (f + t)
      let a = tau * j * d4l + 0.5 * PI

      let s0 = poly(0, a, r)
      let s1 = poly(6, a, 1.25 * r)
      let x = Utils.lerp(s0.x, s1.x, q)
      let y = Utils.lerp(s0.y, s1.y, q)

      ctx[j == 0 ? 'moveTo' : 'lineTo'](x, y)
    }

    R -= 50 * bass ** 2

    for (let j = 0; j < 4 * l; j++) {
      let i = ~~abs(l - (j % (2 * l)))
      let f = rs * max(0, data[0].freq[i] - avg) * d255
      let t = data[1].time[i * 2] + 0.5
      let r = R + 50 * (t - 0.5 * f) - 1.5 * white
      let a = tau - tau * j * d4l + 0.5 * PI

      let s0 = poly(0, a, r)
      let s1 = poly(6, a, 1.25 * r)
      let x = Utils.lerp(s0.x, s1.x, q)
      let y = Utils.lerp(s0.y, s1.y, q)

      ctx[j == 0 ? 'moveTo' : 'lineTo'](x, y)
    }
    ctx.fill()
    ctx.restore()
  }

  resize() {
    super.resize()
    this.buffer.width = this.canvas.width
    this.buffer.height = this.canvas.height
  }

  render() {
    // don't render if paused
    if (!super.render()) return

    let { ctx, buf } = this
    let cv = this.canvas
    let data = this.analyzer.getData()

    let bass = Utils.max(data[1].time, abs)
    let offset = 1 + bass / 3

    this.bassbuf.shift()
    this.bassbuf.push(bass)
    let bassAvg = Utils.average(this.bassbuf)
    let bassSpike = bass > 0.3 && bass > 1.3 * bassAvg

    bass += 0.1 * (Utils.average(data[0].freq, 0, 2) / 255)

    ctx.clear()
    let s = 1.04

    // draw buffer scaled up for hyperspace
    ctx.drawImage(this.buffer, -0.5 * cv.w * s, -0.5 * cv.h * s, cv.w * s, cv.h * s)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(-0.5 * cv.w, -0.5 * cv.h, cv.w, cv.h)

    let r1 = 0.05 * cv.h
    let r2 = 4 * r1 * offset

    // draw color
    this.drawInner(ctx, data, bass, bassSpike, r1, false)
    this.drawOuter(ctx, data, bass, r2, false)

    // copy to buffer
    buf.clear()
    buf.drawImage(cv, 0, 0)

    // draw white
    this.drawInner(ctx, data, bass, bassSpike, r1, true)
    this.drawOuter(ctx, data, bass, r2, true)
  }

  destroy() {
    super.destroy()
    delete this.ctx
    delete this.buf
    delete this.buffer
    delete this.bassbuf
  }
}
