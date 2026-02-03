#!/usr/bin/env bun

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BLOG_DIR = join(__dirname, '../static/blog');

function listPosts() {
	if (!existsSync(BLOG_DIR)) {
		console.log('No blog directory found');
		return;
	}

	const postsDir = join(BLOG_DIR, '[slug]');
	if (!existsSync(postsDir)) {
		console.log('No posts found');
		return;
	}

	const slugs = readdirSync(postsDir);
	console.log('Posts found:', slugs.length);
	console.log('');

	slugs.forEach(slug => {
		const indexFile = join(postsDir, slug, 'index.html');
		if (existsSync(indexFile)) {
			console.log(`• /blog/${slug}/`);
		}
	});
}

listPosts();
