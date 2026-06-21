<template>
  <div id="search-page">
    <div class="search-bar-container">
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="输入关键词搜索..."
        autofocus
        @input="handleInput"
      />
    </div>
    <div class="search-results">
      <p v-if="!query && !loading" class="search-hint">输入关键词后自动搜索</p>
      <p v-if="loading" class="search-hint">搜索中...</p>
      <div v-if="query && !loading && results.length === 0" class="search-empty">
        <p>没有找到「{{ query }}」相关内容</p>
        <p class="search-tip">试试不同的关键词</p>
      </div>
      <template v-if="results.length > 0">
        <div class="search-meta">找到 {{ results.length }} 个结果</div>
        <a
          v-for="item in results"
          :key="item.url"
          :href="item.url"
          class="search-result-item"
        >
          <div class="result-title">{{ item.meta.title }}</div>
          <div class="result-excerpt" v-html="item.excerpt"></div>
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
let pagefind: any = null

async function initSearch() {
  try {
    pagefind = await import('/pagefind/pagefind.js')
  } catch (e) {
    console.error('Pagefind 加载失败:', e)
  }
}

let timer: any = null

function handleInput() {
  clearTimeout(timer)
  timer = setTimeout(() => doSearch(query.value.trim()), 300)
}

async function doSearch(q: string) {
  if (!q) {
    results.value = []
    loading.value = false
    return
  }

  loading.value = true
  results.value = []

  try {
    if (!pagefind) {
      await initSearch()
    }
    if (!pagefind) {
      loading.value = false
      return
    }

    const searchResults = await pagefind.search(q)
    const items = await Promise.all(
      searchResults.results.slice(0, 20).map((r: any) => r.data())
    )
    results.value = items
  } catch (e) {
    console.error('搜索失败:', e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await initSearch()

  // 从 URL 参数获取初始查询
  const urlParams = new URLSearchParams(window.location.search)
  const q = urlParams.get('q')
  if (q) {
    query.value = q
    await doSearch(q)
  }
})
</script>

<style scoped>
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

.result-excerpt :deep(mark) {
  background: rgba(201, 168, 76, 0.3);
  color: var(--vp-c-text-1);
  padding: 0 0.1rem;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .search-input { font-size: 0.9rem; }
}
</style>
