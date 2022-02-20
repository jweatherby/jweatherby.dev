import { Link, useLoaderData } from "remix";

import { getPosts } from '~/posts'
import type { Post } from '~/posts'

import 'highlight.js/styles/default.css'

export const loader = async () => getPosts()

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div>
      <h1>Posts</h1>

      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}