<template>
  <div class="setup page">
    <h1>Setup</h1>
    <section>
      <h2>Local Audio Files</h2>
      <p>
        To use
        <rave/> with local audio files, simply drag and drop the files onto
        <rave/>. Dropping files will add them to the queue, which can be accessed by the
        rightmost icon on the bottom control bar.
      </p>
    </section>
    <section>
      <h2>Music Streaming Services</h2>
      <p>
        While
        <rave/> does not natively support music streaming from Spotify or Soundcloud, it
        is possible with the help of outside software or system settings. This involves
        routing the computer's audio to the microphone, which
        <rave/> is then able to access. To enable visualization of streaming sources, follow
        the relevant instructions for your operating system:
      </p>
      <section>
        <h3>macOS</h3>
        <p>To enable music streaming to
          <rave/> on macOS, you must first download and install
          <a href="https://rogueamoeba.com/loopback/" target="_blank">Loopback</a>.
          <strong>Loopback</strong> is an application that allows you to route audio between
          applications in macOS.
        </p>
        <p>Once
          <strong>Loopback</strong> is installed, create a "New Virtual Device" and add the
          application your music is playing from as a source. Make sure both the
          "Mute audio sources" and "Monitor audio through" options are not checked.</p>
        <p>After setting up
          <strong>Loopback</strong>, open System Preferences &gt; Sound &gt; Input, and make
          sure "Loopback Audio" is selected as the default input device.</p>
        <p>
          <strong>Note</strong>:
          <strong>Loopback</strong>'s free trial will start to distort the sound after a
          short while of using it. This isn't too noticeable on
          <rave/>, but if it bothers you, consider supporting
          <strong>Rogue Amoeba</strong> and purchasing a full license of
          <strong>Loopback</strong>
        </p>
      </section>
      <section>
        <h3>Windows</h3>
        <p>To enable music streaming to
          <rave/> on Windows, you can use Windows' built-in Stereo Mix input source.</p>
      </section>
      <p>Once the above instructions have been followed, click the microphone button
        on the bottom control bar to begin visualizing the streaming audio.</p>
    </section>
  </div>
</template>
