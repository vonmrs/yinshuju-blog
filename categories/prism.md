---
title: 棱镜 · 技术深度
---

# 📐 棱镜 · 技术深度

> 技术之下，妖形尽显。

---

## 关于棱镜

棱镜是银枢局的技术专栏，聚焦：

- **前端**：Vue / React / CSS / TypeScript / 性能优化
- **后端**：Node.js / 数据库 / API 设计 / 云部署
- **AI 工程**：提示词工程 / Agent 开发 / AI 工具链
- **产品**：PRD 撰写 / 用户研究 / 数据分析

---

<div id="category-app">
  <!-- 工具栏 -->
  <div class="toolbar">
    <div class="filter-group">
      <button class="filter-btn active" data-tag="all">全部</button>
      <button class="filter-btn" data-tag="棱镜">棱镜</button>
      <button class="filter-btn" data-tag="技术">技术</button>
      <button class="filter-btn" data-tag="AI">AI</button>
      <button class="filter-btn" data-tag="前端">前端</button>
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
  <div id="posts-container" class="posts-container">
    <p>加载中...</p>
  </div>

  <!-- 分页容器 -->
  <div id="pagination" class="pagination"></div>
</div>

---

<div class="subscribe-cta">
<h3>📱 订阅棱镜</h3>
<p>技术干货，第一时间送达。</p>
<div class="qrcode-row">
<img src="/wechat-qrcode.jpg" alt="银枢局公众号" class="cta-qr" />
<div class="cta-text">
<p>微信搜索「银枢局」</p>
<p>回复「订阅」加入推送</p>
</div>
</div>
</div>

<script>
(function() {
  // SSR 守卫：只在浏览器端执行
  if (typeof window === 'undefined') return;

  let allPosts = [];
  let filteredPosts = [];
  let currentPage = 1;
  const postsPerPage = 10;
  let currentFilter = 'all';
  let currentSort = 'date-desc';

  // 加载文章数据
  async function loadPosts() {
    try {
      const res = await fetch('/posts-meta.json');
      const meta = await res.json();
      allPosts = meta.filter(p => p.category === 'prism');
      filteredPosts = [...allPosts];
      renderPosts();
    } catch (e) {
      console.error('加载文章失败:', e);
    }
  }

  // 渲染文章列表
  function renderPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;

    // 排序
    sortPosts();

    // 分页
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * postsPerPage;
    const pagePosts = filteredPosts.slice(start, start + postsPerPage);

    if (pagePosts.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>暂无符合条件的文章</p></div>';
    } else {
      container.innerHTML = pagePosts.map(post => `
        <a href="${post.url}" class="post-card">
          <div class="post-meta">
            <span class="post-date">${formatDate(post.date)}</span>
            ${post.tags && post.tags.length > 0 ? `<span class="post-tags">${post.tags.slice(0, 2).join(' · ')}</span>` : ''}
          </div>
          <h2 class="post-title">${post.title}</h2>
          ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
        </a>
      `).join('');
    }

    renderPagination(totalPages);
  }

  // 排序
  function sortPosts() {
    switch (currentSort) {
      case 'date-desc':
        filteredPosts.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 'date-asc':
        filteredPosts.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case 'title-asc':
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
        break;
    }
  }

  // 渲染分页
  function renderPagination(totalPages) {
    const pag = document.getElementById('pagination');
    if (!pag || totalPages <= 1) {
      if (pag) pag.innerHTML = '';
      return;
    }

    let html = '';
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="window.__categoryGoToPage(1)">«</button>`;
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="window.__categoryGoToPage(${currentPage - 1})">‹</button>`;
    html += `<span class="page-info">${currentPage} / ${totalPages}</span>`;
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="window.__categoryGoToPage(${currentPage + 1})">›</button>`;
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="window.__categoryGoToPage(${totalPages})">»</button>`;
    pag.innerHTML = html;
  }

  // 翻页（挂到 window，供 onclick 调用）
  window.__categoryGoToPage = function(page) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 日期格式化
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  // 筛选
  function applyFilter(tag) {
    currentFilter = tag;
    currentPage = 1;
    if (tag === 'all') {
      filteredPosts = [...allPosts];
    } else {
      filteredPosts = allPosts.filter(p => p.tags && p.tags.includes(tag));
    }
    renderPosts();
  }

  // 初始化
  document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    // 筛选按钮事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.tag);
      });
    });

    // 排序事件
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        currentPage = 1;
        renderPosts();
      });
    }
  });
})();
</script>

<style>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { border-color: var(--inzu-gold); color: var(--inzu-gold); }
.filter-btn.active { background: var(--inzu-gold); color: var(--inzu-ink); border-color: var(--inzu-gold); }

.sort-select {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.post-card {
  display: block;
  padding: 1.25rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.25s;
}

.post-card:hover {
  border-color: var(--inzu-gold);
  transform: translateX(4px);
  box-shadow: -4px 0 0 var(--inzu-gold);
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
}

.post-tags {
  color: var(--inzu-gold);
}

.post-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.post-excerpt {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-3);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.pagination button {
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 2.5rem;
}

.pagination button:hover:not(:disabled) {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  padding: 0 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .toolbar { flex-direction: column; align-items: flex-start; }
  .filter-group { width: 100%; }
  .sort-select { width: 100%; }
}
</style>
