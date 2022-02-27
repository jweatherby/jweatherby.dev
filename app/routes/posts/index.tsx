import { Link, useLoaderData } from "remix";
import type { MetaFunction } from "remix";

import { List } from 'antd'
import { getPosts } from '~/postsApi'
import type { Post } from '~/postsApi'

import styles from './post-list.css'
import 'highlight.js/styles/default.css'

export const loader = async () => getPosts()

export const links = () => {
  return [{
    rel: 'stylesheet', href: styles
  }]
}


export const meta: MetaFunction = () => {
  return { title: "Blog | jweatherby.dev" };
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div>
      <h1>Posts</h1>

      <List>
        {posts.map((post, key) => (
          <List.Item className="post-item" key={key}>
            <div className="post-info">
              <h3>
                <Link to={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>
              <div className='post-item__blurb'>{post.blurb}</div>
              <div className="post-item__meta">
                <div>{post.dateCreated}</div>
                <div>{post.tags}</div>
              </div>
            </div>
            <div className="post-img">
              <Link to={`/blog/${post.slug}`}>
                <img src={post.imageSrc} />
              </Link>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
}