import type { IPost, IPostMeta } from "$lib/types";

import parseFrontMatter from 'front-matter'
import type { PageLoad } from "./$types";
const mdPosts = import.meta.glob("$fixtures/posts-md/*.md", { eager: true, query: 'raw', import: 'default' })

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
export const load: PageLoad = () => {
  const posts: Omit<IPost, 'html'>[] = getPosts()
  return { posts }
}
