import {
  Link,
  Links,
  NavLink,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "remix";
import type { MetaFunction } from "remix";
import { Menu } from 'antd'
import antd from 'antd/dist/antd.css';
import styles from './root.css'

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export function links() {
  return [
    { rel: "stylesheet", href: antd },
    { rel: 'stylesheet', href: styles }
  ];
}

const activeStyle = {
  borderBottom: '3px solid #1890ff'
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className='site-header'>
          <nav className='site-container site-nav'>
            <h1><Link to='/'>jweatherby.dev</Link></h1>

            <ul className='site-nav__menu'>
              <li className='site-nav__menu-item'>
                <NavLink to='/history'
                  style={({ isActive }) => isActive ? activeStyle : undefined}>Work</NavLink>
              </li>
              <li className='site-nav__menu-item'>
                <NavLink to='/posts'
                  style={({ isActive }) => isActive ? activeStyle : undefined}>Posts</NavLink>
              </li>
            </ul>
          </nav></header>
        <main className='site-main'>
          <div className='site-container'>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </div>
        </main>
      </body>
    </html>
  );
}
