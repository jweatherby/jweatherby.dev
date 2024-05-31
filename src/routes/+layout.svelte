<script lang="ts">
  import { ui } from "$lib/store";
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
  /></svelte:head
>

{#if $ui.popup.id === "contact-form"}
  <dialog open>
    <article>
      <header>
        <a
          href="#close"
          class="close"
          on:click|preventDefault={() => {
            $ui.popup.id = null;
          }}>&nbsp;</a
        >
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
      <a
        href="#contact"
        on:click|preventDefault={() => {
          $ui.popup.id = "contact-form";
        }}>Contact</a
      >
    </li>
  </ul>
</nav>
<div class="container">
  <slot />
</div>

<style lang="scss">
  :root {
    font-size: 14px;
  }
  a:hover {
    text-decoration: none;
  }
</style>
