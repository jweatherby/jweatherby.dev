// import { getPosts } from "$lib/postsApi";
import type { ServerLoad } from "@sveltejs/kit";

import parseFrontMatter from 'front-matter'
const mdPosts = import.meta.glob("$lib/posts-md/*.md", { eager: true, query: 'raw', import: 'default' })

const getPosts = () => {
  return Object.entries(mdPosts).map(([path, _post]) => {
    const { attributes } = parseFrontMatter(_post as string)
    return {
      meta: attributes,
      slug: path.replace(/.*\/([^\\/]+)\.md/, '$1')
    }
  })
}

export const prerender = true
export const load: ServerLoad = async () => {
  const posts = getPosts()
  return {
    posts
  }
}
