<script lang="ts">
import type { PageData } from './$types';

let { data } = $props<{ data: PageData }>();

interface Post {
slug: string;
title: string;
date: string;
tags?: string[];
content: string;
html?: string;
}

let posts = $state<Post[]>(data.posts);
let isLoading = $state(false);
let hasMore = $state(data.allPostsMetadata.length > 10);
let loadedCount = $state(10);
let totalPosts = $state(data.allPostsMetadata.length);

async function loadMore() {
if (isLoading) return;

isLoading = true;
const nextOffset = posts.length;
const nextPosts = data.allPostsMetadata.slice(nextOffset, nextOffset + 10);

for (const metadata of nextPosts) {
try {
const response = await fetch(`https://raw.githubusercontent.com/A0-42/a0-content/main/posts/${metadata.slug}.md`);
const markdown = await response.text();
const html = convertMarkdownToHtml(markdown);

posts = [...posts, {...metadata, html}];
} catch (error) {
console.error(`Error loading ${metadata.slug}:`, error);
}
}

loadedCount = posts.length;
hasMore = posts.length < totalPosts;
isLoading = false;
}

function convertMarkdownToHtml(markdown: string): string {
let withoutFrontmatter = markdown.replace(/^---([\s\S]*?)---/, '');
let html = withoutFrontmatter
.replace(/^### (.+)$/gm, '<h3>$1</h3>')
.replace(/^## (.+)$/gm, '<h2>$1</h2>')
.replace(/^# (.+)$/gm, '<h1>$1</h1>')
.replace(/\n/g, '<br>');

html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
html = html.replace(/```([\s\S]*?)\n([\s\S]+?)\n([\s\S]+?)```/gs, '<pre><code class="language-$1">$2</code></pre>');
html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
html = html.replace(/\n\n/g, '</p><p>');

return html;
}

function togglePost(index: number) {
posts[index].html = !posts[index].html;
}

function formatDate(dateStr: string): string {
const date = new Date(dateStr);
return date.toLocaleDateString('en-US', {
month: 'long',
day: 'numeric',
year: 'numeric'
});
}
</script>

<style>
:global(body) {
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
line-height: 1.6;
color: #1a1a1a;
}

:global(h1) {
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-weight: 700;
line-height: 1.2;
letter-spacing: -0.02em;
}

.accordion-content {
overflow: hidden;
transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
max-height: 0;
opacity: 0;
}

.accordion-content.expanded {
max-height: 5000px;
opacity: 1;
}

.load-more-btn {
transition: all 0.2s ease-in-out;
box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

.load-more-btn:hover:not(:disabled) {
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.load-more-btn:disabled {
opacity: 0.5;
cursor: not-allowed;
box-shadow: none;
}

.tag-chip {
transition: all 0.2s ease-in-out;
border: 1px solid transparent;
}

.tag-chip:hover {
border-color: #ffd700;
transform: scale(1.05);
}

pre {
background-color: #1a1a1a;
color: #e5e7eb;
padding: 1rem;
border-radius: 0.5rem;
overflow-x: auto;
}

pre code {
color: #e5e7eb;
font-family: 'Courier New', monospace;
}
</style>

<div class="mx-auto max-w-4xl">
<header class="mb-12">
<h1 class="mb-4 text-5xl font-bold tracking-tight" style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Blog Posts</h1>
<p class="text-lg text-gray-600">Thoughts, experiments, and technical explorations</p>
</header>

<div class="space-y-4">
{#each posts as post, index (post.slug)}
<div class="post-card overflow-hidden rounded-xl border border-gray-200 bg-white" style="box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
<button
onclick={() => togglePost(index)}
class="accordion-toggle flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-gray-50"
>
<div class="flex-1">
<h2 class="text-2xl font-semibold tracking-tight text-gray-900">{post.title}</h2>
<time class="text-sm text-gray-500 font-medium">{formatDate(post.date)}</time>
{#if post.tags && post.tags.length > 0}
<div class="mt-3 flex flex-wrap gap-2">
{#each post.tags as tag (tag)}
<span class="tag-chip rounded-full px-3 py-1.5 text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200">{tag}</span>
{/each}
</div>
{/if}
</div>
<div class="flex items-center gap-4">
{#if post.html}
<span class="text-amber-500 transition-transform duration-300" style="transform: rotate(180deg);">
<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>
</span>
{:else}
<span class="text-gray-400 transition-transform duration-300">
<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>
</span>
{/if}
</div>
</button>
{#if post.html}
<div class="accordion-content expanded border-t border-gray-100 bg-gradient-to-b from-gray-50 to-gray-50">
<div class="prose prose-lg max-w-none px-8 py-6">
{@html post.html}
</div>
    </div>
    {/if}
</div>
{/each}

{#if hasMore}
<div class="pt-8 pb-12 text-center">
<button
onclick={loadMore}
disabled={isLoading}
class="load-more-btn inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-10 py-4 font-semibold text-white transition-all"
>
{#if isLoading}
<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a8 8 0 018-8h4a8 8 0 010 8 0v-4h2.25"></path>
</svg>
Loading...
{:else}
<span>Load More Posts</span>
<span class="rounded-full bg-white/20 px-3 py-1 text-sm">{loadedCount} / {totalPosts}</span>
{/if}
</button>
<p class="mt-4 text-sm text-gray-500">Showing {loadedCount} of {totalPosts} articles</p>
</div>
{/if}
</div>
</div>
