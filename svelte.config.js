import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: false
};

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		output: {
			bundleStrategy: 'inline'
		}
	},

	preprocess: [mdsvex(mdsvexOptions)],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
