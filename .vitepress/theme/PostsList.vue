<template>
  <div id="article-list-app" class="list-main">
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePostsData } from './usePostsData'

const {
  loading,
  pagePosts,
  currentPage,
  totalPages,
  goToPage,
  formatDate,
  loadPosts,
} = usePostsData()

onMounted(loadPosts)
</script>

<style scoped>
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

:root:not(.dark) .article-card {
  background: var(--vp-c-bg-elv);
}

:root:not(.dark) .article-title {
  color: var(--inzu-ink);
}
</style>
