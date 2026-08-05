import { ref, computed } from 'vue'

// 恢复朝鉴新闻列表显示
const HIDE_ZHAOJIAN = false

// 模块级单例：文章列表页(PostsList 网格 + 顶部工具条) 共享同一份状态
const allPosts = ref<any[]>([])
const filteredPosts = ref<any[]>([])
const currentPage = ref(1)
const postsPerPage = 15
const currentFilter = ref('all')
const currentSort = ref('date-desc')
const loading = ref(true)

const filters = computed(() => {
  const list: any[] = [
    { key: 'all', label: '全部', count: allPosts.value.length },
    { key: 'prism', label: '📐 棱镜', count: allPosts.value.filter(p => p.category === 'prism').length },
  ]
  // 朝鉴以链接形式指向公众号二维码落地页(文章已移至微信)
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
    if (HIDE_ZHAOJIAN) {
      allPosts.value = allPosts.value.filter(p => p.category !== 'zhaojian')
    }
    filteredPosts.value = [...allPosts.value]
    loading.value = false
  } catch (e) {
    loading.value = false
    console.error('[posts] 加载文章失败:', e)
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

export function usePostsData() {
  return {
    allPosts,
    filteredPosts,
    currentPage,
    currentFilter,
    currentSort,
    loading,
    filters,
    totalPages,
    pagePosts,
    loadPosts,
    applyFilter,
    renderPosts,
    goToPage,
    formatDate,
  }
}
