---
title: "The Pendulum of Engineering Goals"
blurb: "Goals in software: Where to focus efforts and how to navigate them into the roadmap"
imageSrc: /images/post-images/9-eng-goals-3-point-pendulum.webp
imageAlt: Triangle with three circles illustrating the priorities
imageCredit: chatgpt, 3 sided pendulum with those priorities listed
dateCreated: 2025-02-12T13:22:00Z
tags: software-orgs, leadership
isPublished: true
---

Going into the new year, I’ve been giving goal setting some thought lately. As with most companies, growth is typically the number 1 concern. It makes sense - the point of a typical business is to bring in revenue and there is usually a mandate to grow. What I want to dive into is how these goals can be navigated by software engineering, a group that’s notoriously bad at setting goals, often showing disdain for the whole process.

The mandate to grow is usually driven by the commercial or product teams. However, in engineering it can be difficult to align priorities with that growth mandate. Engineering is often concerned with: 

- Lacking developer experience
- Tech debt
- Woeful test coverage
- Sunsetting legacy systems
- Minimizing the number of bugs created

These are difficult to prioritize because at any company with a decent spread of functionality, the roadmap is relentless and unforgiving.

## The Trifecta

There are 3 things that software engineering should care about: Business Value, Speed, and Quality. Let me break them down:

### Business Value

AKA value-add to the user. This should always be the forefront of software and product teams. Engineers are sometimes so enraptured by the problem at hand that they lose sight of the end-goal - delivering value to the end-users. This is where Product often comes in. They act as the bridge between software and the business, or the end-users. They collect feedback, identify what works and what doesn’t, and use that information to strategize The Next Big Thing. Because value-add is directly tied with revenue and growth, it’s the easiest one to justify. However, in unbalanced orgs, the pendulum can swing too far in this direction, and the other engineering priorities get compromised and fall behind.

### Speed

Speed can be articulated as “how quickly can functionality be validated”. This validation happens in a lot of different stages: 

- local development
- test or staging environments
- end-user testing
- automated testing
- production deployments and releases

All of these culminate in the “developer experience”, but they're actually saying, “how fast can I validate this change and deploy it”. It’s getting all the tooling and processes into a state where it minimizes disruptions and is out of the way of developing new functionality.

However, speed doesn’t tie directly into revenue, so initiatives along these lines have intangible benefits. Instead, it has an indirect correlation to revenue: enabling quicker delivery of that value-add functionality. While important, this indirect relation makes it prone to being de-prioritized in the pursuit of high-growth.

### Quality

The third priority for engineering is quality: making sure the code is secure, resilient, maintainable and performant. The scope here includes (but is not limited to):

- Are appropriate security measures in place? i.e. holes found and addressed, outdated libraries updated, and code patched and hardened
- Is there sufficient monitoring and alerting for easy debugging and quick detection of issues?
- Is the service easy to deploy, scale, and perform as needed, with identifiable performance breakpoints?
- Is there documentation on how to use the service for all the relevant stakeholders?
- How often do pipelines or deployments fail (require remediation or result in service degradation)?
- What is the contextual load required to add functionality (code structure; systems architecture)?

These are all important things to consider, but it can be difficult to quantify their extent and impact. As far as I can tell, there is no universal way to measure quality; instead, there’s varied tooling for the different areas. When measuring quality, there are 2 important signals that arose from research in the area of engineering productivity: Production Change Failure Rates and Mean Time to Recovery (MTTR). They’re good signals for quality, but don’t tell you how to get there, so you’ll have to fill in the gaps along the way. 

I’ve seen internal self-assessments work to a small degree, but they’re largely qualitative, and lack effectiveness without appropriate buy-in and consistent usage.

## Industry Standards

Before going any further, I want to call out DORA metrics, as outlined by [the Accelerate Book](https://itrevolution.com/product/accelerate/) ([video](https://youtu.be/5_rrQND3lpQ)). DORA metrics represent the industry standard on how performant a software organization is. After extensive research, they boiled it down to these 4 primary metrics:

- Lead Time: The amount of time it takes a commit to get into production
- Deployment frequency: How often a group successfully releases to production
- Mean time to recovery (MTTR): How long it takes to recover from a failure in production
- Production change failure rate: The percentage of deployments causing a failure in production

What they’re really asking is, “How well are you doing continuous delivery”, the gold standard of software development. 

As you can see, Quality and Speed are the main categories, as emphasized by DORA metrics. What's needed is justifying those into roadmap planning. Notice that revenue and growth are missing? Those are in another domain altogether, which Product typically helps navigate. That’s why, as engineers, Speed and Quality should be the highest priorities engineering is obliged to advocate for.

## Prioritizing these goals

How do you get these engineering priorities into the roadmap? First off, establish them as goals. Since it’s difficult to quantify revenue or growth with these goals, they need to be qualified in some other way. After that, they need to be sized and prioritized, with an expected “outcome” from the resulting tasks. As mentioned, that’s where the 4 DORA measurements come in. Of these, goals related to speed are easier to measure and action on. Quality is even more difficult to quantify since it amounts to mitigating potential revenue loss, an intangible goal - you often don't know about the revenue loss until it happens.

When establishing these priorities as goals, these are the steps I’d recommend:

1. Quantify where they are now: 
    - For Quality: identify failure rates, time to recover from incidents, Service Level Agreements (SLAs), Service Level Objectives (SLOs), number and severity of issues through security audits (automated or pen-tests). It might help to use a an assessment tool to identify the health of your services. 
    - Speed: identify your lead time (or cycle time as a subset of lead time), deployment frequency, etc. From here you can break down what may slow down the team and any actions that may lead to improvements.
2. Size & Prioritize: Map out actionable chunks that will potentially improve the score and assign each item a size and priority. Story Mapping and Prioritization sessions are your friends here.
3. State your goal: declare that you want a % change in those areas. Chunk it into manageable tasks and goals so it feels more achievable. Create small steps of high priority items and outcome based goals.

Now that the goals are in place, they need to be advocated for and capacity needs to be allocated. This means selling these goals and metrics and getting buy-in. And know that revenue driven opportunities will typically take the front seat, especially with the emphasis on relentless growth. 

These are some strategies I’ve seen to get these goals prioritized:

1. Add to the roadmap (obviously). With these established goals, don’t create them as long-running initiatives. Instead make them hypothesis driven with measurable outcomes. i.e. “If we do X, we can increase our lead time by Y,” or “If we patch this series of bugs, we’ll improve the health of the service by X%, thereby spending less time on support in this area.”
2. Dedicated quarterly DX Sprints - take the time to gather metrics and create a plan. As a group, consolidate items into a couple streams of work with achievable goals.
3. Buffer at the end of an epic to clean up any “architectural compromises” that were made. Software is famous for getting out of hand, quickly. As you go through, a better pattern might have emerged that was neglected for the necessity of “getting it done”. If there’s a buffer at the end of an epic, maybe these changes won’t be lost to the recesses of time.
4. From those established goals, work on them alongside the value-add stories as needed. i.e. deliberately structure changes to conform to the new pattern and adhere to the campsite rule (leave it better than you found it). This isn’t the most efficient and may lead to fractured priorities, but it can work when the roadmap is particularly relentless. I wouldn’t reach for this one first because it violates tightly scoped work and potentially compromising lead / cycle time as a result.
5. Use other dedicated engineering time - Google had its 20% days, where these items could potentially be accommodated. But I’ve seen that these are too disjointed to accomplish much. I had a version of this called 10% days (1 day every 2 weeks). There was some hope that the team would prioritize the speed and quality based tasks, but they mostly prioritized their own learning and development, and work-related side-projects - this time actually detracted from other engineering efforts.

Also, a word of advice on addressing quality and speed: avoid system rewrites at all costs - see Joel Spolsky’s [Things You Should Never Do](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/). They rarely go well and put everybody in an awkward spot. If something needs a massive overhaul, I’d recommend the Incremental Migration approach, [as illustrated here](https://youtu.be/9Q7GANXn02k?si=7-lkwjsTZRteAmm7&t=1756).

While it isn’t the easiest getting your engineering goals prioritized, these are some strategies I’ve experienced, each with its own pros and cons. The trick is being persistent, yet adaptable. 

## In Summary

- Priorities will typically be given to projects directly related to revenue and growth. There are usually other teams that help navigate this terrain (i.e. Product)
- Engineering should be advocating for Speed and Quality. These can be difficult to prioritize because they're indirectly related to revenue. You can use arguments along these lines: "Speed helps to deliver those revenue related items more quickly" and "Quality mitigates potential revenue loss"
- Figure out the metrics you care about, but lean on established best practices, like DORA metrics. Just know that DORA metrics are like the “draw the owl” meme in that they’ll tell you where you need to go, not how to get there.
- From the metrics you care about, including internal assessments, establish incremental goals and manageable action items.
- Negotiate it into the roadmap - what might work one year/quarter might not work the next. Be persistent, but adapatable in pursuit of these goals.
