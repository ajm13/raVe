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

  avgbin(data, n, lengths) {
    n = Math.floor(n)
    let tmpdata = new Array(n).fill(0)
    let bl = Math.floor(data.length / n)

    if (lengths) {
      n = lengths.length
      for (let i = 0; i < n; i++) {
        bl = lengths
        if (bl[i][1] !== undefined) {
          for (let c = 0; c < bl[i][1]; c++) {
            for (let j = 0; j < bl[i][0]; j++) {
              tmpdata[i] += data[bl[i][0] * i + j]
            }
            tmpdata[i] = tmpdata[i] / bl[i][0]
          }
        } else {
          for (let j = 0; j < bl[i]; j++) {
            tmpdata[i] += data[bl[i] * i + j]
          }
          tmpdata[i] = tmpdata[i] / bl[i]
        }
      }
    } else {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < bl; j++) {
          tmpdata[i] += data[bl * i + j]
        }
        tmpdata[i] = tmpdata[i] / bl
      }
    }
    return tmpdata
  },

  remap(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
  },

  dist(x1, y1, x2, y2) {
    let dx = x2 - x1
    let dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }
}
