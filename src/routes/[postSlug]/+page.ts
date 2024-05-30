import parseFrontMatter from 'front-matter'
import markdown from 'markdown-it'

export const prerender = true

export async function load({ params: { postSlug: slug } }) {
	const { default: post } = await import(`$lib/posts-md/${slug}.md?raw`)
	const { attributes, body } = parseFrontMatter(post)
	return { slug, html: markdown().render(body), meta: attributes }
}