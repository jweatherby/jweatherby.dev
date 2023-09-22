import Head from "next/head";
import { getPosts } from "../../lib/postsApi";

export const getStaticProps = () => {
  const posts = getPosts();
  return {
    props: { posts },
  };
};
export default function Posts({ posts }) {
  return (
    <>
      <Head>
        <title>Blog | jweatherby.dev</title>
      </Head>
      <header>
        <h1>Posts</h1>
      </header>
      <ul className="posts-list">
        {posts.map((post, key) => (
          <li className="post-item" key={key}>
            <div className="post-info">
              <h5>
                <a href={`/posts/${post.slug}`}>{post.title}</a>
              </h5>
              <div className="post-item__blurb">{post.blurb}</div>
              <div className="post-item__meta">
                <div className="post-item__date">{post.dateCreated}</div>
                <div className="post-item__tags">{post.tags}</div>
              </div>
            </div>
            <div className="post-img">
              <a href={`/blog/${post.slug}`}>
                <img src={post.imageSrc} />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
