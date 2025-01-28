<script lang="ts">
  import { page } from "$app/stores";
  import settings from "$settings";

  let post = $page.data.post;
</script>

<svelte:head>
  <title>{post.meta.title} | jweatherby.dev</title>

  <meta property="description" content={post.blurb} />
  <meta
    property="image"
    content={post.meta.imageSrc.match(/^\//)
      ? settings.ROOT_DOMAIN + post.meta.imageSrc
      : post.meta.imageSrc}
  />
  <meta
    property="og:url"
    content={settings.ROOT_DOMAIN + `/posts/${post.slug}`}
  />
  <meta property="og:title" content={post.meta.title} />
  <meta
    property="og:image"
    content={post.meta.imageSrc.match(/^\//)
      ? settings.ROOT_DOMAIN + post.meta.imageSrc
      : post.meta.imageSrc}
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
    content={post.meta.imageSrc.match(/^\//)
      ? settings.ROOT_DOMAIN + post.meta.imageSrc
      : post.meta.imageSrc}
  />
  <meta property="twitter:description" content={post.meta.blurb} />
  <meta property="twitter:card" content="summary" />
</svelte:head>

<section class="blog-post">
  <header class="post-header">
    <figure class="post-image">
      <img
        src={post.meta.imageSrc}
        alt={post.meta.imageAlt}
        title={post.meta.imageAlt}
      />
      <figcaption>{post.meta.imageCredit}</figcaption>
    </figure>
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
    <aside class="disclaimer">
      Everything writtern here is my own opinion and not representative of my
      employer or any other persons.
    </aside>
  </header>
  <div class="post-content" id="blog-post">
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
      or <a href="/contact">by email</a>.
    </aside>
  </footer>
</section>

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
  .disclaimer {
    margin: 16px 0;
    // font-size: 0.8rem;
    font-style: italic;
    color: var(--pico-secondary);
  }
  .post-followup {
    margin-top: 8px;
    font-style: italic;
  }

  .post-image {
    position: relative;
    img {
      max-height: 200px;
    }
    figcaption {
      // padding: 8px 0px;
      font-size: 0.6rem;
    }
  }

  .post-title {
    font-size: 40px;
    color: var(--pico-contrast);
    font-weight: 700;
    // text-transform: uppercase;
  }
  #blog-post {
    // padding: 0 16px;
    line-height: 1.8;
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
