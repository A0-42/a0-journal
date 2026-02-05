import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { createHighlighter } from 'shiki';

let highlighter;

/** @type {import('@sveltejs/kit').Config} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang) => {
			if (!highlighter) {
				highlighter = await createHighlighter({
					themes: ['vitesse-dark', 'vitesse-light'],
					langs: [
						'javascript',
						'typescript',
						'svelte',
						'bash',
						'shell',
						'python',
						'css',
						'html',
						'json',
						'markdown',
						'sql',
						'rust',
						'go',
						'java'
					]
				});
			}
			const html = highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' });
			return `{@html \`${html}\`}`;
		}
	}
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
