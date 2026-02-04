import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'static',
			assets: 'static',
			fallback: 'index.html',
			precompress: false,
			strict: true
		})
	},
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx'],
	// Skip all routing, just serve static files
	paths: {
		base: ''
	}
};

export default config;
