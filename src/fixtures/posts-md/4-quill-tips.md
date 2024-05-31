---
title: Learnings from React & QuillJS
blurb: Tips when using QuillJS with React.
imageSrc: /images/post-images/quill-logo.png
dateCreated: 2022-02-27T12:00:00Z
tags: reactjs, quilljs
isPublished: true
---

I built a pretty robust editor over on [Showboard](https://showboard.ca), and the technologies I've used to accomplish this have been React and QuillJS.

These are some of the tips I picked up in working with Quill. I've been using the library [react-quill](https://github.com/zenoamaro/react-quill), which has been able to do the job really well for a basic implementation in React.

```js
import ReactQuill from 'react-quill'

export const MyEditor = ({ value, onChange }) => {
  useEffect(() => {
    document.querySelectorAll('.ql-picker').forEach((tool) => {
      tool.addEventListener('mousedown', function (event) {
        event.preventDefault()
        event.stopPropagation()
      })
    })
  }, [])
  return (
    <ReactQuill
      placeholder="Add more information to your post"
      theme="bubble"
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }], // custom button values
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: ['', 'center', 'right'] }],
          ['link', 'image'],
          ['clean'],
        ],
        clipboard: {
          matchVisual: false,
        },
      }}
      bounds={'#post-editor'}
      value={value}
      onChange={onChange}
    />
  )
}
```

That's the implementation, let's breakdown a few items:

```js
theme="bubble"
```

For an editor that often contains long form content, you don't want to constantly be scrolling to the top to make changes to the text. The Bubble theme provides that; an inline floating toolbar. However, there are some implications with that approach.

First off, the toolbar has a mind of its own. To keep it from jumping all over the page, it needs to know where its boundaries are. That's where this comes in:

```js
bounds={'#post-editor'}
```

Next, I found that there's a weird jumping issue. Whenever you highlight a selection and make changes to a block, it has the ill-desired effect of hopping back to the top of your editor. I'm not sure why that happens, but to prevent it, you can simply stop mouse click propagation after each click:

```js
document.querySelectorAll('.ql-picker').forEach((tool) => {
  tool.addEventListener('mousedown', function (event) {
    event.preventDefault()
    event.stopPropagation()
  })
})
```

This will prevent the weird jumping issue.

Lastly, I found another quirk with lists. Whenever you add a list, it adds it as per usual in the editor, but when rendering to markdown, it always adds an extra newline after the fact. This is where this line comes in:

```js
clipboard: {
  matchVisual: false,
},
```

These are the biggest quirks I've come across. I'm not necessarily using it in the most traditional approach, where I'm importing Markdown and then outputting Markdown, but it has served it's purpose in being a pretty good editor for my needs.

Hope these tips help anybody else looking to get started with Quill with React.
