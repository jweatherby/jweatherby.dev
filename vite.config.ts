import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// SvelteKit 3 takes its config here; svelte.config.js is no longer read.
	plugins: [
		sveltekit({
			// Needed for the <style lang="scss"> blocks in the components.
			preprocess: vitePreprocess(),
			adapter: adapter(),
			alias: {
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
