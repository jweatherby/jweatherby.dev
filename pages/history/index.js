import workItems from "./history.json";

export default () => (
  <>
    <h2>Projects & Work</h2>
    <section className="work-item-list">
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
            <p className="work-description">{work.description}</p>
            <strong className="work-role">{work.role}</strong>
            <br />
            <em className="work-dates">{work.dates}</em>
          </div>
        </article>
      ))}
    </section>
  </>
);
