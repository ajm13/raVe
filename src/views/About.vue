<template>
  <div class="about page">
    <h1>About</h1>
    <section>
      <h2>What is <rave />?</h2>
      <p><rave /> stands for <strong>real-time audio visualizer experience</strong>.</p>
      <p>
        Most music visualizers available right now, such as the ones found in iTunes and Windows
        Media Player, don't offer true "music visualization," but rather "music synched visuals."
        They typically have a predetermined animation, where different aspects of it will change
        when a beat is detected in the song.
      </p>
      <p>
        <rave /> isn't an animation that reacts to the beat, but rather a true visualization of the
        audio data itself. The frequencies and waveforms of the incoming audio are used to generate
        <rave />'s rings, and the previous frames expand out from the center to display the history
        of the audio.
      </p>
      <p>
        Because <rave /> uses all of the audio data available to it for visualization, every song is
        visually unique. The same goes for the vocals; singers' voices are visually distinct as they
        contain different harmonics and waveform types. Unique sounds in songs look amazing, and in
        my opinion, the best songs to watch on <rave /> are chill songs with not too much going on.
      </p>
    </section>
    <section>
      <h2>Technical Details</h2>
      <p>
        <rave /> uses the <strong>Web Audio API</strong> and <strong>Canvas API</strong> to collect
        and draw the audio data in real-time.
      </p>
      <p>
        With <strong>Web Audio API</strong>, you can create different types of nodes to route audio
        through, including <strong>AnalyserNode</strong> and <strong>BiquadFilterNode</strong>.
        These two nodes are the key pieces to making <rave /> work.
      </p>
      <p>
        <strong>AnalyserNode</strong> is a wonderful little piece of
        <strong>Web Audio API</strong> that allows you to sample frequency and time domain data from
        the audio source. Frequency data gives the amplitudes of frequency bins starting at
        0&nbsp;Hz up to about 22&nbsp;KHz, with a bin width of about 22&nbsp;Hz. Time domain data is
        the waveform of the audio, or how the speaker film would vibrate to output the audio.
      </p>
      <p>
        <strong>BiquadFilterNode</strong> is a node that you can connect audio through to apply
        different biquad filters, such as highpass or lowpass. These filters allow <rave /> to
        filter out different frequencies to make the visuals more aesthetic. For example, the entire
        audio source is run through a lowpass filter of 5&nbsp;KHz, so that snares and "sss" noises
        don't brighten <rave /> too much.
      </p>
    </section>
    <section>
      <h2>Anatomy of<rave /></h2>
      <p class="img">
        <img src="@/assets/anatomy.jpg" alt="anatomy of raVe" />
      </p>
      <p>
        <rave /> generates 2 rings from the audio data, and both rings slowly morph between a circle
        and hexagon.
      </p>
      <p>
        The inner ring is the audio waveform applied to the ring's shape, and mirrored along the
        y-axis.
      </p>
      <p>
        The outer ring is made up of both frequency and time domain data, and is symmetric over both
        the x and y axes. The frequency data goes from 0&nbsp;Hz at the horizon to about 7&nbsp;KHz
        at the top and bottom. The time domain data used for the outer ring is filtered to only show
        bass frequencies.
      </p>
    </section>
  </div>
</template>
