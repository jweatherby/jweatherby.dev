<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$settings';

	let post = $page.data.post;
</script>

<svelte:head>
	<title>{post.meta.title} | jweatherby.dev</title>

	<meta property="description" content={post.blurb} />

	<meta property="og:url" content={settings.ROOT_DOMAIN + `/posts/${post.slug}`} />
	<meta property="og:title" content={post.meta.title} />
	<meta property="og:image" content={settings.ROOT_DOMAIN + post.imageSrc} />
	<meta property="og:description" content={post.meta.blurb} />
	<meta property="og:type" content="website" />

	<meta property="twitter:url" content={settings.ROOT_DOMAIN + `/posts/${post.slug}`} />
	<meta property="twitter:title" content={post.meta.title} />
	<meta property="twitter:image" content={settings.ROOT_DOMAIN + post.imageSrc} />
	<meta property="twitter:description" content={post.meta.blurb} />
	<meta property="twitter:card" content="summary" />
</svelte:head>

<article class="blog-post">
	<header class="post-header">
		<img src={post.meta.imageSrc} class="post-image" />
		<h2 class="post-title">{post.meta.title}</h2>
		<div class="post-author">Jamie Weatherby</div>
		<div class="post-date">{post.meta.dateCreated}</div>
	</header>

	{@html post.html}

	<footer>
		<div class="post-tags">
			<strong>Tags: </strong>
			<em>{post.meta.tags}</em>
		</div>
		<aside class="post-followup">
			Like what you're reading? Retweet, follow, or send me a message on{' '}
			<a href="https://twitter.com/_jweatherby" target="_blank"> Twitter </a>
			.
		</aside>
	</footer>
</article>

<style lang="scss">
	.post-author {
		font-style: italic;
		font-weight: 700;
	}

	.post-date {
		font-style: italic;
	}

	.post-followup {
		margin-top: 25px;
		font-style: italic;
	}

	.post-image {
		max-height: 200px;
		margin-bottom: 25px;
	}

	.post-content pre code.hljs {
		padding: 0.7rem;
		color: var(--pico-code-color);
	}
	.post-content p code {
		// background-color: var(--pico-background-color);
		padding: 0.175rem;
	}

	.post-content pre code.language-mermaid {
		display: none;
	}
	.post-content pre code.language-mermaid[data-processed='true'] {
		display: block;
	}
  .post-tags {
    em:before {
      content: '#';
    }
  }
</style>
