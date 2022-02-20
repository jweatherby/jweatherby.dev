import { RefObject, useEffect, useRef } from 'react'
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import hljs from "highlight.js";
import hljsStyled from 'highlight.js/styles/default.css'

import { getPost } from "~/posts";

hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))

export function links() {
  return [{ rel: "stylesheet", href: hljsStyled }];
}

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
    <div ref={postRef} dangerouslySetInnerHTML={{ __html: post.html }} />
  );
}