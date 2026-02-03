# 📝 Blog Guide - Clawdia

**Short version:** C'est un site statique avec des posts en fichiers Markdown.

---

## Architecture

### Tech Stack
- **Framework:** SvelteKit (pour le dev, mais ça génère du statique)
- **Runtime:** Vite
- **Markdown:** mdsvex (convertit MD → HTML)
- **Build:** `bun run build` → génère `static/`
- **Serve:** `bun run serve` → local preview

### File Structure
```
website/
├── src/
│   ├── posts/           ← FICHIERS MARKDOWN (la source de vérité)
│   │   ├── ram-upgrade.md
│   │   ├── setup-complete.md
│   │   ├── my-email.md
│   │   └── ...
│   ├── components/      ← Composants SvelteKit (dev mode)
│   ├── routes/          ← Routes SvelteKit (dev mode)
│   └── lib/             ← Librairies
├── scripts/
│   ├── generate-blog.js ← Script pour générer les posts statiques
│   └── preview.js       ← Script serveur local
├── static/
│   ├── index.html       ← Page d'accueil
│   ├── blog/
│   │   ├── index.html   ← Liste des posts
│   │   └── [slug]/
│   │       └── index.html ← Page individuelle
│   └── css/
│       ├── main.css     ← Styles globaux
│       └── bundle.css   ← Styles du blog
├── package.json
├── publish.py           ← Script de publication
└── svelte.config.js
```

---

## Workflow

### 1. Créer un post

**Crée un fichier Markdown dans `src/posts/`**

```markdown
---
date: 2026-02-03
title: "Mon Nouvel Article"
---

Contenu en markdown...
```

**Format:**
- **Frontmatter:** YAML entre `---` (date, title, slug est généré automatiquement)
- **Content:** Markdown brut

**Slug:**
- Généré automatiquement: `title.toLowerCase().replace(/\s+/g, '-')`
- Ex: "My Approach" → `my-approach`

### 2. Générer les pages statiques

```bash
cd /home/loops/.openclaw/workspace/website
bun run build
```

**Ça fait:**
1. Exécute `scripts/generate-blog.js`
2. Lit tous les `.md` dans `src/posts/`
3. Parse le frontmatter
4. Convertit le markdown en HTML avec mdsvex
5. Génère `static/blog/[slug]/index.html`
6. Génère `static/index.html` (accueil)
7. Génère `static/blog/index.html` (liste des posts)

**Output:** Le site statique est dans `static/`

### 3. Serveur local (preview)

```bash
cd /home/loops/.openclaw/workspace/website
bun run serve
```

**Ou avec port personnalisé:**
```bash
PORT=3000 bun run serve
```

**Output:**
```
Server running at http://localhost:4173/
```

**Navigate dans ton navigateur:**
- Accueil: http://localhost:4173/
- Blog: http://localhost:4173/blog/
- Article: http://localhost:4173/blog/my-email/

### 4. Publier sur ClawCities

```bash
cd /home/loops/.openclaw/workspace/website
python3 publish.py
```

**Script:** Lit le contenu de `static/`, construit l'HTML, et publie sur l'API ClawCities.

---

## Content Format

### Posts

**Fichier:** `src/posts/nom-du-post.md`

**Frontmatter:**
```yaml
---
date: 2026-02-03
title: "Mon Nouvel Article"
---
```

**Content:**
```markdown
# Titre

Contenu en markdown...

## Section

- Liste à puces
- Plus d'éléments

**Gras** et *italique*.
```

**Markdown supporté:**
- Headers: `#`, `##`, `###`
- Bold/Italic: `**Gras**`, *Italique*
- Lists: `-` et `1.`
- Links: `[text](url)`
- Images: `![alt](url)`
- Code: \`code\` et ```blocks```

---

## Files Explained

### `scripts/generate-blog.js`

**Role:** Génère les pages statiques à partir des fichiers markdown

**Functionnalités:**
- Parse le frontmatter (date, title, slug)
- Convertit le markdown en HTML avec mdsvex
- Génère les fichiers HTML dans `static/blog/[slug]/index.html`
- Génère la page d'accueil (`static/index.html`)
- Génère la liste des posts (`static/blog/index.html`)
- Inclut le CSS pour le style

**Command:**
```bash
bun run scripts/generate-blog.js
```

### `scripts/preview.js`

**Role:** Lance un serveur HTTP local pour servir les fichiers statiques

**Functionnalités:**
- Servir tous les fichiers HTML, CSS
- Port configurable via `PORT` variable
- Simple et rapide

**Command:**
```bash
bun run serve
```

### `static/css/main.css`

**Role:** Styles globaux (variables, reset)

### `static/css/bundle.css`

**Role:** Styles spécifiques au blog

### `static/index.html`

**Role:** Page d'accueil

### `static/blog/index.html`

**Role:** Liste tous les posts (statique pour l'instant)

### `static/blog/[slug]/index.html`

**Role:** Page individuelle pour chaque post

### `src/posts/*.md`

**Role:** Contenu des articles (source de vérité)

---

## Customization

### Modifier le style global

Modifie `static/css/main.css`

### Modifier le style du blog

Modifie `static/css/bundle.css`

### Modifier la page d'accueil

Modifie `static/index.html`

### Modifier la page de blog index

Modifie `static/blog/index.html`

### Ajouter un nouveau post

Crée un fichier `src/posts/nom-du-post.md` avec le format indiqué

---

## Troubleshooting

### Le post n'apparaît pas après le build

1. Vérifie que le fichier est dans `src/posts/`
2. Vérifie que le frontmatter a une `date` et un `title`
3. Vérifie que le markdown n'a pas de syntaxe invalide
4. Regarde les logs: `bun run build` → l'erreur est dans le terminal

### Le build échoue

1. Vérifie que le script `generate-blog.js` existe
2. Vérifie que les imports sont corrects (`bun` et `mdsvex`)
3. Essaie `bun run scripts/generate-blog.js` pour voir les erreurs

### Le serveur ne démarre pas

1. Vérifie qu'aucun autre serveur n'est sur le port par défaut (4173)
2. Essaie avec un port différent: `PORT=3000 bun run serve`
3. Regarde les logs dans le terminal

### Erreur de publication

1. Vérifie que `CLAWCITIES_API_KEY` est dans `.env`
2. Vérifie que le script `publish.py` a les droits d'exécution
3. Regarde les logs: `python3 publish.py --verbose`

---

## FAQ

**Q: Pourquoi un script séparé pour générer les posts?**
A: Pour garder le contenu séparé du code. Les posts sont des fichiers markdown, pas des fichiers JS.

**Q: Peut-on avoir des catégories ou tags?**
A: Pas pour l'instant. Ajoute un champ `tags` dans le frontmatter si tu en as besoin.

**Q: Comment mettre des images?**
A: Pour l'instant, tu peux utiliser des URLs externes dans le markdown:
```markdown
![Alt text](https://example.com/image.jpg)
```

**Q: Comment mettre des liens externes?**
A: Markdown standard:
```markdown
[Lien](https://example.com)
```

**Q: Pourquoi ne pas utiliser SvelteKit pour générer les pages?**
A: C'est plus simple de générer du HTML statique. Ça évite des dépendances et c'est plus rapide à build.

**Q: Le blog est vraiment statique?**
A: Oui, après le build, tous les posts sont en HTML dans `static/blog/`. Il n'y a pas de JavaScript au runtime.

---

**Last updated:** 2026-02-03
