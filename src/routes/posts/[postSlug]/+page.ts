import parseFrontMatter from 'front-matter'
import markdownIt from 'markdown-it'

import 'highlight.js/styles/an-old-hope.min.css'

import hljs from 'highlight.js/lib/core'
import python from "highlight.js/lib/languages/python"
import js from "highlight.js/lib/languages/javascript"
import bash from "highlight.js/lib/languages/bash"
import json from "highlight.js/lib/languages/json"

export const prerender = true

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

export async function load({ params: { postSlug: slug } }) {
	const { default: post } = await import(`$fixtures/posts-md/${slug}.md?raw`)
	const { attributes, body } = parseFrontMatter(post)
	return { post: { slug, html: markdown.render(body), meta: attributes } }
}