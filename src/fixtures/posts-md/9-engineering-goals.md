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

Going into the new year, I’ve been giving goal setting a few thoughts lately. As with most companies, growth is typically the number 1 concern. It makes sense - the point of a typical business is to bring in revenue and there is usually a mandate to grow. What I want to dive into is how these goals can be navigated by software engineering, a group that’s notoriously bad at setting goals, often showing disdain for the whole process.

The mandate to grow is usually driven by the commercial or product teams. With this mandate, functionality directly related to growth will usually be prioritized. However, in engineering it can be difficult to align those priorities with that growth mandate. Engineering is often concerned with: 

- Lacking developer experience
- Tech debt
- Woeful test coverage
- Sunsetting legacy systems
- Minimizing the number of bugs created

These are difficult to prioritize because at any company with a decent spread of functionality, the roadmap is relentless and unforgiving. What I’d like to explain is what engineering goals typically are and how to craft those into the roadmap. 

## The Trifecta

There are 3 things that software engineering should care about: Business Value, Speed, & Quality. Let me break them down:

### Business Value

AKA value-add to the user. This should always be the forefront of software and product teams. Engineers are often so enraptured by the problem that they lose sight of the end-goal - delivering value to the end-users. This is where Product teams often comes in - they act as the bridge between software and the business, or the end-users. They collect feedback, identify what works and what doesn’t, and use that information to strategize The Next Big Thing. Because value-add is directly tied with revenue and conversions, it’s the easiest one to justify; especially when chasing growth. However, in unbalanced orgs, the pendulum can swing too far in this direction, and the other engineering priorities get compromised and fall behind.

### Speed

The second priority is speed, or time. Speed is often articulated as “how quickly can functionality be validated”. This validation happens in a lot of different stages: 

- local development
- test or staging environments
- end-user testing
- automated testing
- production deployments and releases

All of these culminate in the “developer experience”, but they're actually saying, “how fast can I validate this change and deploy it”. It’s getting all that tooling into a state where it minimizes disruptions, and out of the way of developing new functionality.

However, speed doesn’t tie directly into revenue, so initiatives along these lines have intangible benefits. Instead, they have an indirect correlation to revenue: enabling quicker delivery of that sought after value-add functionality. While important, this indirect relation makes them prone to being de-prioritized in the pursuit of high-growth.

### Quality

The third priority for engineering is quality: making sure the code is secure, resilient and maintainable. The scope here includes (but is not limited to):

- Are appropriate security measures in place? i.e. holes found and addressed, outdated libraries updated, and code patched and hardened
- Is there sufficient monitoring and alerting for easy debugging and quick detection of issues?
- Is the service easy to deploy and scale as needed, with identifiable performance breakpoints?
- Is there documentation on how to use the service for all the relevant stakeholders?
- How often do pipelines or deployments fail (require remediation or result in service degradation)?
- What is the contextual load required to add functionality (code structure; systems architecture)?

These are all important things to consider, but it’s difficult to quantify the extent and impact of these changes. As far as I can tell, there is no universal way to measure quality. Instead, there’s a lot of specialized tooling for the different areas. When measuring quality, there are 2 important signals that arose from research: Production Change Failure Rate and Mean Time to Recovery (MTTR). They’re good signals for quality, but don’t tell you how to get there, so you’ll have to fill in the gaps along the way. 

I’ve seen internal self-assessments work to a small degree, but they’re largely qualitative and lack effectiveness without appropriate buy-in and consistent usage.

## Industry Standards

Before going any further, I want to call out DORA metrics, as outlined by [the Accelerate Book](https://itrevolution.com/product/accelerate/) ([video](https://youtu.be/5_rrQND3lpQ)). DORA metrics are the industry benchmarks on how performant a software organization is. After extensive research, they boiled it down to these 4 primary metrics:

- Lead Time
- Deployment frequency
- Mean time to recovery (MTTR)
- Production change failure rate

What they’re really asking is, “How well are you doing continuous delivery”, the gold standard of software development. 

Back to the 2 engineering goals, Quality and Speed - as you can see, these should be the highest priorities. Both are emphasized by DORA metrics and it’s a matter of justifying those into roadmap planning. Notice that revenue and growth are missing? Those are in another domain altogether, where Product typically helps navigate. That’s why, as engineers, Speed and Quality should be the highest priorities engineering is obliged to advocate for.

## Prioritizing these goals

So, how do you get these engineering priorities into the roadmap? First off, establish them as goals. Since it’s difficult to qualify revenue or growth with these goals, they need to be qualified in some other way. After that, they need to be sized and prioritized, with an expected “outcome” from the resulting tasks. As mentioned, that’s where the 4 DORA measurements come in. Of these 2, speed is easier measure and action on. Quality is even more difficult to quantify since it amounts to mitigating potential revenue loss, an intangible goal - you never know about the revenue loss until it happens.

When establishing these priorities as goals, these are the steps I’d recommend:

1. Quantify: 
    - For Quality - identify bugs in prod, failure rates, create some internal assessment tool and get a lay of the land: product failure rates, mean-time-to-recover, Service Level Agreements (SLAs), Service Level Objectives (SLOs)
    - Speed - identify your lead time (or cycle time as a subset of lead time), deployment frequency, etc.
2. Size & Prioritize: Map out actionable chunks that will potentially improve the score and assign each item a size and priority. Story mapping and prioritization sessions are your friends here.
3. State your goal: declare that you want a % change in those areas. Chunk it into manageable tasks and goals so it feels more achievable. Create small steps of high priority items and outcome based goals.
4. … Profit?

Now that the goals are in place, they need to be advocated for and capacity needs to be allocated. This means selling these goals and metrics, and getting buy-in. And know that revenue driven opportunities will typically take the front seat, especially with the emphasis on relentless growth. 

These are some strategies I’ve seen to get these goals prioritized:

1. Obviously, add to the roadmap. With these established goals, don’t create them as long-running initiatives. Instead make them hypothesis driven with measurable outcomes. i.e. “If we do X, we can increase our lead time by Y,” or “If we patch these series of bugs, we’ll improve the health of the service by X%, thereby spending less time on support in this area.” But, know when times are financially tougher, growth-driven will likely remain at the expense of all others.
2. Dedicated quarterly DX Sprints - take the time to gather metrics and create a plan. As a group, consolidate items into a couple streams of work with achievable goals. Share the results widely.
3. Buffer at the end of an epic to clean up the code of any “architectural compromises” that were made. Software is famous for getting out of hand, quickly. As you go through, a better pattern might have emerged that was neglected for the necessity of “getting it done”. If there’s a buffer at the end of an epic, maybe these changes won’t be lost to the recesses of time.
4. Establish an engineering vision and work on it alongside the value-add stories as needed. This isn’t the most efficient and may lead to fractured priorities, but it can work when the roadmap is particularly relentless. I wouldn’t reach for this one first because it violates tightly scoped work and potentially compromising lead / cycle time as a result.
5. Use other dedicated engineering time - Google had its 20% days, where these items could potentially be accommodated. But I’ve seen that these are too disjointed to properly accomplish anything. I had a version of this called 10% days (1 day every 2 weeks). There was some hope that the team would prioritize the speed and quality initiatives, but they mostly prioritized their own learning and development and this time actually detracted from other engineering efforts.

Also, a word of advice on addressing quality and speed: avoid system rewrites at all costs - see Joel Spolsky’s [Things You Should Never Do](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/). They rarely go well and put everybody in an awkward spot. If something needs a massive overhaul, I’d recommend the Incremental Migration, [as illustrated here](https://youtu.be/9Q7GANXn02k?si=7-lkwjsTZRteAmm7&t=1756).

## In Summary

While it isn’t the easiest getting your engineering goals prioritized, these are some tips I’ve had success with. 

- Priorities will typically be given to projects directly related to revenue and growth. There are usually other teams that help navigate this terrain (i.e. Product)
- Engineering should be advocating for Speed and Quality. These can be difficult to prioritize because they're indirectly related to revenue. You can use the arguments: "Speed helps to deliver those revenue related items more quickly" and "Quality mitigates potential revenue loss"
- Figure out the metrics you care about, but lean on established best practices, like DORA metrics. Just know that DORA metrics are like the “draw the owl” meme in that they’ll tell you where you need to go, not how to get there.
- From the metrics you care about, including internal assessments, establish incremental goals and manageable action items.
- Negotiate it into the roadmap - what might work one year/quarter might not work the next. It doesn’t hurt to shake things up regardless.
