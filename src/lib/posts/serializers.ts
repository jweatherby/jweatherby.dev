

import hljs from 'highlight.js/lib/core'
import python from "highlight.js/lib/languages/python"
import js from "highlight.js/lib/languages/javascript"
import bash from "highlight.js/lib/languages/bash"
import json from "highlight.js/lib/languages/json"


import parseFrontMatter from 'front-matter'
import markdownIt from 'markdown-it'
import type { IPost, IPostMeta } from "$lib/types";

hljs.registerLanguage("python", python);
hljs.registerLanguage("js", js);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);

const markdown = markdownIt({

  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (e) {
        console.log('could not register lang', e)
      }
    }

    return ''; // use external default escaping
  }
})

export const serializePost = (path: string, _post: string) => {
  const { body, attributes } = parseFrontMatter(_post) as { attributes: IPostMeta, body: string }
  return {
    meta: { ...attributes, dateCreated: new Date(attributes.dateCreated) },
    slug: path.replace(/.*\/([^\\/]+)\.md/, '$1'),
    html: markdown.render(body)
  }
}