import Document, { Html, Head, Main, NextScript } from 'next/document'



const activeStyle = {
  borderBottom: '3px solid #1890ff'
}

export default class App extends Document {
  render() {

    return (
      <Html lang="en">
        <Head />
        <body>
          <header className='site-header'>
            <nav className='site-container site-nav'>
              <h1><a href='/'>jweatherby.dev</a></h1>

              <ul className='site-nav__menu'>
                <li className='site-nav__menu-item'>
                  <a href='/history'>Work</a>
                </li>
                <li className='site-nav__menu-item'>
                  <a href='/posts'>Posts</a>
                </li>
              </ul>
            </nav></header>
          <main className='site-main'>
            <div className='site-container'>
              <Main />
              <NextScript />
            </div>
          </main>
        </body>
      </Html>
    );
  }
}
