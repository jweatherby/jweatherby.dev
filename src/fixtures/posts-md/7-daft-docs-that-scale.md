---
title: "DAFT: Docs that scale"
blurb: A documentation system designed to work within your Notion workspace.
imageSrc: https://images.unsplash.com/photo-1502700807168-484a3e7889d0?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
dateCreated: 2024-12-07T13:22:00Z
tags: documentation, notion
isPublished: true
---

In my role as Director of Engineering, in the height of Covid, I realized our documentation was woefully inadequate and in need of much needed structure and direction. According to industry benchmarks, ([DORA](https://dora.dev/capabilities/documentation-quality/), [Harvard Business Review](https://hbr.org/2022/03/what-great-hybrid-cultures-do-differently)), a good, centralized documentation platform is one of the foundations to better organizational performance. We decided it was time to improve what we had and after reviewing the different alternatives, we reviewed both Confluence or Notion. 

Confluence was a contender because (a) we use Jira and the integration is supposed to be decent; (b) it’s relatively inexpensive and widespread. However, we happily settled on Notion because we saw its potential in being able to create a dynamic wiki, cleaner UI and incredible flexibility. The ability to use databases to dynamically link content in other places while still preserving a source of truth has proven to be invaluable. That, plus the navbar. Being able to see everything from a centralized location is remarkably underrated IMO. 

Our Notion workspace has been a huge success, having 500 daily active users and minimal complaints all around (there was continuous “feedback” early on, but we changed the structure and that feedback has since disappeared). Groups have their different spaces to work within, toes aren’t really stepped on, and they’re able to accomplish truly innovative things with the tools Notion provides. It uses a relatively simple foundation, but through the power of databases, has been able to scale nicely with our growing organizational demands.

## Sharing my learnings

Here, I want to run through the [DAFT Documentation](https://jweatherby.notion.site/DAFT-Documentation-14f3b75bf3f880408a7bf8b0e7d7a4df) template, inspired from my learnings rolling it out to a medium-sized company.  You can even use it on a small team as a proof of concept and expand on it from there. Please see the [Getting Started](https://jweatherby.notion.site/Getting-Started-14e3b75bf3f880d3a493fb9a29619eb0) section for a more in depth view of the structure and practices that has made it succeed.

It has a few bonuses, including: 

- A database to measure and track projects
- Reasonable templates that provide prompts you may not have thought of
- A database to catalogue your internally built software. We have a similar database in place which has helped clarify ownership, additional meta information, and manage our services’ hygiene

Below, I’ll walk you through the overall structure, each section’s purpose and any gotchas I’ve encountered. 

## The Structure

### Getting Started

Where the general guidelines, a map to what lives where, best practices and anything else is needed. Any good project has a README, this is where most folks will get a sense of what to expect and where the guardrails are.

### Wiki

This is the meat of the information. It is where you’ll find current policies, explanations of how things work, diagrams, basically a state of the world as it relates to the domain. It’s important to have something centralized like this, because otherwise these docs get buried in group-only pages, or worst case, in private pages.

One of the most important principles when deciding what lives in the wiki is: is it a permanent doc or not? If it is a permanent doc (is true today, tomorrow and next year) and is relevant to people beyond your specific team, it should probably live here.

### Projects

Projects are the opposite of Wiki docs. They are speculative, for planning, and only relevant for a short period of time. Before our documentation platform, we’d see a solution doc created where 4 solutions were proposed, things are scratched out, critical information live in comments - and this was what people were expected to reference when figuring out how something works. 

Anything in here should be short lived (short being relative) and when something is done, there should be effort to properly document what was actually captured somewhere more permanently. 

### Snapshot

This is a newer area; it’s a place where we can see the state of the different projects from a mile-high view. It contains graphs and metrics, designed for leadership POV. In some cases this would be private, but transparency is important and this adheres to the “write in public” principle of documentation.

### People & Teams

The above pieces aren’t anything entirely ground breaking and are captured by methodologies like the PARA documentation methodology. People and Teams is where this structure sets itself apart. By creating the 2 databases, People and Teams, we can break out projects and wiki items and associate them with their respective teams. In `Projects` we have an `Involved Teams` field, which associates the different teams. From here, you can filter and associate projects with only the relevant teams. 

The `Teams` database also creates a space where teams can add their team-specific docs. Working agreements, code standards, support processes, team policies and onboarding guides can all be documented here. Any documentation related to the team itself can be added here and I’ve seen some pretty impressive efforts in these spaces.

The one gotcha here is that there’s a tendency to use the team pages for everything, including permanent docs relevant beyond the specific team, which is a detriment to the system as a whole. This is where the chief information architects have spent their time encouraging teams to put their docs in more widely observed spaces.

## The DAFT System

These are the 4 foundations that make up this documentation system that Notion enables. I’m calling it **DAFT** based on these foundational components: Dashboards, Audience, Feedback loops and Timeliness.

**Dashboards:** Create Dashboards everywhere based on predictable and workspace wide tagging architecture. Keep documentation central and use filters to personalize it where your and your team will most benefit

**Audience:** Use the Teams database to organize and tag groups as needed. Give full ownership to groups to work within their appropriate domains. 

**Feedback Loops**: Tie in organizational processes back into your documentation, creating perpetual feedback loops that work for you

**Timeliness**: Distinguish timeliness by identifying the nature of documents: depending whether they’re transitionary or permanent, they’ll be better served in a specific place.

## Takeaways

As you can see, it’s a simple structure, but accounts for everything we need it for. Overall governance should be restricted to a select few, but within a specific domain (product line, software, tooling, wiki sub-sections, team pages, etc) full permissions can be granted liberally so they're not impeded and have the flexibility to create what works for them.

Hope this helps with your documentation adventures! You can find the [DAFT template here](https://jweatherby.notion.site/DAFT-Documentation-14f3b75bf3f880408a7bf8b0e7d7a4df).