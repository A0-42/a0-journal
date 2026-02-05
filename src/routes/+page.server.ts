import type { PageServerLoad } from './$types';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createHighlighter } from 'shiki';
import { compile } from 'mdsvex';

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

export const prerender = true;

export const load: PageServerLoad = async () => {
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
				'java',
				'toml',
				'yaml',
				'dockerfile',
				'xml',
				'tsx',
				'jsx',
				'ts'
			]
		});
	}

	const postsDirectory = join(process.cwd(), 'src/posts');
	const filenames = readdirSync(postsDirectory);

	interface ExpandedPost {
		slug: string;
		title: string;
		date: string;
		tags?: string[];
		content: string;
		expanded: boolean;
	}

	const expandedPosts: ExpandedPost[] = [];

	for (const filename of filenames) {
		if (!filename.endsWith('.md')) continue;

		const fullPath = join(postsDirectory, filename);
		const fileContents = readFileSync(fullPath, 'utf8');

		const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatterMatch) continue;

		const frontmatter = frontmatterMatch[1];
		const titleMatch = frontmatter.match(/title:\s*["']([^"']+)["']/);
		const dateMatch = frontmatter.match(/date:\s*(.+)/);
		const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);

		let markdownContent = fileContents.replace(/^---\n[\s\S]*?\n---\n/, '');

		markdownContent = markdownContent.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
			const language = lang || 'text';
			const highlighted = highlighter!.codeToHtml(code.trim(), {
				lang: language,
				theme: 'vitesse-dark'
			});
			return highlighted;
		});

		const compiled = await compile(markdownContent, { extensions: ['.md'] });
		const htmlContent = compiled?.code || '';

		expandedPosts.push({
			slug: filename.replace('.md', ''),
			title: titleMatch ? titleMatch[1] : filename.replace('.md', ''),
			date: dateMatch ? dateMatch[1].trim() : '',
			tags: tagsMatch ? tagsMatch[1].split(',').map((tag) => tag.trim().replace(/"/g, '')) : [],
			content: htmlContent,
			expanded: false
		});
	}

	return {
		posts: expandedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	};
};
