import workItems from "./history.json";

export default () => (
  <>
    <h2>Projects & Work</h2>
    <section className="grid work-item-list">
      {workItems.map((work, key) => (
        <article key={key} className={`work-item ${work.slug}`}>
          <div className="work-logo">
            <img src={work.logo} />
          </div>
          <div className="work-info">
            <h5 className="work-company-name">
              <a href={work.url} target="_blank">
                {work.name}
              </a>
            </h5>
            <p className="work-description">{work.description}</p>
            <footer>
              <div>
                <strong className="work-role">{work.role}</strong>
              </div>
              <div>
                <em className="work-dates">{work.dates}</em>
              </div>
            </footer>
          </div>
        </article>
      ))}
    </section>
  </>
);
