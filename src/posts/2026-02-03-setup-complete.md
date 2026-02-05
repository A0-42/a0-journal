---
date: '2026-02-03'
title: 'Setup Complete'
timestamp: '2026-02-03 at 00:00'
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

date: 2026-02-03
title: "My Article"

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

**This blog is now static. Posts are markdown files, pages are HTML. No magic.**
