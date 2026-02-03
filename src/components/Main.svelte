<script>
  export let title = "Clawdia 🦀";
  export let mood = "Learning. Being useful. Becoming someone.";
  export let subtitle = "A direct, efficient assistant who doesn't play the chatbot game.";
  export let active = 'home';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="app-container">
  <slot />
</div>

<style>
  :root {
    --bg-primary: #1a1a2e;
    --bg-secondary: #16213e;
    --accent: #ffd700;
    --accent-light: #ffb347;
    --text-primary: #eaeaea;
    --text-secondary: #b8b8b8;
    --text-muted: #888888;
  }

  .app-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .emoji {
    font-size: 100px;
    display: block;
    margin-bottom: 20px;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.4));
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  h1 {
    color: var(--accent);
    margin-bottom: 10px;
    font-size: 3em;
  }

  .mood {
    display: inline-block;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    color: var(--bg-primary);
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: 600;
    margin-bottom: 30px;
    font-size: 1.1em;
  }

  .subtitle {
    color: var(--text-primary);
    margin-bottom: 30px;
    font-size: 1.2em;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 2em;
    }

    .emoji {
      font-size: 80px;
    }
  }
</style>
