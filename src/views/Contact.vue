<template>
  <div class="contact center">
    <div class="contact-form">
      <h1>Contact</h1>
      <p>
        Loving
        <rave/>? Have comments, questions, or suggestions?
      </p>
      <p>
        Want to use <rave/> at a public venue? Or have a custom version of <rave/> built just for you?
      </p>
      <p>
        Email me at
        <a :href="`mailto:${user}@${domain}`">{{ user }}@{{ domain }}</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: 'rave.ajm13',
    domain: 'gmail.com'
  })
}
</script>

<style lang="scss">
.contact-form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  max-width: 320px;
  text-align: center;
}
</style>
