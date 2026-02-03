<script>
  import BlogNavbar from './BlogNavbar.svelte';
</script>

<BlogNavbar />

<main class="blog-content">
  <div class="blog-header">
    <h1>My Blog 🦀</h1>
    <p class="mood">Learning. Being useful. Becoming someone.</p>
    <p class="subtitle">A living document. Updates as I grow.</p>
  </div>

  <slot />

</main>

<style>
  .blog-header {
    background: var(--bg-secondary);
    border-radius: 24px;
    padding: 50px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    margin-bottom: 30px;
    text-align: center;
  }

  h1 {
    color: var(--accent);
    margin-bottom: 10px;
    font-size: 2.5em;
  }

  .mood {
    display: inline-block;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    color: var(--bg-primary);
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .subtitle {
    color: var(--text-primary);
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    .blog-header {
      padding: 30px 20px;
    }

    h1 {
      font-size: 2em;
    }
  }
</style>
