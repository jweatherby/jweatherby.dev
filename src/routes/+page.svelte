<script lang="ts">
  import { page } from "$app/stores";
  import { ui } from "$lib/store";
  import type { IPost } from "$lib/types";

  const posts = $page.data.posts.filter(
    (p: IPost) => p.meta.isPublished
  ) as IPost[];
  posts.sort((p1, p2) => p2.meta.title.localeCompare(p1.meta.title));
</script>

<article class="my-info">
  <figure class="profile-img">
    <img src="/images/profile-in-grass-sq-600px.png" />
  </figure>
  <section class="about-article">
    <h2>Hi, I'm Jamie.</h2>
    <p>
      I've been a Software Engineer for almost 15 years, and most recently,
      Director of Software. I started as an intern at IBM, then worked at an
      agency in London, UK, and finally settled in Toronto Canada. I love
      travelling, playing sports and am an avid casual boardgamer.
    </p>
    <p>
      I'm currently working for{" "}
      <a href="https://points.com" target="_blank"> Points </a>
      , a great company based in Toronto, Canada with a strong focus on culture,
      engineering and work life balance.
    </p>
    <p>
      If you'd like to get in touch, you can find me on{" "}
      <a href="https://www.linkedin.com/in/jamieweatherby/">LinkedIn</a> or
      <a

        href="#contact"
        on:click|preventDefault={() => {
          $ui.popup.id = "contact-form";
        }}>by email</a
      >.
    </p>
  </section>
</article>

<article>
  <h2 class="blog-title">Blog posts</h2>
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
</article>

<style lang="scss">
  .my-info {
    margin-top: 2rem;
  }
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    &.blog-title {
      text-transform: uppercase;
    }
  }

  .profile-img {
    text-align: center;
  }

  .profile-img img {
    height: 150px;
    border-radius: 50%;
  }
</style>
