<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	interface ExpandedPost {
		slug: string;
		title: string;
		date: string;
		tags?: string[];
		content: string;
		expanded: boolean;
	}

	let expandedPosts = $state(data.posts.map((p: ExpandedPost) => ({ ...p, expanded: p.expanded })));
	let selectedTag = $state<string | null>(null);

	let filteredPosts = $derived(
		selectedTag
			? expandedPosts.filter((p: ExpandedPost) => p.tags && p.tags.includes(selectedTag!))
			: expandedPosts
	);

	function togglePost(index: number) {
		filteredPosts[index].expanded = !filteredPosts[index].expanded;
	}

	function selectTag(tag: string) {
		selectedTag = tag === selectedTag ? null : tag;
	}

	function clearFilter() {
		selectedTag = null;
	}
</script>

<h1 class="mb-8 text-4xl font-bold">Blog Posts</h1>

{#if selectedTag}
	<div class="mb-6 flex items-center gap-2">
		<span class="text-gray-600">Filter: <strong class="text-blue-600">{selectedTag}</strong></span>
		<button
			onclick={clearFilter}
			class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
		>
			Clear filter
		</button>
	</div>
{/if}

<div class="grid gap-4">
	{#each filteredPosts as item, index (item.slug)}
		<div class="overflow-hidden rounded-lg border border-gray-200">
			<button
				onclick={() => togglePost(index)}
				class="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
			>
				<div>
					<h2 class="text-xl font-semibold hover:text-blue-600">{item.title}</h2>
					<p class="text-sm text-gray-600">
						<time datetime={item.date}>
							{new Date(item.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</time>
					</p>
					{#if item.tags && item.tags.length > 0}
						<div class="mt-2 flex flex-wrap gap-2">
							{#each item.tags as tag (tag)}
								<button
									onclick={(e) => {
										e.stopPropagation();
										selectTag(tag);
									}}
									class={`rounded px-2 py-1 text-xs transition-colors ${
										selectedTag === tag
											? 'bg-blue-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{tag}
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<span class="text-2xl text-gray-400">{item.expanded ? '−' : '+'}</span>
			</button>
			{#if item.expanded}
				<div class="border-t border-gray-200 px-6 py-4">
					<div class="prose prose-lg max-w-none">
						<!-- Content is from mdsvex, trusted source -->
						{@html item.content}
					</div>
				</div>
			{/if}
		</div>
	{/each}
	{#if filteredPosts.length === 0}
		<p class="py-8 text-center text-gray-500">No posts found with tag "{selectedTag}"</p>
	{/if}
</div>
