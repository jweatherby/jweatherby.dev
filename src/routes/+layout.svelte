<script lang="ts">
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

  <!-- for PROD -->
  <script
    src="https://cdn.paperwall.io/paperwall.js"
    integrity="sha256-qR37nJ1HHp6FUTYY79gyJQlbsL49WVjClH25sWfCcRY="
    crossorigin="true"
  ></script>

  <script type="application/javascript">
    window.onload = () =>
      buildWall({
        siteToken: "Qhf7zPQWSi4",
        articleFinder: {
          selector: "blog-post",
          postUrls: [/\/posts\/.*/],
        },
      });
  </script>
</svelte:head>

<nav class="container no-print">
  <ul>
    <li>
      <h1><a href="/">&lt;jw.dev /&gt;</a></h1>
    </li>
  </ul>
  <ul>
    <li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a role="button" href="/contact">Contact</a>
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
