export default {
  time(fn) {
    let s = Date.now()
    fn()
    return Date.now() - s
  },

  average(data, start, end, f) {
    start = start || 0
    end = end || data.length
    let avg = 0

    for (let i = start; i < end; i++) {
      avg += f ? f(data[i]) : data[i]
    }

    avg /= end - start
    return avg
  },

  clamp(x, min, max) {
    return Math.max(min, Math.min(max, x))
  },

  lerp(a, b, n) {
    return n * (b - a) + a
  },

  max(data, f) {
    let l = data.length
    let m = -Infinity

    for (let i = 0; i < l; i++) {
      let d = f ? f(data[i]) : data[i]
      if (d > m) m = d
    }

    return m
  },

  getMaxes(data, n, start, end, f) {
    start = start || 0
    end = end || data.length
    let maxes = []

    for (let i = start; i < end; i++) {
      let v = f ? f(data[i]) : data[i]

      if (maxes.length < n || v > maxes[n - 1][1]) {
        if (maxes.length == n) maxes.pop()

        maxes.push([i, v])
        maxes.sort((a, b) => b[1] - a[1])
      }
    }

    return maxes
  },

  dist(x1, y1, x2, y2) {
    let dx = x2 - x1
    let dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }
}
