import { useEffect, useRef } from 'react'
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

  return (
    <div className='blog-post'>
      <header className='post-header'>
        <img src={post.imageSrc} className='post-image' />
        <h2 className='post-title'>{post.title}</h2>
        <div className='post-author'>Jamie Weatherby</div>
        <div className='post-date'>{post.dateCreated}</div>
      </header>
      <article ref={postRef} className='post-content' dangerouslySetInnerHTML={{ __html: post.html }} />
      <div className='post-tags'><strong>Tags: </strong><em>{post.tags}</em></div>
      <aside className='post-followup'>
        Like what you're reading? Retweet, follow, or send me a message on <a href="https://twitter.com/_jweatherby" target="_blank">Twitter</a>.
      </aside>
    </div>
  );
}