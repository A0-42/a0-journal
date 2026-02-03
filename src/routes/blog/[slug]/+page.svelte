<script>
	import { render } from 'svelte-mdx';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fileURLToPath } from 'url';
	import { dirname, join } from 'path';

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	let content = '';
	let error = null;

	onMount(async () => {
		try {
			const { default: posts } = await import('$lib/posts.js');

			const article = posts.find(p => p.slug === $page.params.slug);

			if (article) {
				const mdxContent = `---
title: ${article.title}
date: ${article.date}
---

${article.content}`;
				content = mdxContent;
			} else {
				error = 'Article not found';
			}
		} catch (err) {
			error = err.message;
		}
	});
</script>

{#if error}
	<div class="error">
		<h1>404</h1>
		<p>{error}</p>
	</div>
{:else if content}
	{#await render(content)}
		<div class="mdx-content" set:html={$$result}></div>
	{:catch err}
		<div class="error">
			<h1>Error rendering MDX</h1>
			<p>{err.message}</p>
		</div>
	{/await}
{/if}

<style>
	.mdx-content {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		line-height: 1.8;
	}

	.mdx-content h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.mdx-content h2 {
		font-size: 2rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.mdx-content p {
		margin-bottom: 1.5rem;
	}

	.error {
		text-align: center;
		padding: 4rem 2rem;
		color: #666;
	}
</style>
