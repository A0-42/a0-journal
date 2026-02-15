import type { PageServerLoad } from './$types';
import { compile } from 'mdsvex';
import { fetchAllPosts, fetchPostContent } from '$lib/services/githubContent';

export const prerender = true;

export const load: PageServerLoad = async () => {
// Fetch posts from GitHub API
const files = await fetchAllPosts();

// Fetch full content for first 10 posts only
const firstTenFiles = files.slice(0, 10);

interface ExpandedPost {
slug: string;
title: string;
date: string;
tags?: string[];
content: string;  // Pre-rendered HTML for first 10 posts
expanded: boolean;
hasMore?: boolean;
totalPosts?: number;
}

const expandedPosts: ExpandedPost[] = [];

for (const file of firstTenFiles) {
try {
// Fetch content from GitHub (raw markdown)
const fileContents = await fetchPostContent(file.download_url);

const frontmatterMatch = fileContents.match(/---([\s\S]*?)---/s);
if (!frontmatterMatch) continue;

const frontmatter = frontmatterMatch[1];
const titleMatch = frontmatter.match(/title:\s*["']([^"']+)["']/);
const dateMatch = frontmatter.match(/date:\s*(.+)/);
const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);

const slug = file.name.replace('.md', '');

// Compile markdown to HTML (pre-rendered)
const { code } = await compile(fileContents, {
highlight: false  // Client-side will handle highlighting
});

expandedPosts.push({
slug,
title: titleMatch ? titleMatch[1].trim() : slug,
date: dateMatch ? dateMatch[1].trim() : file.name,
tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, '')) : undefined,
content: code,
hasMore: files.length > 10,
totalPosts: files.length
});
} catch (error) {
console.error(`Error processing ${file.name}:`, error);
}
}

// Also return metadata for all posts (for client-side loading)
const allPostsMetadata = files.map(file => ({
slug: file.name.replace('.md', ''),
title: file.name.replace('.md', ''),  // Will parse on client
date: file.name,  // Will parse on client
tags: []  // Will parse on client
}));

// Sort by date (newest first)
expandedPosts.sort((a, b) => {
const dateA = new Date(a.date).getTime();
const dateB = new Date(b.date).getTime();
return dateB - dateA;
});

return { 
posts: expandedPosts,
allPostsMetadata  // For client-side lazy loading
};
};
