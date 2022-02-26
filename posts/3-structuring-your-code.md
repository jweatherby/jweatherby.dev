---
title: Structuring your code
blurb: Some principles to consider when outlining the structure of your code.
imageSrc: /images/post-images/sitemap.jpg
dateCreated: Jan 6, 2021
tags: being-full-stack
---

This is the latest article in my series, [Being Full Stack](/posts/1-being-full-stack).

Here, I want to talk about folder structure. In quite a few instances, you'll spend the majority of your time reading code, not necessarily writing it. While it's important to write good, coherent, well documented code, an often overlooked aspect is a well thought out folder structure. And the thing about folder structure: once it has been established, it's difficult to change.

I'll be comparing two common approaches to code structure: "Function Driven" and "Domain Driven", and then showing an interesting effect they each have on how much your code will "stutter".

    # "Function Driven" project structure

    ├── controllers
    │   ├── users.py
    │   └── blogs.py
    ├── models
    │   ├── users.py
    │   └── blogs.py
    └── views
        ├── users.py
        └── blogs.py

You might recognize this as the classic MVC pattern. It is widely used in a lot of very popular frameworks and languages. The reason I'm calling it "Function Driven" is because that's how the packages are organized, by function. The `controllers`, `models` and `views` represent the separation of concerns, and all the relevant logic lives in named modules.

Contrast that with a "Domain Driven" folder structure, which is used extensively by Django (they break their packages into "apps").

    # "Domain Driven" project structure

    ├── users
    │   ├── __init__.py
    │   ├── controllers.py
    │   ├── models.py
    │   └── views.py
    └── blogs
        ├── __init__.py
        ├── controllers.py
        ├── models.py
        └── views.py

As you can see, everything here is broken up by "domain". The "users" domain is entirely isolated to the `users` package, same with the "blogs".

Personally, I prefer the latter, "Domain Driven" project structure and I'm going to use the concepts of Cohesion and Coupling to justify why.

What are Coupling and Cohesion? They're terms specific to programming. [Coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) is the amount of interdependence between two pieces of functionality. [Cohesion](https://en.wikipedia.org/wiki/Cohesion_(computer_science)) refers to the degree to which the elements in a module or package belong together.

This is a good rule of thumb, and widely accepted in software:

> **Good software design has high cohesion and low coupling.** [[1](http://freefeast.info/difference-between/difference-between-cohesion-and-coupling-cohesion-vs-coupling/), [2](https://stackoverflow.com/a/3085419)]

    # "Function Driven" project structure

    ├── controllers
    │   ├── users.py
    │   └── blogs.py
    ├── models
    │   ├── users.py
    │   └── blogs.py
    └── views
        ├── users.py
        └── blogs.py

Let's dissect those and see how they relate to the first, "Function Driven" project structure. Function driven folder structure has low cohesion. In our example, the modules relating to a domain live in at least 3 different packages. If you need to add a `birthday` field to the user model, you'll need to make the change to all three different packages:

*   `controllers/users`: to accept the input arguments
*   `models/users`: to save to the database and handle any app logic
*   `views/users`: where the user birthday will be displayed

This is low cohesion; everything related to `users` is scattered throughout the project.

What about Coupling? Coupling is how intertwined `users` is with other domains, in this case `blogs`. This will come down to how well the code is written. With this structure, loose coupling is difficult to enforce. The reason being that the business logic should live in the `models` (or similar) package. This is a best practice that keeps the business logic isolated to one place. The controllers should handle incoming requests, the views should display the results, there shouldn't be much intermingling. The business logic in the `models` should be where all the heavy lifting is. It can be straightforward, "user" logic that lives in the `user` module. But it gets more complicated than that. What about blogs the user likes? What about following a topic related to a series of blogs? Or any other logic that intertwines the two. All of a sudden, `blogs` and `users` are very tightly coupled, and if not well architected, messy. So this approach can be loosely coupled, but that requires discipline and a considered approach when writing the code.

    # "Domain Driven" project structure

    ├── users
    │   ├── __init__.py
    │   ├── controllers.py
    │   ├── models.py
    │   └── views.py
    └── blogs
        ├── __init__.py
        ├── controllers.py
        ├── models.py
        └── views.py

Now, how does "Domain Driven" folder structure hold up to cohesion and coupling? Regarding cohesion, it's inherently as cohesive as possible. Everything related to `users` lives in the `users` package. If you need to add the `birthday` field to the user model, all the work is isolated to the same package. This has the added benefit of decreasing the cognitive distance when reading the codebase and shortens tracing a request's lifecycle. When debugging something in this codebase, you don't have to step through the 3 different packages (`controllers/users`, `models/users`, `views/users`). When you know the endpoint, you go into the `users` package and everything is there.

"Domain Driven" structure also encourages loose coupling. In our example, `users` and `blogs` are automatically isolated from each other. It requires a conscious effort to access each other's functionality. There could be a lot of dependencies between the two; in which case, they will still be tightly coupled, but that's up to the design and how well thought out the code is. So, given this alternative, "Domain Driven" approach to structuring your code, loose coupling is inherently encouraged, but not guaranteed.

This visualization is a great way to conceptualize your code and what you should be striving for as a more organized, coherent system:

![](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Good%2C_bad_apps.png/691px-Good%2C_bad_apps.png)

When it comes down to it, the latter, "Domain Driven" folder structure helps to increase cohesion and decrease coupling. This is [why Django is structured like this](https://djangobook.com/mdj2-django-structure/). Personally, my projects have all fared better since adopting this approach. And as we discussed earlier:

> **Good software design has high cohesion and low coupling.**

#### Import Strategy & Stuttering

<aside>In the following examples, I'll be using functionional programming to provide examples at the module and package levels.</aside>

Import strategy goes hand in hand with folder structure. An important consideration here is readability and to prevent _stuttering_. Stuttering is when you repeat the same term multiple times when calling an action from another module or file. For example, if written with the _Function Driven_ folder structure from above:

```python
# controllers/users.py

from models import user

user = user.get_user()  # stuttering
```


In this example, the term `user` is stuttered. It may seem trivial now, but it can become tedious and distracting if it happens often enough. To offset this, you can remove the stuttering from the function names, like so:

```python
# controllers/users.py

from models import user

user = user.get()  # no stuttering, bad function name.
```

In this case, you needed to create a bad function name to compensate for the stuttering. A function should not be named `get`, especially just to compensate for the stuttering incurred. At this point, it is better to have the stuttering than function names like this.

Alternatively, you can import all the functions in one at a time, but this can grow unwieldly if a lot of code needs to be imported.

```python
# controllers/users.py

from models.user import (
    get_user,
    ...  # can grow unwieldly
)

user = get_user()  # no stuttering
```


Let's take a look at the alternative approach, "Domain Driven" structure. In this case, `controllers`, `models` and `views` will live under the `users` namespace. This is what those imports will look like here:


```python
# users/controllers.py

from users import models

user = models.get_user()  # no stuttering

OR

from users.models import get_user

user = get_user()  # still no stuttering
```


No more stuttering and no compromise on the function names. And, if you choose to import the individual functions, you can do that easily with the flexibility to import the individual functions or the module as a namespace.

Within the _Domain Driven_ package, this is possible because all the models relate to `users` so you can namespace it as such. When another package is accessing it, they'll likely need access to fewer bits of functionality, so they can be imported individually.

```python
# blog/models.py

from users.models import get_user

user = get_user()
```


While these examples are written in python, they apply across the board, especially in JavaScript, where folders are broken out in the widely taught "Function Driven" style.

By keeping these principles in mind when writing and architecting code, those reading your code in future will have an easy time grasping the intent and be able to hit the ground running.
