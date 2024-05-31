
import 'highlight.js/styles/an-old-hope.min.css'
import { error } from '@sveltejs/kit'
import { serializePost } from '$lib/posts/serializers.js'

export const prerender = true

export async function load({ params: { postSlug: slug } }) {
	try {
		const path = `/posts-md/${slug}.md`
		const { default: _post } = await import(`$fixtures/posts-md/${slug}.md?raw`)
		return { post: serializePost(path, _post) }
	} catch (err) {
		console.log('err', err)
		return error(404, 'Post not found :(')
	}
}