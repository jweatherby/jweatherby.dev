---
title: "DRAFT: Docs that scale"
blurb: A documentation system designed to work within your Notion workspace.
imageSrc: https://images.unsplash.com/photo-1502700807168-484a3e7889d0?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageAlt: Notion branding with programming languages - typescript, python, sveltekit logos
imageCredit: unsplash.com/@alexblock
dateCreated: 2024-12-07T13:22:00Z
tags: documentation, notion
isPublished: true
---
In my role as Director of Engineering, when we were fully remote in the height of Covid, I realized our documentation was woefully inadequate and in dire need of structure and direction. According to industry benchmarks, ([DORA](https://dora.dev/capabilities/documentation-quality/), [Harvard Business Review](https://hbr.org/2022/03/what-great-hybrid-cultures-do-differently)), a good, centralized documentation platform is one of the foundations to better organizational performance. We decided it was time to improve what we had. After reviewing the different alternatives, we settled on Confluence or Notion as the final contenders.

Confluence was a contender because (a) we use Jira and the integration is supposed to be decent; (b) it’s relatively inexpensive and widespread. However, we happily settled on Notion because we saw its potential to create a dynamic wiki, the cleaner UI and the incredible flexibility it provides. The ability to use databases to dynamically link content in other places while still preserving a source of truth has proven to be invaluable. Also, the navbar. Being able to see everything from a centralized location is remarkably underrated.

Our Notion workspace has been a huge success, having 500 daily active users and *minimal complaints* (there was continuous “feedback” early on, but we changed the structure and that feedback has since disappeared). "Minimal complaints" + active users is a great benchmark in software; it means things are working as expected. Different groups have their respective domains to work within, toes aren’t really stepped on, and we're able to accomplish truly innovative things with the tools Notion provides. The workspace we've architected uses a relatively simple foundation, but through the power of databases, has been able to scale nicely with our growing organizational demands.

## Sharing my learnings

Here, I want to run through the [DRAFT Documentation](https://www.notion.so/DRAFT-Documentation-14f3b75bf3f880408a7bf8b0e7d7a4df?pvs=21) template, inspired from my learnings rolling it out to a medium-sized company. It can be used for a small team as a proof of concept and expanded from there. Please see the [Getting Started](https://www.notion.so/Getting-Started-14e3b75bf3f880d3a493fb9a29619eb0?pvs=21) section for a more in depth view of the structure and practices that has made it succeed.

This template has a few bonuses, including:

- An area to measure and track projects
- Reasonable templates that provide prompts which may have not been considered
- A database to catalogue your internally built software. We have a similar database in place which has helped clarify ownership, adds supplementary information, and manage our software's hygiene

Below, I’ll walk you through the overall structure, each section’s purpose, and any gotchas I’ve encountered.

## The Structure

### Getting Started

Getting started is where general guidelines (including what lives where), best practices and governing principles live. Any good software project has a README, where most folks will get a sense of how to work within the given structures.

### Wiki

This is where the meat of the information will live, and requires the most governance. It is where the current policies, reference materials and diagrams live - a state of the world as it relates to the domain. It’s important to have something centralized like this, because otherwise these docs get buried in team-specific pages, or worst case, in private pages. In this template, the wiki is turned into a `Notion Wiki` and a `Teams` . This way we can tag different articles and sections with the relevant teams so they can provide backlinks to their team page for a centralized place to view their relevant docs.

One of the most important principles when deciding what lives in the wiki: is it a permanent document or not? If it is a permanent doc (is true today, tomorrow, and next year), and is relevant beyond a specific team, it should probably live here.

### Projects

Projects are the opposite of Wiki docs. They are speculative, for planning, and only relevant for a short period of time. Before our documentation platform, we’d see proposals where 4 solutions were proposed, things are scratched out, critical information live in comments - and this was what people were expected to reference when figuring out how something works. This should not be the case. All information relating to the actual implementation should be available in the Wiki.

Anything in Projects should be relatively short lived, and when something is done, there should be effort to properly document what was actually captured somewhere more permanently.

### Snapshot

This is a place where we can see the state of the different projects from a mile-high view. It contains graphs and metrics, designed for a leadership point-of-view. In some cases this would be private, but transparency is important, and having this publicly visible adheres to the “write in public” guiding principle of documentation.

### People & Teams

The above pieces aren’t entirely ground breaking and are captured by methodologies like the PARA documentation methodology. People and Teams is where this structure sets itself apart. By creating these 2 databases, we can break out projects and wiki items and associate them with their respective teams. The **People** association provides granular information about who is on a given team and **Teams** provides the ability to tie any piece of documentation to its respective owner. In **Projects** we have an **Involved Teams** field, which illustrates who is working on what. From here, you can filter and associate projects to only the relevant teams, shielding them from the noise of the centralized structures.

The `Teams` database also creates a space where teams can add their team-specific docs. Working agreements, code standards, support processes, team policies and onboarding guides can all be documented here. This is where documentation related to a specific team lives. There have been some really impressive efforts in these spaces.

The one gotcha here is that there’s a tendency to use the team pages for everything, including permanent docs relevant beyond the specific team. This is a detriment to the entire system. This is where the workspace architects have spent their time encouraging teams to put their docs into more widely observed spaces. The trick to tie this information back to the team page is to create views on the team page referencing those centralized documents (Projects and Wiki items), creating centralized dashboards for the teams.

## The DRAFT System

These are the 4 foundations that make up this documentation system that Notion enables. I’m calling it **DRAFT** based on these foundational components: Dashboards, Audience, Feedback loops and Timeliness.

**Dashboards:** Create Dashboards everywhere based on predictable and workspace wide tagging architecture. Keep documentation central and use filters to personalize it where your and your team will most benefit

**Reporting:** Provide snapshots and reports for those not part of the day to day operations for that mile-high view of progress across the org. 

**Audience:** Use the Teams database to organize and tag groups as needed. Give full ownership to groups to work within their appropriate domains.

**Feedback Loops**: Tie in organizational processes back into your documentation, creating perpetual feedback loops that work for you

**Timeliness**: Distinguish timeliness by identifying the nature of documents: depending whether they’re transitionary or permanent, they’ll be better served in a specific place (Projects vs Wiki respectively).

## Takeaways

As you can see, it’s a simple structure, but accounts for everything we need it for. Overall governance should be restricted to a select few, but within a specific domain (product line, software, tooling, wiki sub-sections, team pages, etc), full permissions can be granted liberally so teams are not impeded and have the flexibility to create what works for them.

Hope this helps with your documentation adventures! You can find the [DRAFT template here](https://www.notion.so/DRAFT-Documentation-14f3b75bf3f880408a7bf8b0e7d7a4df?pvs=21).
