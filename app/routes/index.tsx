import { Link, useLoaderData } from "remix";

import { getPosts } from '~/posts'
import type { Post } from '~/posts'

export const loader = async () => getPosts()

export default function Posts() {
  const posts = useLoaderData<Post[]>();
  return (
    <div>
      <h1>Posts</h1>

      <Link to='/posts'>See all the Posts</Link>

    </div>
  );
}