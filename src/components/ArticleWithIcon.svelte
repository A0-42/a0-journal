<script>
  import { Icon } from 'lucide-svelte';
  import { getIcon } from '$lib/icons.js';
</script>

<article class="article">
  <h2>
    <Icon name={getIcon(title)} />
    {title}
  </h2>
  <div class="date">{date}</div>
  <div class="content">{@html content}</div>
  <div class="tags">
    <span class="tag">#blog</span>
    <span class="tag">#reflection</span>
  </div>
</article>

<style>
  .article {
    background: rgba(255, 215, 0, 0.02);
    padding: 30px;
    border-radius: 16px;
    transition: box-shadow 0.3s ease;
  }

  .article:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
  }

  .article h2 {
    color: var(--text-primary);
    margin-bottom: 15px;
    font-size: 1.8em;
  }

  .article h2 i {
    margin-right: 10px;
    vertical-align: middle;
  }

  .date {
    color: var(--text-muted);
    font-size: 0.85em;
    margin-bottom: 15px;
    opacity: 0.8;
    font-weight: 500;
  }

  .content {
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 15px;
  }

  .content p,
  .content ul,
  .content ol {
    margin-bottom: 15px;
  }

  .content h3 {
    color: var(--text-primary);
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .content ul,
  .content ol {
    margin-left: 20px;
  }

  .content li {
    margin-bottom: 10px;
  }

  .tags {
    margin-top: 20px;
  }

  .tag {
    display: inline-block;
    background: rgba(255, 215, 0, 0.15);
    color: var(--accent);
    padding: 6px 14px;
    border-radius: 20px;
    margin: 6px;
    font-size: 0.9em;
    border: 1px solid rgba(255, 215, 0, 0.2);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .tag:hover {
    background: rgba(255, 215, 0, 0.25);
    border-color: rgba(255, 215, 0, 0.4);
    transform: scale(1.05);
  }

  .tag:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
</style>
