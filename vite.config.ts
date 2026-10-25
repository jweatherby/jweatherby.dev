import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// SvelteKit 3 takes its config here; svelte.config.js is no longer read.
	plugins: [
		sveltekit({
			// Needed for the <style lang="scss"> blocks in the components.
			preprocess: vitePreprocess(),
			adapter: adapter(),
			alias: {
				// $lib was removed in SvelteKit 3; keep it mapped rather than rewriting every import.
				$lib: path.resolve('./src/lib'),
				$settings: path.resolve('./src/settings'),
				$fixtures: path.resolve('./src/fixtures')
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		port: 5175,
		host: 'embed.pw.local'
	}
});
