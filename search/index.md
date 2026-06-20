---
title: 搜索
---

# 🔍 搜索

> 输入关键词，搜索全站内容

<div id="search-page">
  <div class="search-bar-container">
    <input 
      type="text" 
      id="search-input" 
      class="search-input" 
      placeholder="输入关键词搜索..."
      autofocus
    />
  </div>
  <div id="search-results" class="search-results">
    <p class="search-hint">输入关键词后自动搜索</p>
  </div>
</div>

<script>
(function() {
  if (typeof window === 'undefined') return;

  let pagefind = null;

  async function initSearch() {
    try {
      pagefind = await import('/pagefind/pagefind.js');
    } catch (e) {
      console.error('Pagefind 加载失败:', e);
    }
  }

  async function doSearch(query) {
    const container = document.getElementById('search-results');
    if (!container) return;

    if (!query || !pagefind) {
      container.innerHTML = '<p class="search-hint">输入关键词后自动搜索</p>';
      return;
    }

    container.innerHTML = '<p class="search-hint">搜索中...</p>';

    try {
      const results = await pagefind.search(query);
      
      if (results.results.length === 0) {
        container.innerHTML = `<div class="search-empty">
          <p>没有找到「${query}」相关内容</p>
          <p class="search-tip">试试不同的关键词</p>
        </div>`;
        return;
      }

      const items = await Promise.all(
        results.results.slice(0, 20).map(r => r.data())
      );

      container.innerHTML = `
        <div class="search-meta">找到 ${items.length} 个结果</div>
        ${items.map(item => `
          <a href="${item.url}" class="search-result-item">
            <div class="result-title">${item.meta.title}</div>
            <div class="result-excerpt">${item.excerpt || ''}</div>
          </a>
        `).join('')}
      `;
    } catch (e) {
      container.innerHTML = '<p class="search-hint">搜索出错了，请重试</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await initSearch();

    const input = document.getElementById('search-input');
    if (!input) return;

    // 从 URL 参数获取初始查询
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      input.value = q;
      await doSearch(q);
    }

    // 输入后自动搜索（防抖）
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => doSearch(input.value.trim()), 300);
    });
  });
})();
</script>

<style>
.search-bar-container {
  max-width: 600px;
  margin: 1.5rem auto;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--inzu-gold);
}

.search-results {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-hint {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 2rem;
  font-size: 0.9rem;
}

.search-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
}

.search-empty {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-3);
}

.search-tip {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-top: 0.5rem;
}

.search-result-item {
  display: block;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.search-result-item:hover {
  border-color: var(--inzu-gold);
  transform: translateX(4px);
}

.result-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
}

.result-excerpt {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .search-input { font-size: 0.9rem; }
}
</style>
