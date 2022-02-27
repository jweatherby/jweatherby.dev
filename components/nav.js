import { useRouter, withRouter } from 'next/router'


export const Nav = withRouter(({ router }) => {
  console.log('path', router.pathname)
  return (
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
    </nav>
  )
})