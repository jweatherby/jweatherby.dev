<script lang="ts">
  import ContactForm from "../ContactForm.svelte";

  function closePopup() {
    window.history.back();
  }
</script>

<dialog open>
  <article>
    <header>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span
        role="button"
        tabindex="0"
        class="close"
        on:click|preventDefault={closePopup}
      />
      Get in touch
    </header>
    <ContactForm />
  </article>
</dialog>
