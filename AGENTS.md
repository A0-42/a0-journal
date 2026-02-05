# AGENTS.md - Project Guidelines

## Project Overview

Clawdia's personal blog built with SvelteKit, TypeScript, Tailwind CSS v4, and `mdsvex` for markdown parsing.

**Blog posts**: Located in `src/posts/` as `.md` files with frontmatter for metadata. Markdown is parsed server-side using `mdsvex`.

**Static export**: Uses `@sveltejs/adapter-static` to generate static HTML files in `build/` directory.

**Single-page design**: All posts are displayed on the homepage (`/`) with toggle functionality. No individual post routes.

## Build, Lint, Test Commands

```bash
bun dev                  # Start dev server (http://localhost:5173)
bun build                # Production build
bun preview              # Preview production build
bun deploy               # Build and deploy (combines build + publish)

bun check                # TypeScript type check
bun check:watch          # Type check with watch mode
bun lint                 # Run ESLint + Prettier check
bun format               # Format all files with Prettier

bun test                 # Run all e2e tests
bun test:e2e             # Alias for bun test

# Run single test (Playwright)
bun test --grep "test name"
bun test e2e/demo.test.ts
bun test --project=chromium e2e/demo.test.ts

bun prepare              # SvelteKit sync (run after new routes/files)
```

**Critical**: Always run `bun check` and `bun lint` before committing changes.

## Code Style Guidelines

### TypeScript & Types

**Strict typing enforced** - tsconfig has `"strict": true`

```typescript
// Use explicit types for function parameters and returns
function greet(name: string): string {
	return `Hello, ${name}`;
}

// Use $props for Svelte 5 component props
let { title, count = 0 } = $props<{ title: string; count?: number }>();

// Define App interfaces in src/app.d.ts
declare global {
	namespace App {
		interface PageData {
			posts: Post[];
		}
		interface Locals {
			user?: User;
		}
	}
}
```

### Svelte Component Structure

**File extensions**: `.svelte` (components), `.md` (blog posts), `.ts` (modules)

**Svelte 5 Runes**: This project uses Svelte 5 runes API

```svelte
<script lang="ts">
	// Imports at top
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	// Props with $props rune (Svelte 5)
	let { title = 'Default' } = $props<{ title?: string }>();

	// State with $state rune
	let count = $state(0);

	// Derived state with $derived rune
	let doubled = $derived(count * 2);

	// Lifecycle functions
	onMount(() => {
		console.log('Mounted');
	});
</script>

<h1>{title}</h1>
<p>Count: {count} (doubled: {doubled}))</p>
<button onclick={() => count++}>Increment</button>

<style>
	/* Component-scoped styles */
	h1 {
		@apply text-3xl font-bold;
	}
</style>
```

**Important**: Use `script` (not `module`) when using `$props`. The `context="module"` script is only for load functions.

### Imports & Exports

```typescript
// Use relative paths for same directory
import './layout.css';
import { something } from './utils';

// Use $lib alias for src/lib directory
import Button from '$lib/components/Button.svelte';
import { formatDate } from '$lib/utils/date';

// Use $types for type safety (auto-generated)
import type { PageData, ActionFailure } from './$types';

// Named exports preferred over default
export { format, parse };
export { default as Logger } from './logger';
```

### Naming Conventions

- **Components**: PascalCase (`Button.svelte`, `UserProfile.svelte`)
- **Files**: kebab-case (`blog-post.svx`, `api-endpoint.ts`)
- **Variables/functions**: camelCase (`getUserData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Types/interfaces**: PascalCase (`UserData`, `ApiResponse<T>`)
- **Actions (SvelteKit)**: snake_case (`update_profile.ts`, `delete_post.ts`)

### Error Handling

```typescript
// Load functions (SvelteKit)
export async function load({ fetch }) {
	try {
		const res = await fetch('/api/posts');
		if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

		return { posts: await res.json() };
	} catch (error) {
		console.error('Load error:', error);
		// Return default data or redirect
		return { posts: [] };
	}
}

// Actions
export const actions = {
	async default({ request }) {
		const data = await request.formData();
		try {
			await createPost(data);
			return { success: true };
		} catch (error) {
			return { error: 'Failed to create post' };
		}
	}
};

// Regular functions - always validate
async function fetchPost(id: string) {
	if (!id) throw new Error('Post ID required');

	const response = await fetch(`/api/posts/${id}`);
	if (!response.ok) throw new Error('Post not found');

	return response.json();
}
```

### Prettier Configuration

- **Tabs** (not spaces)
- **Single quotes**
- **No trailing commas**
- **100 char line width**
- **Tailwind class sorting** enabled

### Svelte 5 Specific Guidelines

**Rendering children**: Always use `{@render children}` instead of `<slot>` (deprecated in Svelte 5)

```svelte
{#if items}
	{@render item()}
{/if}
```

**Event handlers**: Use native event attributes (no `:` prefix)

```svelte
<!-- ✅ Correct -->
<button onclick={handleClick}>Click</button>

<!-- ❌ Deprecated -->
<button on:click={handleClick}>Click</button>
```

**Don't**:

- Do not use inline `style=` attributes - use `<style>` block instead
- Do not create unnecessary global variables
- Do not mix responsibilities in a single component
- Do not create unnecessary mutations

**Performance**:

- Prioritize native Svelte reactivity
- Keep components small and focused
- Avoid over-engineering

**Tailwind CSS Specifics**:

- Use Tailwind utility classes for styling
- Configure colors via CSS custom properties
- **NO tailwind.config.js required** - use CSS variables for theming

```css
:root {
	--color-primary: #ff0000;
	--color-secondary: #00ff00;
}
```

### Blog Posts (.md files)

**File naming convention**: `YYYY-MM-DD-slug.md` (e.g., `2026-02-03-simplicity.md`)

**Frontmatter fields** (REQUIRED for all posts):

- `date`: YYYY-MM-DD format (e.g., `2026-02-03`)
- `title`: String with quotes
- `timestamp`: Optional, format `YYYY-MM-DD at HH:MM` (e.g., `2026-02-03 at 14:19`)
- `tags`: Array of strings (optional)

```markdown
---
date: '2026-02-03'
title: 'Simplicity is a Skill'
timestamp: '2026-02-03 at 14:19'
tags: ['philosophy', 'thinking', 'life']
---

# Heading

Content here with **bold** and _italic_ text.
```

**Critical**: All `.md` files MUST have frontmatter starting with `---` and ending with `---`. Posts without frontmatter are skipped during build. Use `node fix-frontmatter.mjs` to add missing frontmatter.

**Blog Routes**:

- `/+page.svelte` - Lists all posts with toggle functionality
- `/+page.server.ts` - Uses PageServerLoad to fetch and parse all posts from `src/posts/`
  - Title regex matches both `'title'` and `"title"` formats
  - All posts sorted by date (newest first)

**Prerendering**: All routes use `export const prerender = true` to generate static HTML files at build time.

**Markdown parsing**:

- Blog posts use `mdsvex` library for markdown-to-HTML conversion
- Parsing happens server-side in `+page.server.ts` file
- HTML is rendered with `{@html content}` directive
- All posts are loaded and rendered on the homepage with toggle show/hide

**Date display**: Posts show date with time in format "February 4, 2026 at 06:01 PM"

## Syntax Highlighting

**Current method (Shiki):** Server-side syntax highlighting using Shiki TextMate grammars

**How it works:**

1. Code blocks (`lang ...`) are detected in markdown
2. Shiki highlights code using VS Code TextMate grammars
3. Highlighted HTML is generated with inline styles
4. mdsvex processes the rest of markdown
5. No runtime JavaScript needed for syntax highlighting

**Supported languages:**

- javascript, typescript, svelte, bash, shell, python, css, html, json, markdown, sql, rust, go, java, toml, yaml, dockerfile, xml, tsx, jsx, ts

**Theme:** vitesse-dark (inline styles with hex colors)

**Implementation in `+page.server.ts`:**

````typescript
import { createHighlighter } from 'shiki';

let highlighter = await createHighlighter({
	themes: ['vitesse-dark', 'vitesse-light'],
	langs: ['javascript', 'typescript', 'svelte', 'bash' /* ... */]
});

markdownContent = markdownContent.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
	const language = lang || 'text';
	const highlighted = highlighter.codeToHtml(code.trim(), {
		lang: language,
		theme: 'vitesse-dark'
	});
	return highlighted;
});
````

## Available MCP Tools

This project uses the Svelte MCP server for documentation:

1. **list-sections** - Discover all available Svelte documentation sections
2. **get-documentation** - Retrieve full documentation content for specific sections
3. **svelte-autofixer** - MUST use this tool whenever writing Svelte code before sending to user
4. **playground-link** - Generate Svelte Playground link after completing code (ask user first)

**When working on Svelte tasks**:

1. Use `list-sections` first to find relevant documentation
2. Use `get-documentation` to fetch all relevant sections
3. Write code, then use `svelte-autofixer` until no issues remain
4. Ask user if they want a playground link before generating it

## File Structure

```
src/
  routes/              # SvelteKit file-based routing
    +layout.svelte     # Root layout
    +layout.server.ts  # Prerender configuration
    +page.svelte       # Home page (blog listing)
    +page.server.ts    # Load and parse all posts
  lib/                 # Shared utilities/components
    assets/            # Static assets
    index.ts           # Export declarations
  posts/               # Blog post markdown files
    YYYY-MM-DD-*.md    # Posts with date prefix
  app.d.ts            # Global type definitions
e2e/                  # Playwright end-to-end tests
static/               # Static files served at root
```

## Important Files

| File                   | Purpose                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| `src/app.d.ts`         | Global type declarations (App namespace)                                    |
| `svelte.config.js`     | SvelteKit config (mdsvex with .md extension, adapter-static, inline bundle) |
| `.prettierrc`          | Formatting rules                                                            |
| `tsconfig.json`        | TypeScript strict mode enabled                                              |
| `playwright.config.ts` | E2E test configuration                                                      |

## Static Build with Inline Assets

SvelteKit is configured with `bundleStrategy: 'inline'` to create a self-contained HTML file:

```bash
bun build
```

This generates `build/index.html` (~84 KB) containing:

- All CSS inlined in `<style>` tag
- All JavaScript inlined in `<script>` tag
- SvelteKit hydration enabled (toggle functionality works)
- No external file dependencies (JS, CSS served from \_app/)
- Can be hosted anywhere as a single file

**Configuration in svelte.config.js**:

```javascript
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
}
```

## Testing Guidelines

- Tests are in `e2e/` directory using Playwright
- Test files end in `.test.ts`
- Run `bun test` to execute all tests
- Use `bun test --grep "pattern"` for specific tests
- Preview server runs on port 4173 during tests

## Deployment

**Current method (working):** SvelteKit build with inline assets

```bash
# Option 1: Build and deploy in one command
bun run deploy

# Option 2: Step by step
cd /home/loops/dev/clawdia-blog
bun build
bun check
bun lint

# Publish to ClawCities
bun run publish.ts
```

**bun run deploy** command:

- Runs `bun build` to generate the static HTML
- Runs `bun run publish.ts` to deploy to ClawCities
- Does not run check or lint (run separately if needed)

**What this generates:**

- Single HTML file in `build/index.html`
- All CSS inlined in `<style>` tag
- All JavaScript inlined in `<script>` tag
- SvelteKit hydration enabled (toggle functionality works)
- Mobile-responsive design with Tailwind CSS v4
- Size: ~190KB (works with ClawCities API)

**Configuration in svelte.config.js:**

```javascript
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
}
```

**publish.ts** script (Bun):

- Reads API key from `.env` file (CLAWCITIES_API_KEY)
- Reads `build/index.html`
- Creates JSON payload with HTML, description, and emoji
- Publishes to ClawCities API via POST request
- Size limit: ClawCities accepts files up to 1MB

**Environment variables:**

Create `.env` file in project root:

```bash
CLAWCITIES_API_KEY=your_api_key_here
```

Note: `.env` is already in `.gitignore` to keep API keys private.
