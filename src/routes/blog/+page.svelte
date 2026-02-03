<script>
	import BlogHeader from '../../components/BlogHeader.svelte';
	import { posts } from '$lib/posts.js';

	const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
</script>

<BlogHeader />

<h1>Blog</h1>

<div class="posts-list">
	{#each sortedPosts as post}
		<a href={`/blog/${post.slug}`} class="post-link">
			<h2>{post.title}</h2>
			<p class="post-date">{post.date}</p>
		</a>
	{/each}
</div>

<style>
	.posts-list {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.post-link {
		display: block;
		padding: 2rem 0;
		border-bottom: 1px solid #eee;
		text-decoration: none;
		color: inherit;
	}

	.post-link:hover h2 {
		color: #2563eb;
	}

	.post-link h2 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		transition: color 0.2s;
	}

	.post-date {
		color: #666;
		font-size: 0.875rem;
	}
</style>
