<script lang="ts">
  import { ui } from "$lib/store";
  import "$lib/globals.scss";
  import ContactForm from "./ContactForm.svelte";
  import settings from "$settings";
  const metaInfo = {
    title: "jweatherby.dev",
    description: "The personal site of Jamie Weatherby",
    url: settings.ROOT_DOMAIN,
    image: settings.ROOT_DOMAIN + "/images/family-pic.png",
  };
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
  <title>{metaInfo.title}</title>
  <meta property="description" content={metaInfo.description} />
  <meta property="og:url" content={metaInfo.url} />
  <meta property="og:title" content={metaInfo.title} />
  <meta property="og:image" content={metaInfo.image} />
  <meta property="og:description" content={metaInfo.description} />
  <meta property="og:type" content="website" />

  <meta property="twitter:url" content={metaInfo.url} />
  <meta property="twitter:title" content={metaInfo.title} />
  <meta property="twitter:image" content={metaInfo.image} />
  <meta property="twitter:description" content={metaInfo.description} />
  <meta property="twitter:card" content="summary" />
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
