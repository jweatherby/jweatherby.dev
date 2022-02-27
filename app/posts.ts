import path from 'path'
import fs from "fs/promises";
import parseFrontMatter from 'front-matter'
import invariant from "tiny-invariant";
import { marked } from "marked";


export type Post = {
  slug: string;
  title: string;
  blurb: string;
  imageSrc: string;
  dateCreated: string;
  tags: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}


const POSTS_PATH = path.join(__dirname, '..', 'public', 'posts')

export async function getPosts() {
  const dir = await fs.readdir(POSTS_PATH);
  return Promise.all(
    dir.map(async filename => {
      const file = await fs.readFile(
        path.join(POSTS_PATH, filename)
      );
      const { attributes } = parseFrontMatter(
        file.toString()
      );
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        ...attributes
      };
    })
  );
}

export async function getPost(slug: string) {
  const filepath = path.join(POSTS_PATH, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(
    file.toString()
  );
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  const html = marked(body);
  return { slug, html, ...attributes };
}