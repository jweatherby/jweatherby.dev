import { useEffect, useRef } from 'react'
import Head from 'next/head'
import hljs from "highlight.js";

import { getPost, getPosts } from "../../lib/postsApi";

hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))


export const getStaticProps = async ({ params }) => {
  return { props: { post: getPost(params.slug) } };
};



export async function getStaticPaths() {
  const posts = getPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

export default function Post({ post }) {
  const postRef = useRef(null);

  useEffect(() => {
    if (postRef.current) {
      Array.from(postRef.current.querySelectorAll('pre code'))
        .forEach(block => hljs.highlightBlock(block))
    }
  }, [postRef])

  const getImageSrc = () => {
    return typeof document === 'undefined'
      ? ''
      : `${document.location.protocol}//${document.location.host}${post.imageSrc}`
  }

  return (
    <>
      <Head>
        <title>{post.title} | jweatherby.dev</title>
        <meta name='og:image' content={getImageSrc()} />
        <meta name='twitter:image' content={getImageSrc()} />

        <meta name='description' content={post.blurb} />
        <meta name='og:description' content={post.blurb} />
        <meta name='twitter:description' content={post.blurb} />
        <meta name='twitter:card' content='summary' />
      </Head>
      <div className='blog-post'>
        <header className='post-header'>
          <img src={post.imageSrc} className='post-image' />
          <h2 className='post-title'>{post.title}</h2>
          <div className='post-author'>Jamie Weatherby</div>
          <div className='post-date'>{post.dateCreated}</div>
        </header>
        <article
          ref={postRef}
          className='post-content'
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <div className='post-tags'>
          <strong>Tags: </strong>
          <em>{post.tags}</em>
        </div>
        <aside className='post-followup'>
          Like what you're reading? Retweet, follow, or send me a message on{' '}
          <a href="https://twitter.com/_jweatherby" target="_blank">Twitter</a>.
        </aside>
      </div>
    </>
  );
}