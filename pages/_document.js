import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const getActiveStyle = (path, pattern) => {
  const isActive = path.search(pattern) !== -1;
  return isActive
    ? {
        borderBottom: "3px solid #1890ff",
      }
    : {};
};

export default class App extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, path: ctx.asPath };
  }

  render() {
    const { path } = this.props;
    return (
      <Html lang="en">
        <Head>
          <script
            defer
            data-domain="jweatherby.dev"
            src="https://plausible.io/js/plausible.js"
          />
        </Head>
        <body>
          <header className="site-header">
            <nav className="site-container site-nav">
              <h1>
                <a href="/">jweatherby.dev</a>
              </h1>

              <ul className="site-nav__menu">
                <li className="site-nav__menu-item">
                  <a href="/history" style={getActiveStyle(path, "/history")}>
                    Work
                  </a>
                </li>
                <li className="site-nav__menu-item">
                  <a href="/posts" style={getActiveStyle(path, /^\/posts.*/)}>
                    Posts
                  </a>
                </li>
              </ul>
            </nav>
          </header>
          <main className="site-main">
            <div className="site-container">
              <Main />
              <NextScript />
            </div>
          </main>
        </body>
      </Html>
    );
  }
}
