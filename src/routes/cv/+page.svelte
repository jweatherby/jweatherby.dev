<script lang="ts">
  import { onMount } from "svelte";
  let pdfLib = null;
  onMount(async () => {
    pdfLib = await import("html2pdf.js");
  });
  const downloadAsPDF = () => {
    const el = document.getElementById("cv-wrapper") as HTMLElement;

    pdfLib
      .default()
      .set({
        margin: 5,
        pageBreak: { mode: "css" },
      })
      .from(el)
      .save("JamieWeatherby-CV.pdf");
    // printDiv("cv-wrapper", "JamieWeatherby-CV");
  };
</script>

<div class="cv-container">
  <div class="download-as-pdf">
    <button on:click={downloadAsPDF}>↧</button>
  </div>
  <article id="cv-wrapper">
    <header class="cv-header">
      <h1 class="my-name">Jamie Weatherby</h1>
      <div class="my-title">Director of Software</div>
      <a class="my-email" href="mailto:jamie@jweatherby.dev"
        >jamie@jweatherby.dev</a
      >
      <a class="my-website" target="_blank" href="https://jweatherby.dev"
        >jweatherby.dev</a
      >
      <div class="my-phone">+1-647-778-8174</div>
    </header>
    <h2 class="section-header">Executive Summary</h2>
    <p class="exec-summary">
      Accomplished leader in software development, specializing in SAAS,
      navigating complex organizational change, and a proven track record of
      building strong, healthy teams while introducing innovative measures
      across software organizations.
    </p>
    <h2 class="section-header">Work Experience</h2>
    <section class="work-item">
      <div class="work-meta">
        <div class="work-title">Director, Software Engineering</div>
        <div class="work-employer">Points (a Plusgrade Company)</div>
        <div class="work-location">Toronto, ON</div>
        <div class="work-timeframe">2021 - Present</div>
      </div>
      <div class="work-description">
        <p>
          Oversaw the growth, development and wellbeing of 20+ developers and
          engineering leads, providing engineering direction in collaboration
          with the product team and other stakeholders.
        </p>
        <ul>
          <li>
            Led innovative workshops and process design across the software org
          </li>
          <li>
            Championed and led the implementation of new observability vendor
          </li>
          <li>
            Coordinated with local groups to host meetups in our office space
          </li>
          <li>
            Stakeholder management, ensuring expectations were being clearly
            communicated and reasonable objectives were laid out to the team
          </li>
          <li>
            Successfully established centralized documentation platform using
            Notion
          </li>
        </ul>
      </div>
    </section>
    <section class="work-item">
      <div class="work-meta">
        <div class="work-title">Team Lead</div>
        <div class="work-employer">Points</div>
        <div class="work-location">Toronto, ON</div>
        <div class="work-timeframe">2019 - 2021</div>
      </div>
      <div class="work-description">
        <p>
          Established and developed a strong software development team in
          collaboration with other scrum leads.
        </p>
        <p>Accomplishements included:</p>
        <ul>
          <li>
            Established and expaned strong, psychologically safe engineering
            team
          </li>
          <li>
            Contributed to sprints, whether through Code Reviews, QA, piloting
            new patterns, coaching and mentoring
          </li>
          <li>
            Introduced innovative processes and contributed to extensive
            documentation to provide more autonomy to the team
          </li>
        </ul>
      </div>
    </section>
    <section class="work-item">
      <div class="work-meta">
        <div class="work-title">Software Developer</div>
        <div class="work-employer">G Adventures</div>
        <div class="work-location">Toronto, ON</div>
        <div class="work-timeframe">2015 - 2019</div>
      </div>
      <div class="work-description">
        <p>
          On a team of 40+ software developers, maintaining several
          business-critical products, including the website, the agent portal
          and the email dispatch system.
        </p>
        <p>Notable tasks included:</p>
        <ul>
          <li>
            Managing and building out the email dispatch system used to
            communicate automated booking information to travellers
          </li>
          <li>
            Building UX enhancements into all areas of the site, including the
            online booking system, which handles hundreds of transactions daily
          </li>
          <li>
            Building out extensive frontend tooling, including React, Redux,
            mult-env Webpack, resulting in improved local development, optimized
            web calls and quicker delivery time
          </li>
          <li>
            Took on role as Tech Ambassador - responsible for the budget,
            coordinated several meetups of 60-150 people, arranged sponsorship
            for several conferences and facilitated multiple site visits for the
            local code academy, Bitmaker.
          </li>
        </ul>
      </div>
    </section>
    <section class="work-item">
      <div class="work-meta">
        <div class="work-title">PHP Developer, System Administrator</div>
        <div class="work-employer">KoffeeCup</div>
        <div class="work-location">London, UK</div>
        <div class="work-timeframe">2011 - 2014</div>
      </div>
      <div class="work-description">
        <p>
          Primary backend (PHP) developer for a small digital agency with a
          development team of 3-6 people. Built a number of digital marketing
          platforms, a few standalone websites and maintained the AWS system
          infrastructure. Primary technologies used included PHP, JavaScript
          (JQuery), bash.
        </p>
        <p>Notable tasks included:</p>
        <ul>
          <li>A crowd funding site for local businesses</li>
          <li>
            A social networking site for local charities to assist those in need
          </li>
          <li>
            2 Facebook pages that create compiled images / videos based on
            scraped Facebook images
          </li>
        </ul>
      </div>
    </section>
    <section class="work-item">
      <div class="work-meta">
        <div class="work-title">Software Developer (Internship)</div>
        <div class="work-employer">IBM</div>
        <div class="work-location">Markham, ON</div>
        <div class="work-timeframe">2009 - 2010</div>
      </div>
      <div class="work-description">
        <p>
          A 16 month internship at the Markham IBM lab, worked on the DB2 build
          team. Performed QA on nightly builds for various linux platforms and
          wrote scripts to optimize processes.
        </p>
        <p>Notable projects include:</p>
        <ul>
          <li>
            Improved efficiency of 20% time savings in the FTP uploads of
            approximately 120 DB2 images through perl scripting
          </li>
          <li>
            Mentored one intern in all job responsibilities for four months and
            assisted with mentoring of 4 other junior interns
          </li>
        </ul>
      </div>
    </section>

    <h2 class="section-header">Education</h2>
    <section class="edu-wrapper">
      <div class="edu-major">BSC. Comp Sci & Business Admin, 2011</div>
      <div class="edu-university">St. Mary's University, Halifax NS</div>
    </section>
    <h2 class="section-header">Projects</h2>
    <section class="project-item">
      <div class="project-meta">
        <div class="project-title">Hackathon Command Centre</div>
        <div class="project-link"></div>
      </div>
      <div class="project-description">
        <p class="project-summary">
          High performance voting system for custom voting needs. Deployed on
          demand.
        </p>
        <p class="project-stack">
          Built using SvelteKit, TRPC, Postgres (PrismaDB). Deployed on fly.io.
        </p>
      </div>
    </section>
    <section class="project-item">
      <div class="project-meta">
        <div class="project-title">Tendee</div>
        <div class="project-link">
          <a href="https://tendee.co" target="_blank">tendee.co</a>
        </div>
      </div>
      <div class="project-description">
        <p class="project-summary">
          Scheduling app specializing in recurring events, like for sports teams
          or recurring meetups.
        </p>
        <p class="project-stack">
          Built using React (NextJS), GraphQL, Postgres, Express, PicoCSS.
          Deployed on fly.io.
        </p>
      </div>
    </section>
    <section class="project-item">
      <div class="project-meta">
        <div class="project-title">ShowBoard</div>
        <div class="project-link">
          <a href="https://showboard.ca" target="_blank">showboard.ca</a>
        </div>
      </div>
      <div class="project-description">
        <p class="project-summary">
          Collaborative bookmarking, content archival, and notetaking tool.
        </p>
        <p class="project-stack">
          Built using SvelteKit, TRPC, Postgres (PrismaDB). Deployed on fly.io.
        </p>
      </div>
    </section>
    <h2 class="section-header">Volunteer Work</h2>
    <section class="project-item">
      <div class="project-meta">
        <div class="project-title">Katimavik</div>
        <div class="project-link">2005</div>
      </div>
      <div class="project-description">
        <ul>
          <li>
            40 hours per week of volunteer work over 3 terms in Saskatchewan,
            Newfoundland, and Ontario for a period of 7 months.
          </li>
          <li>
            Additionally, the following workshops were involved: committee work,
            conflict management, financial planning, entrepreneurial skills,
            environmental awareness, French classes and healthy lifestyle
            classes
          </li>
        </ul>
      </div>
    </section>
    <h2 class="section-header">Activities & Accomplishments</h2>
    <section class="activity-items">
      <div class="activity-title">Volleyball Captain</div>
      <div class="activity-timeframe">2021 - 2025</div>
      <div class="activity-title">
        Player/Captain – Curve Ultimate Frisbee Team
      </div>
      <div class="activity-timeframe">2012 - 2014</div>
      <div class="activity-title">Player/Coach – IBM Ultimate Frisbee Team</div>
      <div class="activity-timeframe">2009 - 2010</div>
      <div class="activity-title">
        MT&T Comp Sci. & Business Admin Scholarship (2x)
      </div>
      <div class="activity-timeframe">2008, 2009</div>
      <div class="activity-title">Sobey’s School Business Case Competition</div>
      <div class="activity-timeframe">2006</div>
      <div class="activity-title">Duke of Edinburgh Bronze Award</div>
      <div class="activity-timeframe">1999 - 2000</div>
    </section>
  </article>
</div>

<style lang="scss">
  .cv-container {
    position: relative;
  }
  .download-as-pdf {
    position: absolute;
    top: -8px;
    right: -8px;
    button {
      padding: 0 8px;
      font-size: 1.2rem;
    }
  }
  #cv-wrapper {
    border-radius: 8px;
    padding: 24px 16px;
    margin-top: 24px;
  }
  section {
    page-break-inside: avoid;
    ul,
    li {
      list-style: disc;
    }
    li {
      padding-left: 8px;
    }
  }
  .section-header {
    font-weight: 600;
    border-bottom: 2px solid var(--pico-contrast);
    color: var(--pico-primary);
    padding-bottom: 8px;
    margin-top: 24px;
  }
  .cv-header {
    display: grid;
    grid-template-areas: "myName myEmail" "myName myWebsite" "myTitle myPhone";
    margin-bottom: 16px;
    .my-name {
      grid-area: myName;
    }
    .my-title {
      grid-area: myTitle;
      font-weight: 700;
      font-size: 1.3rem;
    }
    .my-email {
      grid-area: myEmail;
      text-align: right;
      font-size: 0.8rem;
    }
    .my-phone {
      grid-area: myPhone;
      text-align: right;
      font-size: 0.8rem;
    }
    .my-website {
      grid-area: myWebsite;
      text-align: right;
      font-size: 0.8rem;
    }
  }
  .edu-wrapper {
    display: flex;
    justify-content: space-between;
    .edu-major {
      font-weight: 700;
    }
  }
  .work-item {
    margin: 16px 0;
    page-break-after: auto;
    .work-meta {
      display: grid;
      width: 100%;

      grid-template-areas: "workTitle workLocation" "workEmployer workTimeframe";
      grid-template-columns: auto auto;
      margin-bottom: 8px;
      .work-title {
        grid-area: workTitle;
        font-weight: 700;
      }
      .work-employer {
        grid-area: workEmployer;
        font-weight: 700;
        font-style:italic; 
        color: var(--pico-secondary); 
      }
      .work-location {
        grid-area: workLocation;
        text-align: right;
      }
      .work-timeframe {
        grid-area: workTimeframe;
        text-align: right;
      }
    }
    .work-description {
      ul {
        margin-top: 8px;
      }
    }
  }
  .project-item {
    margin: 16px 0;
  }
  .project-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    .project-title {
      font-weight: 700;
    }
  }
  p {
    margin: 0;
    padding: 0;
  }
  .project-stack {
    // margin-top: 16px;
    font-size: 0.9rem;
    font-style: italic;
  }
  .activity-items {
    display: grid;
    grid-template-columns: 1fr auto;
    .activity-timeframe {
      text-align: right;
    }
  }
</style>
