<svelte:head>
	<script defer data-domain="jweatherby.dev" src="https://plausible.io/js/plausible.js"></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@picocss/pico@next/css/pico.min.css"
	/></svelte:head
>
<nav class='container'>
	<ul><li>
    <h1><a href='/'>&lt;jweatherby.dev /&gt;</a></h1>
  </li></ul>
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
