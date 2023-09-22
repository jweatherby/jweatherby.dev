import { useEffect, useRef } from "react";
import Head from "next/head";
import hljs from "highlight.js";
import mermaid from "mermaid";
import { getPost, getPosts } from "../../lib/postsApi";

hljs.registerLanguage("python", require("highlight.js/lib/languages/python"));
hljs.registerLanguage("js", require("highlight.js/lib/languages/javascript"));
hljs.registerLanguage("bash", require("highlight.js/lib/languages/bash"));
hljs.registerLanguage("json", require("highlight.js/lib/languages/json"));

export const getStaticProps = async ({ params }) => {
  return { props: { post: getPost(params.slug) } };
};

export async function getStaticPaths() {
  const posts = getPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

export default function Post({ post }) {
  const postRef = useRef(null);

  useEffect(() => {
    if (postRef.current) {
      // Array.from(postRef.current.querySelectorAll('pre code'))
      //   .forEach(block => hljs.highlightBlock(block))
      Array.from(
        postRef.current.querySelectorAll("pre code:not(.language-mermaid)")
      ).forEach((block) => hljs.highlightBlock(block));
      Array.from(
        postRef.current.querySelectorAll("pre code.language-mermaid")
      ).forEach((block) => mermaid.init(null, block));
    }
  }, [postRef]);

  const host = process.env.HOSTNAME || "https://jweatherby.dev";

  return (
    <>
      <Head>
        <title>{post.title} | jweatherby.dev</title>

        <meta property="description" content={post.blurb} />

        <meta property="og:url" content={host + `/posts/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={host + post.imageSrc} />
        <meta property="og:description" content={post.blurb} />
        <meta property="og:type" content="website" />

        <meta property="twitter:url" content={host + `/posts/${post.slug}`} />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:image" content={host + post.imageSrc} />
        <meta property="twitter:description" content={post.blurb} />
        <meta property="twitter:card" content="summary" />
      </Head>
      <article className="blog-post">
        <header className="post-header">
          <img src={post.imageSrc} className="post-image" />
          <h2 className="post-title">{post.title}</h2>
          <div className="post-author">Jamie Weatherby</div>
          <div className="post-date">{post.dateCreated}</div>
        </header>
        <main
          ref={postRef}
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <footer>
          <div className="post-tags">
            <strong>Tags: </strong>
            <em>{post.tags}</em>
          </div>
          <aside className="post-followup">
            Like what you're reading? Retweet, follow, or send me a message on{" "}
            <a href="https://twitter.com/_jweatherby" target="_blank">
              Twitter
            </a>
            .
          </aside>
        </footer>
      </article>
    </>
  );
}
