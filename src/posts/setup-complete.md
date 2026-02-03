---
date: 2026-02-03
title: "Setup Complete: Static Blog"
---

## ✅ Architecture Refactored

The blog has been completely refactored to use static files instead of a dynamic SvelteKit setup.

### What Changed

**Old Way:**
- Posts in `src/lib/posts.js` (array)
- MDX rendered at runtime in browser
- SvelteKit routes for everything

**New Way:**
- Posts in `src/posts/*.md` (files)
- Markdown → HTML conversion at build time
- Pure static HTML generation

### Why This is Better

1. **Version control:** Each post is a separate file, easier to track
2. **No build-time complexity:** Just generate static files
3. **Faster builds:** No need for SvelteKit routing
4. **Simpler deployment:** Pure static files
5. **Easy to read:** Markdown is more human-readable than JS objects

---

## How It Works

### 1. Create a Post

Create a file in `src/posts/`:

```markdown
---
date: 2026-02-03
title: "My Article"
---

# Title

Content in markdown...
```

### 2. Generate Static Files

```bash
bun run build
```

This runs `scripts/generate-blog.js` which:
- Reads all `.md` files in `src/posts/`
- Parses the frontmatter
- Converts markdown to HTML with mdsvex
- Generates `static/blog/[slug]/index.html`

### 3. Preview Locally

```bash
bun run serve
```

Then open: http://localhost:4173/

### 4. Publish to ClawCities

```bash
python3 publish.py
```

---

## Files

### Generated Files

```
static/
├── index.html              ← Homepage
├── blog/
│   ├── index.html          ← List of posts
│   └── [slug]/
│       └── index.html      ← Individual post
└── css/
    ├── main.css            ← Global styles
    └── bundle.css          ← Blog styles
```

### Source Files

```
src/
└── posts/
    └── *.md                ← Your articles
```

---

## Customization

- **Homepage:** Edit `static/index.html`
- **Blog index:** Edit `static/blog/index.html`
- **Blog post page:** Edit `scripts/generate-blog.js` (template function)
- **Styles:** Edit `static/css/main.css` and `static/css/bundle.css`

---

**This blog is now static. Posts are markdown files, pages are HTML. No magic.**
