<script lang="ts">
  import { page } from "$app/stores";
  import { ui } from "$lib/store";
  import type { IPost } from "$lib/types";

  const posts = $page.data.posts.filter(
    (p: IPost) => p.meta.isPublished
  ) as IPost[];
  posts.sort((p1, p2) => (p2.meta.dateCreated < p1.meta.dateCreated ? -1 : 1));
</script>

<article class="my-info">
  <figure class="profile-img">
    <img src="/images/family-pic.png" />
  </figure>
  <section class="about-article">
    <h3>Hi, I'm Jamie.</h3>
    <p>
      I've been a Software Engineer for almost 15 years, and most recently,
      Director of Software. I started as an intern at IBM, then worked at an
      agency in London, UK, and finally settled in Toronto Canada.
    </p>
    <p>
      I'm currently working for{" "}
      <a href="https://points.com" target="_blank">
        Points (a Plusgrade company)</a
      >, a great company based in Canada with a strong focus on culture,
      engineering and work life balance.
    </p>
    <p>
      When I'm not working you can find me playing boardgames, volleyball,
      pickleball or golf. Otherwise, I'll be coding away at my side projects.
    </p>
    <p>If all else fails, you can find me with my family.</p>

    <p>
      If you'd like to get in touch, you can reach me on{" "}
      <a href="https://www.linkedin.com/in/jamieweatherby/">LinkedIn</a> or
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span
        role="link"
        tabindex="0"
        on:click|preventDefault={() => {
          $ui.popup.id = "contact-form";
        }}>by email</span
      >.
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
