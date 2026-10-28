---
title: Docs that scale
blurb: A documentation system designed to work within your Notion workspace, built to keep docs findable as your organization grows.
imageSrc: https://images.unsplash.com/photo-1502700807168-484a3e7889d0?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageAlt: Notion branding with programming languages - typescript, python, sveltekit logos
imageCredit: unsplash.com/@alexblock
dateCreated: 2024-12-07T13:22:00Z
tags: documentation, notion
isPublished: true
---
As Director of Engineering, when we were fully remote at the height of Covid, I realized our documentation was woefully inadequate and in dire need of structure and direction. We'd see proposals that laid out four solutions, with options scratched out and critical information buried in comments - and this was what people were expected to reference when figuring out how something worked. According to [DORA](https://dora.dev/capabilities/documentation-quality/), good documentation is one of the foundations of better organizational performance, so we decided it was time to improve what we had.

We looked at Confluence and Notion, and happily settled on Notion for its cleaner UI and the incredible flexibility it provided. The ability to use databases to dynamically link content across the workspace while still preserving the source of truth proved invaluable. Also, the left navbar - being able to see everything from a centralized location is remarkably underrated, something not available by Google Docs or Confluence.

Our Notion workspace was a huge success, with 300 daily active users at a company of 600, and *minimal complaints*. There was feedback early on, but once we reorganized the workspace around our domains (more on that below), that feedback disappeared. Different groups had their own domains to work within, teams weren't stepping on each other's toes, and we were able to accomplish innovative things with the tools Notion provided, like building a software hygiene catalogue (similar to Backstage) for the different services our teams managed.

The workspace was built on a relatively simple foundation with two ideas: separate documents based on whether they are permanent or temporary, and tie every document back to the team that owns it. Through the power of databases, it scaled nicely with our growing organizational demands. Notion was eventually sunset in favour of Confluence, to bring documentation closer to the rest of our Atlassian tooling, but the ideas behind the structure apply whatever tool you use.

## Sharing my learnings

Below, I'll walk through a [documentation template](https://www.notion.so/DRAFT-Documentation-14f3b75bf3f880408a7bf8b0e7d7a4df) based on what I learned rolling out our workspace: the overall structure, each section's purpose, and the gotchas I encountered. A small team can use it as a proof of concept and expand from there. See the [Getting Started](https://www.notion.so/Getting-Started-14e3b75bf3f880d3a493fb9a29619eb0?pvs=21) section for a more in-depth look at the structure and practices that made it succeed.

Along the way, I'll point out five principles that made the system work: **timeliness**, **feedback loops**, **reporting**, **audience** and **dashboards**.

This template has a few bonuses, including:

- An area to measure and track projects
- Page templates with prompts for things you might not have considered
- A database to catalogue your internally built software. We had a similar database in place, which helped clarify ownership, add supplementary information, and manage our software's hygiene

## The structure

### Getting Started

Getting Started was where the general guidelines (including what lived where), best practices and governing principles lived. Any good software project has a README that gives people a sense of how to work within its structure. This was the workspace's README.

### Wiki

This was where the meat of the information lived, and it required the most governance. It held the current policies, reference materials and diagrams: the state of the world as it related to the domain. It was important to have something centralized like this, because otherwise these docs got buried in team-specific pages or, worst case, in private pages.

We set the wiki up as a set of databases with the parents containing a relations to the owning teams and applied software services and products. Because pages can be infinitely nested, it became a well organized drill-down of all the documents needed relating to a specific service. This way, we could tag articles and sections with the relevant teams to provide backlinks to their team pages, with filters liberally applied as needed. Any other tags or categories could be added to make governance and visibility more straightforward.

One of the most important principles when deciding what lived in the wiki was **timeliness**: was it a permanent document or not? If it was a permanent doc (true today, tomorrow, and next year) and was relevant beyond a specific team, it probably belonged here.

Our first attempt didn't organize the wiki by domain, and that's where most of the early feedback came from. We work with white-label products, so we split the wiki into "conceptual" and "reality". One area described our products, services and policies, with the product and architecture as designed. Another area covered the deployed instances, what we call storefronts: the reality. It made sense on paper, but to understand one product you had to piece it together from two places, and this model didn't even apply to other products at all. Instead, we made it domain driven: here's the product, and here's all the information around it, from the architecture to each deployment.

### Projects

Projects were the opposite of Wiki docs. They were speculative, used for planning, and only relevant for a short period of time. Remember those proposals with four solutions and critical information in the comments? That was fine for a project. It wasn't fine as the place people went to understand how something worked. All information about the actual implementation belonged in the Wiki.

Anything in **Projects** was meant to be relatively short-lived. When a project was done, the team moved what was actually built into the Wiki. This was our **feedback loop**: documentation was part of the software lifecycle, not something written after the fact. Success depended on the team, but the teams who did it well reaped the benefits of clearer docs and better support flows.

### Snapshot

This was where we could see the state of the organization at a high level: the health of services over time, the state of projects, and the capacity of projects. It was designed for a leadership point of view, and covered **reporting** for anyone not part of day-to-day operations. Some organizations would keep this private, but transparency was important to us. Keeping it publicly visible followed our "write in public" principle: unless something was sensitive, write it where everyone could see it.

### People & Teams

The pieces above weren't groundbreaking; methods like Tiago Forte's [PARA](https://fortelabs.com/blog/para/) cover similar ground. People and Teams was where this structure set itself apart, by giving every doc an **audience**. With these two databases, we could break out projects and wiki items and associate them with their respective teams. **People** provided granular information about who was on a given team, and **Teams** tied any piece of documentation to its owner. In **Projects**, an **Involved Teams** field showed who was working on what. From there, we could filter projects to only the relevant teams, shielding them from the noise of the centralized structures.

The **Teams** database also gave teams a space for their team-specific docs: working agreements, code standards, support processes, team policies and onboarding guides. Some teams built comprehensive, complete dashboards to manage their product and software work.

The one gotcha was the tendency to use team pages for everything, including permanent docs that were relevant beyond the current team. This undermined the entire system, and it's where our workspace architects spent most of their time, encouraging teams to put their docs in more widely observed spaces. The trick to tying this information back to the team page was **dashboards**: views on the team page that referenced those centralized documents (Projects and Wiki items). The docs stayed central, and each team still got its own dashboard.

## Guiding principles

These were the foundations that made this documentation system work, and Notion made each of them possible.

**Dashboards:** We created dashboards everywhere, based on predictable, workspace-wide tagging. Documentation stayed central, and filters personalized it where each team would benefit most.

**Reporting:** We provided snapshots and reports for those who weren't part of day-to-day operations, giving them a high-level view of progress across the org.

**Audience:** We used the Teams database to organize and tag groups as needed, and gave groups full ownership to work within their own domains.

**Feedback loops:** We integrated documentation into the software lifecycle. A proposal started in Projects, and once it was actioned, the parts that were still true moved out of Projects and into the Wiki. Because every stage of a document's life lived in one place, nothing got lost moving between tools, and you could always trace a Wiki page back to the project that produced it.

**Timeliness:** We identified whether a document was temporary or permanent. Each was better served in a specific place (Projects and Wiki, respectively).

## Takeaways

As you can see, it was a simple structure, but it accounted for everything we needed. Overall governance was restricted to a select few, but within a specific domain (product line, software, tooling, wiki sub-sections, team pages, etc.), permissions were granted liberally so teams weren't held back and had the flexibility to create what worked for them.

Hope this helps with your documentation adventures! You can find the [template here](https://www.notion.so/DRAFT-Documentation-14f3b75bf3f880408a7bf8b0e7d7a4df?pvs=21).


--- 

*Update from just 2 years later, in 2026: with the rise of AI this year, documentation looks very different than it did in 2024 - some fundamentals stay, others are irrelevant.*
*More on that later.*
