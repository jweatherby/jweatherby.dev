<script lang="ts">
  import { page } from "$app/stores";
  import { ui } from "$lib/store";
  import settings from "$settings";

  let post = $page.data.post;
</script>

<svelte:head>
  <title>{post.meta.title} | jweatherby.dev</title>

  <meta property="description" content={post.blurb} />

  <meta
    property="og:url"
    content={settings.ROOT_DOMAIN + `/posts/${post.slug}`}
  />
  <meta property="og:title" content={post.meta.title} />
  <meta
    property="og:image"
    content={settings.ROOT_DOMAIN + post.meta.imageSrc}
  />
  <meta property="og:description" content={post.meta.blurb} />
  <meta property="og:type" content="website" />

  <meta
    property="twitter:url"
    content={settings.ROOT_DOMAIN + `/posts/${post.slug}`}
  />
  <meta property="twitter:title" content={post.meta.title} />
  <meta
    property="twitter:image"
    content={settings.ROOT_DOMAIN + post.meta.imageSrc}
  />
  <meta property="twitter:description" content={post.meta.blurb} />
  <meta property="twitter:card" content="summary" />
</svelte:head>

<article class="blog-post">
  <header class="post-header">
    <img src={post.meta.imageSrc} class="post-image" />
    <h2 class="post-title">{post.meta.title}</h2>
    <div class="post-author">
      <strong>Jamie Weatherby</strong><br />
      <em
        >{post.meta.dateCreated.toLocaleDateString("en-ca", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}</em
      >
    </div>
  </header>
  <div class="post-content">
    {@html post.html}
  </div>

  <footer>
    <div class="post-tags">
      <strong>Tags: </strong>
      {#each post.meta.tags.split(", ") as tag}
        <em>{tag}</em>
      {/each}
    </div>
    <aside class="post-followup">
      Like what you're reading? Get in touch on <a
        href="https://bsky.app/profile/jweatherby.bsky.social"
        target="_blank">Bluesky</a
      >, <a href="https://www.linkedin.com/in/jamieweatherby/">LinkedIn</a>
      or
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a href="/contact">by email</a>.
    </aside>
  </footer>
</article>

<style lang="scss">
  .post-author {
    // margin: 32px 0;
    // display: flex;
    // justify-content: space-between;
    margin-bottom: 16px;
  }
  footer {
    margin-top: 32px;
  }
  .post-date {
    font-style: italic;
  }

  .post-followup {
    margin-top: 8px;
    font-style: italic;
  }

  .post-image {
    max-height: 200px;
    margin-bottom: 25px;
  }

  .post-title {
    font-size: 40px;
    color: var(--pico-contrast);
    font-weight: 700;
    // text-transform: uppercase;
  }

  .post-tags {
    em {
      margin-right: 0.5rem;
      color: var(--pico-secondary);
    }

    em:not(:last-child):after {
      content: ",";
    }
    em:before {
      content: "#";
    }
  }
</style>
