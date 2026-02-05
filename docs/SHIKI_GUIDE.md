# Guide Shiki avec MDsveX

Shiki est un highlighter de code précis et rapide, basé sur les grammaires TextMate de VS Code, idéal pour MDsveX car il génère du HTML statique au build-time sans JS runtime.

## Installation avec Bun

Installe Shiki en dev dependency :

```bash
bun add -D shiki
```

## Configuration MDsveX

Dans `svelte.config.js`, initialise un highlighter asynchrone et passe-le à MDsveX :

```javascript
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang) => {
			const { codeToHtml } = await import('shiki');
			return `{@html \`${codeToHtml(code, { lang, theme: 'vitesse-dark' })}\`}`;
		}
	}
};

const config = {
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
	},
	preprocess: [mdsvex(mdsvexOptions)],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
```

⚠️ **Note** : Cette méthode génère des artefacts `{@html ...}` dans le build. Voir la section "Méthode recommandée" ci-dessous pour une meilleure approche.

## Méthode recommandée (sans artefacts)

Pour éviter les artefacts `{@html ...}` dans le build, applique Shiki AVANT MDsveX, dans le load function server-side.

### Installation

```bash
bun add -D shiki
bun add -D @types/shiki  # Optionnel pour TypeScript
```

### Configuration dans `+page.server.ts`

````typescript
import type { PageServerLoad } from './$types';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createHighlighter } from 'shiki';
import { compile } from 'mdsvex';

// Singleton highlighter (créé une seule fois)
let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

export const prerender = true;

export const load: PageServerLoad = async () => {
	// Initialiser Shiki au premier appel
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

		// Appliquer Shiki AVANT mdsvex
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
````

### Configuration dans `svelte.config.js`

Désactiver le highlighting intégré de MDsveX :

```javascript
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: false // Désactivé - on utilise Shiki manuellement
};

const config = {
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
	},
	preprocess: [mdsvex(mdsvexOptions)],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
```

## Avantages de cette approche

✅ **Pas d'artefacts** : Pas de `{@html ...}` dans le build
✅ **Plus propre** : Code HTML coloré directement, pas de directive Svelte
✅ **Performance** : Singleton highlighter (créé une seule fois)
✅ **Thème** : Utilise n'importe quel thème Shiki (vitesse-dark, dracula, nord, etc.)
✅ **Extensible** : Ajouter des langages facilement

## Thèmes disponibles

Shiki propose de nombreux thèmes :

- `vitesse-dark` (utilisé dans ce projet)
- `vitesse-light`
- `dracula`
- `nord`
- `github-dark`
- `github-light`
- `monokai`
- `one-dark-pro`
- ...et bien plus !

Pour voir tous les thèmes disponibles : https://shiki.style/themes

## Langages supportés

Liste des langages supportés par Shiki : https://shiki.style/languages

Les plus courants :

- `javascript`, `typescript`, `svelte`
- `bash`, `shell`, `powershell`
- `python`, `rust`, `go`, `java`
- `css`, `html`, `json`
- `markdown`, `yaml`, `toml`
- `sql`, `dockerfile`

## Exemple d'usage

Dans un fichier `.md` :

````markdown
# Mon Post

## Exemple Bash

```bash
bun install
bun dev
```
````

## Exemple JavaScript

```javascript
console.log('Shiki marche !');
```

## Exemple TypeScript

```typescript
interface User {
	name: string;
	age: number;
}
```

```

## Debugging

### Problème : `Language "xxx" not found`

Erreur :
```

ShikiError: Language `toml` not found, you may need to load it first

````

Solution : Ajouter le langage dans la liste `langs` lors de l'initialisation du highlighter.

```typescript
highlighter = await createHighlighter({
	themes: ['vitesse-dark'],
	langs: ['javascript', 'typescript', 'toml', 'yaml']  // Ajouter toml ici
});
````

### Vérifier le build

```bash
bun build
```

Vérifier que le fichier `build/index.html` ne contient pas d'artefacts `{@html ...}` dans les blocs de code.

### Preview local

```bash
bun preview
```

Ouvrir http://localhost:4173 pour vérifier que le code est bien coloré.

## Ressources

- Documentation officielle Shiki : https://shiki.style
- Liste des thèmes : https://shiki.style/themes
- Liste des langages : https://shiki.style/languages
- MDsveX : https://mdsvex.piwon.work
