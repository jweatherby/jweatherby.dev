import path from 'path'
import fs from "fs";
import parseFrontMatter from 'front-matter'
import { marked } from "marked";

const POSTS_PATH = path.join(process.cwd(), '_posts')

const getPostFilenames = () => {
  return fs.readdirSync(POSTS_PATH)
}

const getPostBySlug = (filename) => {
  const slug = filename.replace(/\.md$/, '')
  const fullPath = path.join(POSTS_PATH, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { attributes, body } = parseFrontMatter(fileContents)
  return { slug, html: marked(body), ...attributes }
}


export function getPosts() {
  let filenames = getPostFilenames()
  filenames.sort((p1, p2) => p1 > p2 ? -1 : 1)
  return filenames
    .map(filename => getPostBySlug(filename))
}

export function getPost(slug) {
  return getPostBySlug(slug)
}
