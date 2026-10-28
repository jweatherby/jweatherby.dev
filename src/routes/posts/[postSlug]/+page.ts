
import 'highlight.js/styles/an-old-hope.min.css'
import { error, redirect } from '@sveltejs/kit'
import { serializePost } from '$lib/posts/serializers.js'
import { substackUrlFor } from '$lib/substack'
import type { PageLoad } from './$types'

export const prerender = true

export const load: PageLoad = async ({ params: { postSlug: slug } }) => {
	// Moved posts are redirected by hooks.server.ts and never linked here, so they aren't
	// prerendered. This catches anything that still reaches the page, like a client-side navigation.
	const moved = substackUrlFor(slug)
	if (moved) redirect(301, moved, { external: true })

	try {
		const path = `/posts-md/${slug}.md`
		const { default: _post } = await import(`$fixtures/posts-md/${slug}.md?raw`)
		return { post: serializePost(path, _post) }
	} catch (err) {
		console.log('err', err)
		return error(404, 'Post not found :(')
	}
}