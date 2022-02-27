---
title: My Frontend Stack
blurb: My essential selection of libraries for frontend development.
imageSrc: /images/post-images/js-logo.jpeg
dateCreated: Nov 23, 2020
tags: being-full-stack, frontend
---

As the second part in my series, "Being Full Stack", I'll be going through a simple list of all the essential libraries I use to get the frontend of a project up and running.

### tl;dr

*   [ReactJS](https://reactjs.org/)
*   [React Router](https://reactrouter.com/)
*   [Styled Components](https://styled-components.com/)
*   [ESLint](https://eslint.org/)
*   [@testing-library](https://testing-library.com/)


### ReactJS

The framework (or library in this case) you choose will have the largest impact on your codebase. There are a lot of great libraries out there, including Elm, ClojureScript, Svelte, Angular and VueJs. I've hitched my wagon to{' '} [ReactJS](https://reactjs.org/) .

Coming from JQuery land, the concept of a virtual DOM to manage the HTML within the JavaScript functionality sounded amazing. The advantages include:

*   a more readable codebase through JSX and{' '} [one-way-binding](https://stackoverflow.com/a/34520204/1531156)
*   quick and declarative rendering
*   more testable individual components
*   easy Server Side Rendering
*   a rich and vast package ecosystem

But most importantly, React is a mature project with a huge community.

There are some disadvantages as well: it's a lot to learn; testing can be technically difficult; its lack of opinions on file structure can yield unweildly codebases; the ecosystem is almost too large; and because it is so easy to create complex applications, state management can become very complicated and messy.

I prefer ReactJS because I've dealt with a lot of the nuances, have a deep familiarity with the language and ecosystem, and have established conventions when dealing with ReactJS applications. A word of warning: starting a big project and trying to learn React at the same time is a recipe for disaster. There are other, more forgiving, languages and frameworks for these types of scenarios.

To get up and running with your ReactJS application, I've had success with{' '} [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) {' '} and{' '} [RazzleJS](https://razzlejs.org/) {' '} to get started with these projects. The question of which one to use is up to whether you want{' '} [Server Side Rendering](https://medium.com/@baphemot/whats-server-side-rendering-and-do-i-need-it-cb42dc059b38) {' '} or not.

*\*This blog was built with RazzleJS*

### React Router

If you're building a frontend app, it probably needs different pages. And those different pages need to load when different endpoints are hit. You're going to need a routing library and I've been happy with{' '} [React Router](https://reactrouter.com/) {' '} in the past.

How you route your app and which library you choose will impact how your app is structured. React-router lends itself naturally to how ReactJS has been designed. You don't need the routes at the top level, they can be inline throughout the code as needed. This might be counter-intuitive at first, but you'll find that managing the data is easier as a result, especially when dealing with localized components. This structure can make complicated pages declarative since they only fetch the data they need at exactly the right time.

{/* Styled Components */}

### Styled Components

This is a contentious one.{' '} [Styled components](https://styled-components.com/) {' '} are CSS-in-JS, a horrifying thought to a lot of accomplished developers. I, however, think it's great. How does it work? You import styled-components, assign the styles and replace the native React components with your sytlized ones.

```jsx
import React from 'react'
import styled from 'styled-components'

const StyledBlog = styled.div\`
  font-size: 1rem;
  padding: 15px;
\`

export const Blog = () => (
    <styledblog><article>This is a blog post!</article></styledblog>
)
```

It's that easy! And the best part is that it supports nested styles, much like SASS, SCSS and LESS. The difference is that there's no pre or post css-processor needed, which makes for a simpler{' '} [DivOps](https://changelog.com/news/automate-the-pain-away-with-divops-M5WR) {' '} process.

```js
const StyledBlog = styled.div\`
  font-size: 1rem;
  padding: 15px;
  .blog-image {
    padding: 5px;
    border: 1px solid #000;

    img {      <-- nested styles are not possible in plain css
        width: 200px;
        height: 200px;
    }
\`
```

Another benefit to _styled-components_ is implied / by convention: they live next to the components they're styling. Often, I've seen SASS / SCSS / LESS separate from the HTML they relate to, meaning you have a duplicate filestructure mirroring your JS code (if you were disciplined enough to do that). In theory, this works fine. In practice, not so much, especially if sweeping changes need to be made. You'll find that you're managing two different apps that were once similar, but are no longer.
I'll speak more on this later, when we discuss folder structure.

### ESLint

Code should look consistent with conventional standards.
[ESLint](https://eslint.org/) {' '} is the go to formatter, so make sure it is run on every commit. You can use{' '} [Husky](https://github.com/typicode/husky) {' '} to format your code on each commit. You just need to add the following config to your package.json

```json
"lint-staged": {
  "*.{js,jsx}": [
    "eslint . --fix"
  ]
},
"husky": {
  "hooks": {
    "pre-commit": "npx lint-staged"
  }
}
```


### JS Testing Library

Every good codebase needs good tests, and this, (super generically named),{' '} [testing library](https://testing-library.com/) , is the best library for testing React. React can be tested with other libraries, but with the introduction of hooks, testing became difficult. This library ensures best testing practices and allows you to create unit tests for your individual units of work.
We'll chat more about testing at a later time.

This testing library has all the add-ons to test your app:

* [ReactJS Testing Library](https://testing-library.com/docs/react-testing-library/intro)
* [React Hooks Testing Library](https://react-hooks-testing-library.com/)

### In Conclusion

These are libraries I always start a new app with. You'll notice there's nothing to connect to an API, no authentication, no state management, and no form handling. In other words, nothing to handle the business logic of the app. Just the fundamentals to get started on a rock solid codebase.
