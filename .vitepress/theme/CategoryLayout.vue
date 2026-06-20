<template>
  <div class="category-layout">
    <!-- 分类头部 -->
    <header class="category-header">
      <h1 class="category-title">
        <span class="category-icon">{{ categoryIcon }}</span>
        <span>{{ categoryName }}</span>
      </h1>
      <p class="category-desc">{{ categoryDesc }}</p>
    </header>

    <!-- 筛选 & 排序工具栏 -->
    <div class="toolbar">
      <div class="filter-group">
        <button 
          v-for="tag in allTags" 
          :key="tag"
          :class="['filter-btn', { active: currentFilter === tag }]"
          @click="currentFilter = tag"
        >
          {{ tag }}
        </button>
      </div>
      <div class="sort-group">
        <select v-model="currentSort" class="sort-select">
          <option value="date-desc">最新</option>
          <option value="date-asc">最早</option>
          <option value="title-asc">标题 A-Z</option>
          <option value="title-desc">标题 Z-A</option>
        </select>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="posts-container">
      <div v-if="filteredPosts.length === 0" class="empty-state">
        <p>暂无符合条件的文章</p>
      </div>
      <a 
        v-for="post in paginatedPosts"
        :key="post.url"
        :href="post.url"
        class="post-card"
      >
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.date) }}</span>
          <span class="post-tags">{{ post.tags?.slice(0, 2).join(', ') }}</span>
        </div>
        <h2 class="post-title">{{ post.title }}</h2>
        <p class="post-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
      </a>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        :disabled="currentPage === 1"
        @click="currentPage = 1"
        class="page-btn"
      >
        «
      </button>
      <button 
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="page-btn"
      >
        ‹
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="page-btn"
      >
        ›
      </button>
      <button 
        :disabled="currentPage === totalPages"
        @click="currentPage = totalPages"
        class="page-btn"
      >
        »
      </button>
    </div>

    <!-- 底部导流 -->
    <div class="subscribe-cta">
      <h3>📱 订阅{{ categoryName }}</h3>
      <p>干货文章，第一时间送达。</p>
      <div class="qrcode-row">
        <img src="/wechat-qrcode.jpg" alt="银枢局公众号" class="cta-qr" />
        <div class="cta-text">
          <p>微信搜索「银枢局」</p>
          <p>回复「订阅」加入推送</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Post {
  title: string
  date: string
  url: string
  tags?: string[]
  category?: string
  excerpt?: string
}

const props = defineProps<{
  categoryName: string
  categoryIcon: string
  categoryDesc: string
}>()

const currentFilter = ref<string>('全部')
const currentSort = ref<string>('date-desc')
const currentPage = ref<number>(1)
const postsPerPage = 10

// 从 posts-meta.json 加载文章
const allPosts = ref<Post[]>([])
const allTags = ref<string[]>(['全部'])

onMounted(async () => {
  try {
    const res = await fetch('/posts-meta.json')
    const meta: Post[] = await res.json()
    
    // 过滤出当前分类的文章
    const categoryPosts = meta.filter(p => 
      p.category === (props.categoryName === '棱镜' ? 'prism' : 'zhaojian')
    )
    
    allPosts.value = categoryPosts
    
    // 提取所有标签
    const tags = new Set<string>()
    categoryPosts.forEach(p => {
      p.tags?.forEach(t => tags.add(t))
    })
    allTags.value = ['全部', ...Array.from(tags)]
  } catch (err) {
    console.warn('Failed to load posts-meta.json:', err)
  }
})

// 筛选后的文章
const filteredPosts = computed(() => {
  let posts = allPosts.value
  
  // 按标签筛选
  if (currentFilter.value !== '全部') {
    posts = posts.filter(p => p.tags?.includes(currentFilter.value))
  }
  
  // 排序
  switch (currentSort.value) {
    case 'date-desc':
      posts.sort((a, b) => b.date.localeCompare(a.date))
      break
    case 'date-asc':
      posts.sort((a, b) => a.date.localeCompare(b.date))
      break
    case 'title-asc':
      posts.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
      break
    case 'title-desc':
      posts.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'))
      break
  }
  
  return posts
})

// 分页
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return filteredPosts.value.slice(start, start + postsPerPage)
})

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style scoped>
.category-layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.category-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.category-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 1.8rem;
}

.category-desc {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.filter-btn:hover {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}

.filter-btn.active {
  background: var(--inzu-gold);
  color: var(--inzu-ink);
  border-color: var(--inzu-gold);
}

.sort-select {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
}

/* 文章列表 */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-3);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.page-btn {
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 2.5rem;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  padding: 0 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

/* 底部导流 */
.subscribe-cta {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-align: center;
}

.subscribe-cta h3 {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.subscribe-cta > p {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.qrcode-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.cta-qr {
  width: 100px;
  border-radius: 8px;
}

.cta-text p {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0.3rem 0;
  text-align: left;
}

/* 响应式 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
    
  .sort-select {
    width: 100%;
  }
}
</style>
