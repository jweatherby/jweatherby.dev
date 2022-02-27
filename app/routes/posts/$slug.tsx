import { RefObject, useEffect, useRef } from 'react'
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import hljs from "highlight.js";

import styles from './post.css'
import hljsStyled from 'highlight.js/styles/default.css'

import { getPost } from "~/posts";

hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))

export const links = () => [
  { rel: "stylesheet", href: hljsStyled },
  { rel: "stylesheet", href: styles },
]


export const loader: LoaderFunction = async ({
  params
}) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};


export default function PostSlug() {
  const post = useLoaderData();
  const postRef = useRef<RefObject>(null);

  useEffect(() => {
    if (postRef.current) {
      Array.from(postRef.current.querySelectorAll('pre code') as HTMLDivElement[])
        .forEach(block => hljs.highlightBlock(block))
    }
  }, [postRef])

  return (
    <div className='blog-post'>
      <header className='post-header'>
        <img src={post.imageSrc} className='post-image' />
        <h2 className='post-title'>{post.title}</h2>
        <div className='post-author'>Jamie Weatherby</div>
        <div className='post-date'>{post.dateCreated}</div>
      </header>
      <article ref={postRef} className='post-content' dangerouslySetInnerHTML={{ __html: post.html }} />
      <div className='post-tags'><strong>Tags: </strong>{post.tags}</div>
      <aside className='post-followup'>
        Like what you're reading? Retweet, follow, or send me a message on <a href="https://twitter.com/_jweatherby" target="_blank">Twitter</a>.
      </aside>
    </div>
  );
}