---
title: "The Big 3 of Engineering Goals"
blurb: "Goals in software: Where to focus efforts and how to navigate them into the roadmap"
imageSrc: https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMDAzMzh8MHwxfHNlYXJjaHw2OXx8cmFuZG9tfGVufDB8fHx8MTc3MzEwNjczN3ww&ixlib=rb-4.1.0&q=80&w=1080
imageAlt: Software engineer venturing into the foreign lands of goal setting.
imageCredit: “Software engineer venturing into the foreign lands of goal setting.” Photo by Jonas Verstuyft on Unsplash
dateCreated: 2025-02-12T13:22:00Z
tags: software-orgs, leadership
isPublished: true
---

Going into the new year, I’ve been giving goal setting some thought. As with most companies, growth is typically the number 1 concern. It makes sense - the point of a typical business is to bring in revenue and that usually happens through growth. I will dive into how these goals can be navigated by software engineering, a group whose work is often quite a few layers from a company’s typical commercial goals.

_“Make it align with Product priorities” - No, the goals will be a balance of product priorities and engineering priorities._

The mandate to grow is usually driven by the commercial or product teams from directions on-high. However, in engineering it can be difficult to align priorities with that growth mandate. Engineering priorities don’t often directly relate to revenue generating activities, and are usually concerned with:

- Poor developer experience (DX)
- Tech debt
- Woeful test coverage
- Sunsetting legacy systems
- Minimizing the number of bugs created

These can be difficult to prioritize because at any company with a decent spread of functionality because the roadmap is relentless and unforgiving and engineering’s priorities don’t have visible impact on the end product.

## The Big 3

As a general rule, there are 3 things that software engineering should care about: Business Value, Speed (Throughput), and Quality (Stability).

### Business Value

AKA value-add to the user. This should always be the forefront of software and product teams. Engineers are sometimes lose sight of this end-goal: delivering value to the end-users. There are many books on this topic and it is why other departments often exist (i.e. Product). Product typically acts as the bridge between software and the business, or the end-users. They collect feedback, identify what works and what doesn’t, and use that information to strategize The Next Big Thing. Because value-add is directly tied with revenue and growth, it’s often the easiest to justify. However, in unbalanced orgs, the pendulum can swing too far in the direction of growth at all costs, and engineering’s priorities can fall behind.

When growth is covered by product or commercial teams, what is left for engineering to put on the table? That’s where you get to the meat of what engineering should be thinking of and prioritizing.

### Speed

Speed can be articulated as “how quickly can this be validated”. This validation happens in a lot of different stages:

- local development
- test or staging environments
- end-user testing
- automated testing
- production deployments and releases

All of these culminate in the “developer experience”, but they’re actually saying: “how fast can I validate this change and deploy it”. It’s about getting the tooling and processes into a state where disruptions are minimized and out of the way of developing new functionality.

However, speed doesn’t tie directly into revenue initiatives and only has an indirect correlation: enabling quicker delivery. While important, this indirect relation makes it prone to being de-prioritized in the pursuit of high-growth.

The argument and measurements to getting tooling and process changes prioritized can usually be framed as: “Speed helps to deliver those revenue related items more quickly” and can be measured by however you measure velocity (pull request turn-around time, deployment speed, story points, etc).

### Quality (Stability)

The third priority for engineering is quality: making sure the code is secure, resilient, maintainable and performant. The scope here includes (but is not limited to):

- Are appropriate security measures in place? i.e. holes found and addressed, outdated libraries updated, and code patched and hardened
- Is there sufficient monitoring and alerting for easy debugging and quick detection of issues?
- Is the service easy to deploy, scale and perform as needed? Does it have identifiable performance breakpoints?
- Is there documentation on how to use the service for all the relevant stakeholders?
- How often do pipelines or deployments fail (require remediation or result in service degradation)?
- What is the contextual load required to add functionality (code structure; systems architecture)?

These are all important things to consider, but it can be difficult to quantify their extent and impact. As far as I can tell, there is no universal way to measure quality; instead, there’s varied tooling for the different areas. When measuring quality, there are 2 important signals that arose from research in the area of engineering productivity: Production Change Failure Rates and Mean Time to Recovery (MTTR). They’re good signals for quality, but don’t tell you how to get there, so you’ll have to fill in the gaps along the way. Number of bugs can be useful as well - the average number produced should fall over a period of time if doing rudimentary software development and not making significant changes to the service, its infra or tooling.

I’ve seen internal self-assessments work to a small degree, but they’re largely qualitative, and lack effectiveness without appropriate business buy-in and consistent usage.

## Industry Standards

Before going any further, I want to call out DORA metrics, as outlined by [the Accelerate Book](https://itrevolution.com/product/accelerate/) ([video](https://youtu.be/5_rrQND3lpQ)). DORA metrics represent the industry standard on how performant a software organization is. After extensive research, they boiled it down to these 4 primary metrics:

- Lead Time: The amount of time it takes a commit to get into production
- Deployment frequency: How often a group successfully releases to production
- Mean time to recovery (MTTR): How long it takes to recover from a failure in production
- Production change failure rate: The percentage of deployments causing a failure in production

What they’re really asking is, “How well are you doing continuous delivery”, the gold standard of software development. 

As you can see, Quality and Speed are the main categories, as emphasized by DORA metrics. What’s needed is justifying those into roadmap planning. Notice that revenue and growth are missing? Those are in another domain altogether, which Product typically helps navigate and why engineerings should be advocating for Speed and Quality as the highest priorities.

## Prioritizing these goals

How do you get these engineering priorities into the roadmap? It can be difficult since the number one priority is often revenue. Since it’s difficult to quantify revenue or growth with these goals, they need to be qualified in some other way. Here are some steps to help identify goals and break them down into attainable actions.

1. Quantify the current state of the world: 
    - **Quality/Stability:** identify failure rates, time to recover from incidents, Uptime and Performance Service Level Agreements (SLAs), number and severity of issues through security audits (automated scans or pen-tests). It might help to use an assessment tool to identify the health of your services and what matters will vary.
    - **Speed/Throughput:** identify your lead time (or cycle time as a subset of lead time), deployment frequency, etc. From here you can break down what may slow down the team and any actions that may lead to improvements without compromising quality.
2. **Size & Prioritize:** Map out actionable chunks that will potentially improve the score and assign each item a size and priority. Story Mapping and Prioritization sessions are your friends here.
3. **State your goal:** declare that you want a % change in those areas. Chunk it into manageable tasks and goals so it feels more achievable. Create small steps of high priority items and outcome based goals.

Now that the goals are in place, they need to be advocated for and capacity needs to be allocated. This means selling these goals and metrics and getting buy-in. And know that revenue driven opportunities will typically take the front seat, especially when there's the emphasis on relentless growth. 

These are some strategies I’ve seen to get engineering efforts prioritized:

1. **Use the Roadmap (obviously):** With these established goals, don’t create them as long-running initiatives. Instead make them hypothesis driven with measurable outcomes. i.e. “If we do X, we can increase our lead time by Y,” or “If we patch this series of bugs, we’ll improve the health of the service by X%, thereby spending less time on support in this area.”
2. **Continuous sub-team:** Dedicate a portion of the team for support and engineering related activities. The size of this group is dependent on the extent of the effort required to bring about the necessary outcomes. This group can be rotated as needed.
3. **DX Sprints:** Dedicated quarterly Developer Experience focused (DX) Sprints - take the time to gather metrics and create a plan. As a group, consolidate items into a couple streams of work with achievable goals.
4. **Project buffer:** Buffer at the end of an epic to clean up any “architectural compromises” that were made. Software is famous for getting out of hand, quickly. As you go through, a better pattern might have emerged that was neglected for the necessity of “getting it done”. If there’s a buffer at the end of an epic, maybe these changes won’t be lost to the recesses of time. *(call it an Epic Buffer for the Agile enthusiasts)*
5. **Campsite Rule:** Work on these long-running engineering efforts alongside the roadmap stories as needed. (i.e. deliberately structure changes to conform to a new pattern and adhere to the campsite rule - leave it better than you found it). *This isn’t the most efficient, may lead to fractured priorities, may also violate tightly scoped work and can compromise Lead / Cycle time as a result. Use it as a last resort if the roadmap is particularly relentless.*
6. **20% (or 10%) Time:** Use other dedicated engineering time - Google had its 20% days, where engineering priorities could be accommodated. This is a system where 20% (i.e. every Friday) is set aside for whatever the engineers want to work on, within the realm of the business. It’s a welcome break for engineers from the typical day-to-day and provides the time to flex their creativity, or scratch any lingering itches. However, I’ve seen that these are too disjointed to accomplish much and end up being perceived as a pit of unaccountable time.   
_I had a version of this called 10% days (1 day every 2 weeks, every week is too expensive). There was some hope that the team would prioritize the speed and quality based tasks, but they mostly prioritized their own learning and development, and work-related side-project. This time actually detracted from other engineering efforts that could have been used for the team’s DX and tech debt._

Also, a word of advice on addressing quality and speed: avoid system rewrites at all costs - see Joel Spolsky’s [Things You Should Never Do](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/). They rarely go well and put everybody in an awkward spot, for a long time. If something needs a massive overhaul, I’d recommend the Incremental Migration approach, [as illustrated here](https://youtu.be/9Q7GANXn02k?si=7-lkwjsTZRteAmm7&t=1756).

While it isn’t the easiest getting your engineering goals prioritized, these are some strategies I’ve experienced, each with their own pros and cons. The trick is being persistent, yet adaptable. What works one year might not work the next. 

## In Summary

- Priorities will typically be given to projects directly related to revenue and growth. There are usually other teams that help navigate this terrain (i.e. Product)
- Engineering should be advocating for Speed (Throughput) and Quality (Stability). These can be difficult to prioritize because they’re indirectly related to revenue. You can use arguments along these lines: “Speed helps to deliver those revenue related items more quickly” and “Increased quality mitigates potential revenue loss”
- Figure out the metrics you care about, but lean on established best practices, like DORA metrics. Just know that DORA metrics are like the “draw the owl” meme in that they’ll tell you where you need to go, not how to get there.
- From the metrics you care about revisit them periodically. Create narratives and give them weight and accountability. Establish incremental goals and manageable action items.
- Negotiate them into the roadmap - what might work one year/quarter might not work the next. Be persistent, but adaptable in pursuit of these goals.
