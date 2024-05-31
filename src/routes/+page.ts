import type { IPost, IPostMeta } from "$lib/types";

import parseFrontMatter from 'front-matter'
import type { PageLoad } from "./$types";
import { serializePost } from "$lib/posts/serializers";
const mdPosts = import.meta.glob("$fixtures/posts-md/*.md", { eager: true, query: 'raw', import: 'default' })

const getPosts = () => {
  return Object.entries(mdPosts).map(([path, _post]) => serializePost(path, _post as string))
}

export const prerender = true
export const load: PageLoad = () => {
  const posts: Omit<IPost, 'html'>[] = getPosts()
  return { posts }
}
