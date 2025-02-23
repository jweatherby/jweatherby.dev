<script lang="ts">
  import { page } from "$app/stores";
  import type { IPost } from "$lib/types";

  import settings from "$settings";
  const metaInfo = {
    title: "jweatherby.dev",
    description: "The personal site of Jamie Weatherby",
    url: settings.ROOT_DOMAIN,
    image: settings.ROOT_DOMAIN + "/images/family-pic.png",
  };

  const posts = $page.data.posts.filter(
    (p: IPost) => p.meta.isPublished
  ) as IPost[];
  posts.sort((p1, p2) => (p2.meta.dateCreated < p1.meta.dateCreated ? -1 : 1));
  const unpubPosts = $page.data.posts.filter(
    (p: IPost) => !p.meta.isPublished
  ) as IPost[];
</script>

<svelte:head>
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
<article class="my-info">
  <figure class="profile-img">
    <img src="/images/profile-sq.png" alt="Jamie on a mountain" />
  </figure>
  <section class="about-article">
    <h3>Hi, I'm Jamie.</h3>
    <p>
      I've been in Software for 15 years, and most recently, Director of
      Software at Points (a Plusgrade company), based out of Toronto Canada.
    </p>
    <p>
      Outside of work, you can find me hacking at side projects, building
      elaborate Notion things, playing sports or boardgames, or hanging out with
      my family.
    </p>
    <p>These are the things I've built that are still hanging around:</p>
    <ul>
      <li>
        <a href="https://www.notion.com/@jweatherby" target="_blank"
          >Notion templates</a
        >
        - Just the
        <a href="https://www.notion.com/templates/lean-coffee" target="_blank"
          >Lean Coffee template</a
        > for now, more to follow
      </li>
      <li>
        <a href="https://tendee.co" target="_blank">Tendee</a> - A versatile scheduling
        app with an emphasis on recurring events and polls
      </li>
      <li>
        <a href="https://showboard.ca/" target="_blank">Showboard</a> - A collaborative
        full-text bookmarking / archival / note taking tool with a pinterest like
        interface
      </li>
    </ul>
    <p>
      If you'd like to follow along with what I'm currently working on or get in
      touch, you can find me on{" "}
      <a href="https://bsky.app/profile/jweatherby.bsky.social" target="_blank"
        >Bluesky</a
      >
      or{" "}
      <a href="https://www.linkedin.com/in/jamieweatherby/" target="_blank"
        >LinkedIn</a
      >. You can also get in touch
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a href="/contact">by email</a>.
    </p>
  </section>
</article>

<article>
  <h3 class="blog-title">Blog posts</h3>
  <ul>
    {#each posts as post}
      <li>
        <a href={`/posts/${post.slug}`}>{post.meta.title}</a> - {post.meta.dateCreated.toLocaleDateString(
          "en-ca",
          { day: "numeric", month: "short", year: "numeric" }
        )}
      </li>
    {/each}
  </ul>
  <ul class="hidden-posts">
    {#each unpubPosts as post}
      <li>
        <a href={`/posts/${post.slug}`}>{post.meta.title}</a> - {post.meta.dateCreated.toLocaleDateString(
          "en-ca",
          { day: "numeric", month: "short", year: "numeric" }
        )}
      </li>
    {/each}
  </ul>
</article>

<style lang="scss">
  .hidden-posts {
    display: none;
  }
  .my-info {
    margin-top: 2rem;
  }

  .profile-img {
    text-align: center;
  }

  .profile-img img {
    height: 150px;
    border-radius: 50%;
  }
</style>
