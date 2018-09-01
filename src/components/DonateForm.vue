<template>
  <div class="donate-form">
    <h1>Enjoying
      <rave/>?</h1>
    <p>
      I have been working on perfecting
      <rave/> for release for over 3 years, and am super proud of how it turned out.</p>
    <p>If you really enjoy it, buy me a coffee or pizza to show your appreciation!</p>
    <div class="donate-buttons">
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="VBWZT7MEPRUDC">
        <input type="submit" class="btn" value="☕️ $3 coffee">
      </form>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="992Q6KREWEUHW">
        <input type="submit" class="btn" value="🍕 $10 pizza">
      </form>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="52GC7VY5GXVVC">
        <input type="submit" class="btn" value="💜 custom amount">
      </form>
    </div>
  </div>
</template>

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
}
</style>
