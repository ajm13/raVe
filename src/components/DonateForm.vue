<template>
  <div class="donate-form">
    <h1>Enjoying <rave />?</h1>
    <p>
      I have been working on perfecting <rave /> for release for over 3 years, and am super proud of
      how it turned out.
    </p>
    <p>If you really enjoy it, buy me a coffee or pizza to show your appreciation!</p>
    <div class="donate-buttons">
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="VBWZT7MEPRUDC" />
        <input type="submit" class="btn" value="☕️ $3 coffee" />
      </form>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="992Q6KREWEUHW" />
        <input type="submit" class="btn" value="🍕 $10 pizza" />
      </form>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="52GC7VY5GXVVC" />
        <input type="submit" class="btn" value="💜 custom amount" />
      </form>
    </div>
    <div class="donate-crypto">
      <div
        v-for="{ name, address } of cryptos"
        :key="name"
        class="crypto-link"
        @click="copy(address)"
      >
        <img :src="`/crypto/${name}.svg`" :alt="name" />
        <div class="crypto-link__qr">
          <h3>{{ name.toUpperCase() }}</h3>
          <img :src="`/crypto/${name}.jpg`" :alt="name + ' qr code'" />
          <div>{{ copied === address ? 'copied' : address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    copied: false,
    copyTO: null,
    cryptos: [
      {
        name: 'btc',
        address: '33JxJQe3zvXovfdZDkk4v17BsEtji3UYt1'
      },
      {
        name: 'eth',
        address: '0xee684b7c7e5b0b4dcced0624606ed1f8656d95fe'
      },
      {
        name: 'ltc',
        address: 'MDA8mt5iS7jS2bXJ2riqvEX1WdaQPzqjfu'
      }
    ]
  }),

  methods: {
    copy(text) {
      const el = document.createElement('textarea')
      // el.classList.add('visually-hidden')

      el.value = text
      document.body.appendChild(el)

      el.select()
      document.execCommand('copy')

      document.body.removeChild(el)
      this.copied = text
      clearTimeout(this.copyTO)
      this.copyTO = setTimeout(() => (this.copied = false), 1500)
    }
  },

  destroyed() {
    clearTimeout(this.copyTO)
  }
}
</script>

<style lang="scss">
.donate-form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  max-width: 320px;
  text-align: center;

  .donate-buttons {
    width: 200px;

    .btn {
      width: 100%;
      margin-bottom: 0.5rem;
    }
  }

  .donate-crypto {
    position: relative;
    display: flex;
  }
}

.crypto-link {
  position: relative;
  cursor: pointer;
  padding: 1em;

  &:hover &__qr {
    pointer-events: initial;
    opacity: 1;
    transform: translate(-50%, -100%);
  }

  &__qr {
    pointer-events: none;
    opacity: 0;

    position: absolute;
    top: -0.5em;
    left: 50%;
    transform: translate(-50%, -110%);

    padding: 1em;
    border-radius: var(--border-radius);
    background: #111;

    transition: all 0.3s ease;

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -0.9em;
      transform: translateX(-50%);

      width: 0;
      height: 0;
      border-left: 1em solid transparent;
      border-right: 1em solid transparent;
      border-top: 1em solid #111;
    }

    h3 {
      margin: 0;
    }

    img {
      width: 200px;
      padding: 10px;
      margin: 1em;
      background: #fff;
    }

    div {
      max-width: 210px;
      word-wrap: break-word;
    }
  }
}
</style>
