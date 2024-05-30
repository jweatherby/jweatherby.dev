import type { IPost, IPostMeta } from "$lib/types";
import type { ServerLoad } from "@sveltejs/kit";

import parseFrontMatter from 'front-matter'
const mdPosts = import.meta.glob("/src/fixtures/posts-md/*.md", { eager: true, query: 'raw', import: 'default' })

const getPosts = () => {
  return Object.entries(mdPosts).map(([path, _post]) => {
    const { attributes } = parseFrontMatter(_post as string)
    return {
      meta: attributes as IPostMeta,
      slug: path.replace(/.*\/([^\\/]+)\.md/, '$1')
    }
  })
}

export const prerender = true
export const load: ServerLoad = () => {
  const posts: Omit<IPost, 'html'>[] = getPosts()
  return { posts }
}
