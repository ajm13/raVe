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
      <section class="accordion" :class="{ 'open': section === 'mac' }">
        <h3 class="accordion__header" @click="toggleSection('mac')">
          <div>macOS</div>
          <i class="material-icons">keyboard_arrow_{{ section === 'mac' ? 'up' : 'down' }}</i>
        </h3>
        <div class="accordion__content">
          <p class="img">
            <img src="@/assets/loopback.jpg" alt="loopback">
          </p>
          <p>To enable music streaming to
            <rave/> on macOS, you must first download and install
            <a href="https://rogueamoeba.com/loopback/" target="_blank">Loopback</a>.
            <strong>Loopback</strong> is an application that allows you to route audio between
            applications in macOS.
          </p>
          <p class="img">
            <img src="@/assets/loopback-settings.jpg" alt="loopback-settings">
          </p>
          <p>Once
            <strong>Loopback</strong> is installed, create a "New Virtual Device" and add
            the application your music is playing from as a source. Make sure both
            the "Mute audio sources" and "Monitor audio through" options are not
            checked.
          </p>
          <p>After setting up
            <strong>Loopback</strong>, open System Preferences &gt; Sound &gt; Input, and
            make sure "Loopback Audio" is selected as the default input device.</p>
          <p>
            <strong>Note</strong>:
            <strong>Loopback</strong>'s free trial will start to distort the sound after
            a short while of using it. This isn't too noticeable on
            <rave/>, but if it bothers you, consider supporting
            <strong>Rogue Amoeba</strong> and purchasing a full license of
            <strong>Loopback</strong>
          </p>
        </div>
      </section>
      <section class="accordion" :class="{ 'open': section === 'windows' }">
        <h3 class="accordion__header" @click="toggleSection('windows')">
          <div>Windows</div>
          <i class="material-icons">keyboard_arrow_{{ section === 'windows' ? 'up' : 'down' }}</i>
        </h3>
        <div class="accordion__content">
          <p>To enable music streaming to
            <rave/> on Windows, you can use Windows' built-in Stereo Mix input source.</p>
          <p class="img">
            <img src="@/assets/windows-menu.jpg" alt="windows-menu">
          </p>
          <p>First, search "Sound" in the Windows menu and click on "Sound Control Panel"</p>
          <p class="img">
            <img src="@/assets/windows-sound.jpg" alt="windows-sound">
          </p>
          <p>When the Sound Control Panel opens, go to the Recording tab. Right click
            on Stereo Mix and click "Set as Default Device". If Stereo Mix doesn't
            show up, you may have to right click and enable "Show Disabled Devices",
            then right click on Stereo Mix and enable it first.</p>
          <p>
            <strong>Note</strong>: Stereo mix only works when you are ouputting to an analog
            device (like a headphone or speaker jack, not HDMI), and the volume on
            your computer affects the volume of the audio
            <rave/> receives. This works best when you have an external volume control on
            your speakers or headphones, so you can set the Windows volume to 100%
            and adjust it down on your listening device.
          </p>
        </div>
      </section>
      <p>Once the above instructions have been followed, click the microphone button
        on the bottom control bar to begin visualizing the streaming audio.</p>
    </section>
  </div>
</template>

<script>
export default {
  data: () => ({
    section: ''
  }),

  methods: {
    toggleSection(section) {
      this.section = this.section === section ? '' : section
    }
  },

  created() {
    const platform = navigator.platform.toLowerCase()
    const isMac = platform.includes('mac')
    const isWin = platform.includes('win')

    if (isMac) this.section = 'mac'
    if (isWin) this.section = 'windows'
  }
}
</script>

<style lang="scss">
.accordion {
  &:not(.open) {
    margin-bottom: 1em;
  }

  &:not(.open) &__content {
    display: none;
  }

  &__header {
    display: flex;
    cursor: pointer;
  }
}
</style>
