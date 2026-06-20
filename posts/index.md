---
title: 文章列表
---

# 📝 全部文章

<div id="article-list-app">
  <!-- 统计和工具栏 -->
  <div class="toolbar">
    <div class="filter-group">
      <button class="filter-btn active" data-tag="all">全部 (<span id="total-count">-</span>)</button>
      <button class="filter-btn" data-tag="prism">📐 棱镜 (<span id="prism-count">-</span>)</button>
      <button class="filter-btn" data-tag="zhaojian">🔭 朝鉴 (<span id="zhaojian-count">-</span>)</button>
    </div>
    <div class="sort-group">
      <select id="sort-select" class="sort-select">
        <option value="date-desc">最新</option>
        <option value="date-asc">最早</option>
        <option value="title-asc">标题 A-Z</option>
      </select>
    </div>
  </div>

  <!-- 文章列表容器 -->
  <div id="posts-container" class="articles-container">
    <p>加载中...</p>
  </div>

  <!-- 分页 -->
  <div id="pagination" class="pagination-app"></div>
</div>

<script>
(function() {
  if (typeof window === 'undefined') return;

  let allPosts = [];
  let filteredPosts = [];
  let currentPage = 1;
  const postsPerPage = 15;
  let currentFilter = 'all';
  let currentSort = 'date-desc';

  async function loadPosts() {
    console.log('[posts-index] 开始加载文章列表...');
    try {
      const res = await fetch('/posts-meta.json?t=' + Date.now());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      allPosts = await res.json();
      filteredPosts = [...allPosts];
      console.log('[posts-index] 成功加载', allPosts.length, '篇文章');

      // 更新统计
      document.getElementById('total-count').textContent = allPosts.length;
      document.getElementById('prism-count').textContent = allPosts.filter(p => p.category === 'prism').length;
      document.getElementById('zhaojian-count').textContent = allPosts.filter(p => p.category === 'zhaojian').length;

      renderPosts();
    } catch (e) {
      console.error('[posts-index] 加载文章失败:', e);
      const container = document.getElementById('posts-container');
      if (container) {
        container.innerHTML = '<div class="empty-state"><p>文章加载失败，请刷新页面重试</p><p style="font-size:0.8rem;color:var(--vp-c-text-3);">' + e.message + '</p></div>';
      }
    }
  }

  function renderPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;

    sortPosts();
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * postsPerPage;
    const pagePosts = filteredPosts.slice(start, start + postsPerPage);

    if (pagePosts.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>暂无符合条件的文章</p></div>';
    } else {
      container.innerHTML = pagePosts.map(post => {
        const categoryLabel = post.category === 'prism' ? '棱镜' : '朝鉴';
        const badgeClass = post.category === 'prism' ? 'badge-prism' : 'badge-zhaojian';
        const excerpt = post.excerpt ? post.excerpt.substring(0, 100) + '...' : '';

        return `
        <a href="${post.url}" class="article-card">
          <div class="article-meta">
            <span class="article-badge ${badgeClass}">${categoryLabel}</span>
            <span class="article-date">${formatDate(post.date)}</span>
          </div>
          <div class="article-title">${post.title}</div>
          <div class="article-excerpt">${excerpt}</div>
        </a>`;
      }).join('');
    }

    renderPagination(totalPages);
  }

  function sortPosts() {
    switch (currentSort) {
      case 'date-desc': filteredPosts.sort((a, b) => b.date.localeCompare(a.date)); break;
      case 'date-asc': filteredPosts.sort((a, b) => a.date.localeCompare(b.date)); break;
      case 'title-asc': filteredPosts.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN')); break;
    }
  }

  function renderPagination(totalPages) {
    const pag = document.getElementById('pagination');
    if (!pag || totalPages <= 1) { pag.innerHTML = ''; return; }

    let html = `<button ${currentPage <= 1 ? 'disabled' : ''} onclick="window.__articleGoTo(1)">«</button>`;
    html += `<button ${currentPage <= 1 ? 'disabled' : ''} onclick="window.__articleGoTo(${currentPage - 1})">‹</button>`;
    html += `<span class="page-info">${currentPage} / ${totalPages}</span>`;
    html += `<button ${currentPage >= totalPages ? 'disabled' : ''} onclick="window.__articleGoTo(${currentPage + 1})">›</button>`;
    html += `<button ${currentPage >= totalPages ? 'disabled' : ''} onclick="window.__articleGoTo(${totalPages})">»</button>`;
    pag.innerHTML = html;
  }

  window.__articleGoTo = function(page) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function formatDate(d) {
    const date = new Date(d);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function applyFilter(tag) {
    currentFilter = tag;
    currentPage = 1;
    if (tag === 'all') filteredPosts = [...allPosts];
    else filteredPosts = allPosts.filter(p => p.category === tag);
    renderPosts();
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.tag);
      });
    });

    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      renderPosts();
    });
  });
})();
</script>

<style>
.articles-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.article-card {
  display: block;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
}

.article-card:hover {
  border-color: var(--inzu-gold);
  transform: translateX(4px);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.article-badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.badge-prism {
  background: rgba(201, 168, 76, 0.15);
  color: var(--inzu-gold);
}

.badge-zhaojian {
  background: rgba(90, 141, 163, 0.15);
  color: var(--inzu-jade);
}

.article-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

.article-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
  line-height: 1.5;
}

.article-excerpt {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.pagination-app button {
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 2.2rem;
  font-size: 0.85rem;
}

.pagination-app button:hover:not(:disabled) {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}

.pagination-app button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

:root:not(.dark) .article-card { background: var(--vp-c-bg-elv); }
:root:not(.dark) .article-title { color: var(--inzu-ink); }
</style>
