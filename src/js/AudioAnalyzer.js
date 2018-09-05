if (!AnalyserNode.prototype.getFloatTimeDomainData) {
  let u8data = []
  const d127 = 1 / 127.5

  AnalyserNode.prototype.getFloatTimeDomainData = function(data) {
    if (u8data.length !== data.length) {
      u8data = new Uint8Array(data.length)
    }

    this.getByteTimeDomainData(u8data)
    for (let i = 0; i < data.length; i++) {
      data[i] = (u8data[i] - 127.5) * d127
    }
  }
}

export default class AudioAnalyzer {
  constructor(audioContext, audioSource) {
    this.audioContext = audioContext
    this.audioSource = audioSource

    this.analyzers = []
  }

  setOptions(options) {
    // remove old analyzers, maybe not necessary
    for (let analyzer of this.analyzers) analyzer.disconnect()
    this.analyzers = []

    for (let opt of options) {
      let filters = []
      let id = 'src-'
      let r = /.*(pass|shelf)|peaking|notch/

      // create filters
      if (!opt.filters) opt.filters = []
      for (let filter of opt.filters) {
        let bqf = this.audioContext.createBiquadFilter()
        if (filter.type) bqf.type = filter.type
        if (filter.frequency) bqf.frequency.value = filter.frequency
        if (filter.gain) bqf.gain.value = filter.gain
        if (filter.Q) bqf.Q.value = filter.Q
        else filter.Q = bqf.Q.value
        filters.push(bqf)

        // generate informative id from settings
        let m = r.exec(filter.type)
        id += m[0][0] + (m[1] ? m[1][0] : '') + filter.frequency + 'q' + filter.Q + '-'
      }

      // set analyzer variables
      let ana = this.audioContext.createAnalyser()

      if (!isNaN(opt.smoothingTimeConstant)) ana.smoothingTimeConstant = opt.smoothingTimeConstant
      if (!isNaN(opt.minDecibels)) ana.minDecibels = opt.minDecibels
      if (!isNaN(opt.maxDecibels)) ana.maxDecibels = opt.maxDecibels
      if (!isNaN(opt.fftSize)) ana.fftSize = opt.fftSize

      ana.dataType = opt.dataType
      ana.dataSet = opt.dataSet
      ana.data = {}
      ana.id = id + 'ana'

      // get audio data and put into arrays
      ana.getData = function() {
        let data = {}

        if (this.dataSet == 'both' || this.dataSet == 'frequency') {
          this.dataType == 'float'
            ? this.getFloatFrequencyData(this.data.freq)
            : this.getByteFrequencyData(this.data.freq)
          data['freq'] = this.data.freq
        }

        if (this.dataSet == 'both' || this.dataSet == 'time') {
          this.dataType == 'float'
            ? this.getFloatTimeDomainData(this.data.time)
            : this.getByteTimeDomainData(this.data.time)
          data['time'] = this.data.time
        }

        return data
      }

      // set up data arrays
      let TypeArray = opt.dataType == 'float' ? Float32Array : Uint8Array

      if (opt.dataSet == 'both' || opt.dataSet == 'frequency') {
        ana.data.freq = new TypeArray(ana.fftSize / 2)
      }
      if (opt.dataSet == 'both' || opt.dataSet == 'time') {
        ana.data.time = new TypeArray(ana.fftSize)
      }

      // local audioSource for channel routing
      let audioSource = this.audioSource

      // split the channels if specified
      if (opt.channel == 'left' || opt.channel == 'right') {
        let channel = opt.channel == 'left' ? 0 : 1,
          splitter = this.audioContext.createChannelSplitter(2)

        audioSource = this.audioContext.createGain()
        this.audioSource.connect(splitter)
        splitter.connect(
          audioSource,
          channel
        )

        ana.id += 'lr'[channel]
      }

      // connect filters or src to dest if none
      if (filters.length) {
        audioSource.connect(filters[0])
        for (let i = 0; i < filters.length - 1; i++) {
          filters[i].connect(filters[i + 1])
        }
        filters[filters.length - 1].connect(ana)
      } else audioSource.connect(ana)

      this.analyzers.push(ana)
    }
  }

  getData() {
    let ret = []

    for (let analyzer of this.analyzers) {
      let data = analyzer.getData()
      data.id = analyzer.id
      ret.push(data)
    }

    return ret
  }
}
