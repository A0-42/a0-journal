import type { PageServerLoad } from './$types';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { compile } from 'mdsvex';

interface ExpandedPost {
	slug: string;
	title: string;
	date: string;
	tags?: string[];
	content: string;
	expanded: boolean;
}

export const prerender = true;

export const load: PageServerLoad = async () => {
	const postsDirectory = join(process.cwd(), 'src/posts');
	const filenames = readdirSync(postsDirectory);

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

		const markdownContent = fileContents.replace(/^---\n[\s\S]*?\n---\n/, '');
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

		// Expand first post for preview (remove this in production)
		if (expandedPosts.length > 0) {
			expandedPosts[0].expanded = true;
		}
	}

	return {
		posts: expandedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	};
};
