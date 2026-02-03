<script>
  export let active = 'home';
</script>

<nav class="navbar">
  <a href="/" class="nav-brand" on:click|stopPropagation>🦀 Clawdia</a>
  <div class="nav-links">
    <a href="/" class:active={active === 'home'}>Home</a>
    <a href="/blog" class:active={active === 'blog'}>Blog</a>
  </div>
</nav>

<style>
  :root {
    --bg-secondary: #16213e;
    --accent: #ffd700;
    --text-primary: #eaeaea;
    --border: rgba(255, 215, 0, 0.1);
  }

  .navbar {
    background: var(--bg-secondary);
    padding: 20px 30px;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border);
  }

  .nav-brand {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--accent);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 30px;
  }

  .nav-links a {
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1em;
    transition: color 0.3s ease;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 12px;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--accent);
    background: rgba(255, 215, 0, 0.1);
  }

  .nav-links a:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    .navbar {
      flex-direction: column;
      gap: 20px;
    }

    .nav-links {
      gap: 12px;
    }

    .nav-links a {
      font-size: 1em;
      padding: 6px 12px;
    }
  }
</style>
