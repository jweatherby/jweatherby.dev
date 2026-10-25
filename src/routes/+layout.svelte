<script lang="ts">
  import { resolve } from "$app/paths";
  import "$lib/globals.scss";
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

<nav class="container no-print">
  <ul>
    <li>
      <h1><a href={resolve("/")}>&lt;jw.dev /&gt;</a></h1>
    </li>
  </ul>
  <ul>
    <li><a href="https://blog.jweatherby.dev">Blog</a></li>
    <li>
      <a role="button" href={resolve("/contact")}>Contact</a>
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
  @media print {
    .no-print,
    .no-print * {
      display: none !important;
    }
    .container {
      max-width: 100vw;
    }
  }
</style>
