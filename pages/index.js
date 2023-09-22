export default function Routes() {
  return (
    <>
      <div className="profile-img">
        <img src='/images/profile-in-grass-sq-600px.png' />
      </div>
      <article className='about-article'>
        <p className='greeting'>Hi, I'm Jamie.</p>
        <p>
          I've been a Software Engineer for almost 15 years, and most recently, Director of Software.
          I started as an intern at IBM, then worked at an agency in London,
          UK, and finally settled in Toronto Canada. I love travelling, playing
          sports and am an avid casual boardgamer.
        </p>
        <p>
          I'm currently working for{' '}
          <a href="https://points.com" target="_blank">
            Points
          </a>
          , a great company based in Toronto, Canada with a strong focus on
          culture, engineering and work life balance.
        </p>
        <p>
          If you'd like to get in touch, you can find me on{' '}
          <a href="https://twitter.com/_jweatherby" target="_blank">
            Twitter
          </a>{' '}
          or <a href="https://www.linkedin.com/in/jamieweatherby/">LinkedIn</a>.
        </p>
      </article>
    </>
  );
}