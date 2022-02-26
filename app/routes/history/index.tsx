import { Card } from 'antd'
import workItems from './history.json'
import styles from './history.css'

export const links = () => {
  return [{
    rel: 'stylesheet', href: styles
  }]
}

export default function History() {

  return (
    <>
      <h2>Projects & Work</h2>
      <section className='work-item-list'>
        {workItems.map((work, key) => (
          <article key={key} className={`work-item ${work.slug}`}>
            <div className="work-logo">
              <img src={work.logo} />
            </div>
            <div>
              <h4 className="work-company-name">
                <a href={work.url} target="_blank">
                  {work.name}
                </a>
              </h4>
              <strong className="work-role">{work.role}</strong>
              <br />
              <em className="work-dates">{work.dates}</em>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}