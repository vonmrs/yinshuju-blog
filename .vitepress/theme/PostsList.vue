<template>
  <div id="article-list-app" class="list-layout">
    <!-- 主栏：文章列表 -->
    <div class="list-main">
      <div class="articles-container">
        <template v-if="loading">
          <p>加载中...</p>
        </template>
        <template v-else-if="pagePosts.length === 0">
          <div class="empty-state"><p>暂无符合条件的文章</p></div>
        </template>
        <template v-else>
          <a
            v-for="post in pagePosts"
            :key="post.url"
            :href="post.url"
            class="article-card"
          >
            <div class="article-meta">
              <span class="article-badge" :class="post.category === 'prism' ? 'badge-prism' : 'badge-zhaojian'">
                {{ post.category === 'prism' ? '棱镜' : '朝鉴' }}
              </span>
              <span class="article-date">{{ formatDate(post.date) }}</span>
            </div>
            <div class="article-title">{{ post.title }}</div>
            <div class="article-excerpt">{{ post.excerpt ? post.excerpt.substring(0, 100) + '...' : '' }}</div>
          </a>
        </template>
      </div>

      <!-- 分页 -->
      <div class="pagination-app">
        <button :disabled="currentPage <= 1" @click="goToPage(1)">«</button>
        <button :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">‹</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">›</button>
        <button :disabled="currentPage >= totalPages" @click="goToPage(totalPages)">»</button>
      </div>
    </div>

    <!-- 右侧目录：筛选 + 排序 -->
    <aside class="list-catalog">
      <h2 class="catalog-title">📝 全部文章</h2>
      <div class="filter-group catalog-filters">
        <template v-for="filter in filters" :key="filter.key">
          <a
            v-if="filter.link"
            :href="filter.link"
            class="filter-btn filter-link"
            target="_blank"
            rel="noopener"
          >{{ filter.label }}</a>
          <button
            v-else
            class="filter-btn"
            :class="{ active: currentFilter === filter.key }"
            @click="applyFilter(filter.key)"
          >
            {{ filter.label }} ({{ filter.count }})
          </button>
        </template>
      </div>
      <div class="sort-group catalog-sort">
        <label class="sort-label">排序</label>
        <select v-model="currentSort" class="sort-select" @change="currentPage = 1; renderPosts()">
          <option value="date-desc">最新</option>
          <option value="date-asc">最早</option>
          <option value="title-asc">标题 A-Z</option>
        </select>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 恢复朝鉴新闻列表显示
const HIDE_ZHAOJIAN = false
const allPosts = ref<any[]>([])
const filteredPosts = ref<any[]>([])
const currentPage = ref(1)
const postsPerPage = 15
const currentFilter = ref('all')
const currentSort = ref('date-desc')
const loading = ref(true)

const filters = computed(() => {
  const list = [
    { key: 'all', label: '全部', count: allPosts.value.length },
    { key: 'prism', label: '📐 棱镜', count: allPosts.value.filter(p => p.category === 'prism').length },
  ]
  // [朝鉴] 以链接形式指向公众号二维码落地页(文章已移至微信)
  if (!HIDE_ZHAOJIAN) {
    list.push({ key: 'zhaojian', label: '🔭 朝鉴', link: '/posts/zhaojian/' })
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

const pagePosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return filteredPosts.value.slice(start, start + postsPerPage)
})

async function loadPosts() {
  try {
    const res = await fetch('/posts-meta.json?t=' + Date.now())
    if (!res.ok) throw new Error('HTTP ' + res.status)
    allPosts.value = await res.json()
    // [备案隐藏] 过滤掉朝鉴文章
    if (HIDE_ZHAOJIAN) {
      allPosts.value = allPosts.value.filter(p => p.category !== 'zhaojian')
    }
    filteredPosts.value = [...allPosts.value]
    loading.value = false
  } catch (e: any) {
    loading.value = false
    console.error('[posts-index] 加载文章失败:', e)
  }
}

function sortPosts() {
  switch (currentSort.value) {
    case 'date-desc':
      filteredPosts.value.sort((a, b) => b.date.localeCompare(a.date))
      break
    case 'date-asc':
      filteredPosts.value.sort((a, b) => a.date.localeCompare(b.date))
      break
    case 'title-asc':
      filteredPosts.value.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
      break
  }
}

function renderPosts() {
  sortPosts()
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value || 1
}

function applyFilter(tag: string) {
  currentFilter.value = tag
  currentPage.value = 1
  if (tag === 'all') {
    filteredPosts.value = [...allPosts.value]
  } else {
    filteredPosts.value = allPosts.value.filter(p => p.category === tag)
  }
  renderPosts()
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function formatDate(d: string) {
  const date = new Date(d)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.list-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 248px;
  gap: 2rem;
  align-items: start;
}

.list-main {
  min-width: 0;
}

/* 右侧目录（筛选 + 排序） */
.list-catalog {
  position: sticky;
  top: calc(var(--vp-nav-height, 60px) + 16px);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
}
.catalog-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem;
}
.catalog-filters {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}
.catalog-filters .filter-btn {
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.catalog-sort {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.sort-label {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}
.catalog-sort .sort-select {
  width: 100%;
}

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

.pagination-app {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
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

.page-info {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  padding: 0 0.5rem;
}

.filter-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}

.sort-select {
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.filter-link {
  text-decoration: none;
}

:root:not(.dark) .article-card {
  background: var(--vp-c-bg-elv);
}

:root:not(.dark) .article-title {
  color: var(--inzu-ink);
}

@media (max-width: 960px) {
  .list-layout {
    grid-template-columns: 1fr;
  }
  .list-catalog {
    position: static;
    order: -1;
  }
}
</style>
