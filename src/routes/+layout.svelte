<script lang="ts">
  import { ui } from "$lib/store";
  import "$lib/globals.scss";
  import ContactForm from "./ContactForm.svelte";
</script>

<svelte:head>
  <script
    defer
    data-domain="jweatherby.dev"
    src="https://plausible.io/js/plausible.js"
  ></script>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@picocss/pico@next/css/pico.min.css"
  />
</svelte:head>

{#if $ui.popup.id === "contact-form"}
  <dialog open>
    <article>
      <header>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          role="button"
          tabindex="0"
          class="close"
          on:click|preventDefault={() => {
            $ui.popup.id = null;
          }}
        />
        Get in touch
      </header>
      <ContactForm />
    </article>
  </dialog>
{/if}

<nav class="container">
  <ul>
    <li>
      <h1><a href="/">&lt;jw.dev /&gt;</a></h1>
    </li>
  </ul>
  <ul>
    <li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span
        role="button"
        tabindex="0"
        on:click|preventDefault={() => {
          $ui.popup.id = "contact-form";
        }}>Contact</span
      >
    </li>
  </ul>
</nav>
<div class="container">
  <slot />
</div>

<style lang="scss">
  a:hover {
    text-decoration: none;
  }
  .container {
    max-width: 700px;
  }
  h1 {
    margin: 0 0;
  }
</style>
