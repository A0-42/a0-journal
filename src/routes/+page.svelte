<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Load the static content directly -->
<slot />
