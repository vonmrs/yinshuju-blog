<template>
  <Layout>
    <template #layout-top>
      <ReadingProgress />
    </template>
    <template #nav-bar-content-after>
      <PagefindSearch />
      <GitHubIcon />
    </template>
    <template #nav-screen-content-after>
      <a href="#" @click.prevent="toggleSearch" class="mobile-search-btn">搜索</a>
    </template>

    <!-- 文章详情页面包屑：首页 / 栏目 / 当前标题 -->
    <template #doc-before>
      <nav v-if="isArticle" class="yzj-breadcrumb" aria-label="breadcrumb">
        <a href="/">首页</a>
        <span class="sep">/</span>
        <a :href="categoryUrl">{{ categoryLabel }}</a>
        <span class="sep">/</span>
        <span class="cur">{{ currentTitle }}</span>
      </nav>
    </template>

    <template #doc-after>
      <!-- 上一篇 / 下一篇（置于正文下方、评论上方） -->
      <div v-if="isArticle && pagerReady" class="yzj-pager">
        <a v-if="prevPost" class="yzj-prev" :href="prevPost.url">
          <span class="yzj-dir">← 上一篇</span>
          <span class="yzj-pt">{{ stripPrefix(prevPost.title) }}</span>
        </a>
        <span v-else class="yzj-prev yzj-disabled">
          <span class="yzj-dir">← 上一篇</span>
          <span class="yzj-pt">没有更早的了</span>
        </span>

        <a v-if="nextPost" class="yzj-next" :href="nextPost.url">
          <span class="yzj-dir">下一篇 →</span>
          <span class="yzj-pt">{{ stripPrefix(nextPost.title) }}</span>
        </a>
        <span v-else class="yzj-next yzj-disabled">
          <span class="yzj-dir">下一篇 →</span>
          <span class="yzj-pt">已是最新</span>
        </span>
      </div>

      <Giscus />
      <SocialShare />
      <RelatedArticles />
      <ViewCount />
    </template>

    <template #layout-bottom>
      <SiteFooter message="© 2026 银枢局 · Design · Code · Think" />
    </template>

    <!-- 文章列表页：右侧 aside 顶部渲染筛选/排序目录 -->
    <template #aside-top>
      <ListCatalog v-if="isPostsList" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute, useData } from 'vitepress'
import { ref, computed, onMounted } from 'vue'
import Giscus from './Giscus.vue'
import PagefindSearch from './PagefindSearch.vue'
import ReadingProgress from './ReadingProgress.vue'
import SocialShare from './SocialShare.vue'
import RelatedArticles from './RelatedArticles.vue'
import ViewCount from './ViewCount.vue'
import SiteFooter from './SiteFooter.vue'
import GitHubIcon from './GitHubIcon.vue'
import ListCatalog from './ListCatalog.vue'

const { Layout } = DefaultTheme
const route = useRoute()
const { frontmatter } = useData()

const showSearch = ref(false)
const postsMeta = ref<any[]>([])
const pagerReady = ref(false)

// 是否文章详情页（排除列表页 /posts/<cat>/）
const isArticle = computed(() =>
  /^\/posts\/(prism|zhaojian)\/[^/]+\/?$/.test(route.path)
)

// 仅文章列表页(/posts/)在右侧 aside 渲染筛选目录
const isPostsList = computed(() => route.path.replace(/\/+$/, '') === '/posts')

const category = computed(
  () => frontmatter.value.categories?.[0] || frontmatter.value.category
)
const categoryLabel = computed(() => (category.value === 'zhaojian' ? '朝鉴' : '棱镜'))
const categoryUrl = computed(() => `/posts/${category.value}/`)
const currentTitle = computed(() => stripPrefix(frontmatter.value.title || ''))

function stripPrefix(t: string) {
  return (t || '').replace(/^(棱镜|朝鉴)\s*[·｜|:|｜|-]\s*/, '')
}

const norm = (p: string) => (p || '').replace(/\/+$/, '') || '/'

const siblings = computed(() => {
  if (!category.value) return []
  return postsMeta.value
    .filter((p: any) => p.category === category.value)
    .sort((a: any, b: any) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)) // 升序：旧→新
})

const currentIndex = computed(() =>
  siblings.value.findIndex((p: any) => norm(route.path) === norm(p.url))
)

// 上一篇 = 更早（索引-1），下一篇 = 更新（索引+1）
const prevPost = computed(() =>
  currentIndex.value > 0 ? siblings.value[currentIndex.value - 1] : null
)
const nextPost = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < siblings.value.length - 1
    ? siblings.value[currentIndex.value + 1]
    : null
)

async function loadMeta() {
  try {
    const res = await fetch('/posts-meta.json?t=' + Date.now())
    if (!res.ok) throw new Error('HTTP ' + res.status)
    postsMeta.value = await res.json()
  } catch (e) {
    console.error('[yzj-pager] 加载 posts-meta 失败', e)
  } finally {
    pagerReady.value = true
  }
}

onMounted(loadMeta)

// 朝鉴文章列表页 → 直接跳转微信公众号合集
const WECHAT_ALBUM_REDIRECTS: Record<string, string> = {
  '/posts/zhaojian/':
    'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=BIZ_ID_PLACEHOLDER&scene=126#wechat_redirect',
}

function tryRedirect() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const dest = WECHAT_ALBUM_REDIRECTS[path]
  if (dest) window.location.replace(dest)
}

onMounted(tryRedirect)

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  const searchEl = document.getElementById('pagefind-search')
  if (searchEl) {
    searchEl.style.display = showSearch.value ? 'block' : 'none'
    if (showSearch.value) {
      searchEl.style.position = 'fixed'
      searchEl.style.top = '60px'
      searchEl.style.left = '10px'
      searchEl.style.right = '10px'
      searchEl.style.zIndex = '9999'
      searchEl.style.background = 'var(--vp-c-bg)'
      searchEl.style.padding = '1rem'
      searchEl.style.borderRadius = '8px'
      searchEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
    }
  }
}
</script>

<style>
/* 面包屑 */
.yzj-breadcrumb {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.yzj-breadcrumb a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}
.yzj-breadcrumb a:hover {
  color: var(--inzu-gold);
}
.yzj-breadcrumb .sep {
  color: var(--vp-c-divider);
}
.yzj-breadcrumb .cur {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

/* 上一篇 / 下一篇 */
.yzj-pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 1.5rem 0 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
}
.yzj-pager a,
.yzj-pager .yzj-disabled {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}
.yzj-pager a:hover {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}
.yzj-pager a:hover .yzj-dir {
  color: var(--inzu-gold);
}
.yzj-pager .yzj-next {
  text-align: right;
  align-items: flex-end;
}
.yzj-pager .yzj-dir {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}
.yzj-pager .yzj-pt {
  font-size: 0.92rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.yzj-pager .yzj-disabled {
  color: var(--vp-c-text-3);
  opacity: 0.6;
  cursor: default;
}

/* 调整搜索框在导航栏中的位置 */
@media (max-width: 768px) {
  .pagefind-search {
    display: none !important;
  }
  .mobile-search-btn {
    display: block;
    padding: 0.5rem 1rem;
    color: var(--vp-c-text-2);
    text-decoration: none;
    font-size: 0.9rem;
  }
  .mobile-search-btn:hover {
    color: var(--inzu-gold);
  }
  .yzj-pager {
    flex-direction: column;
  }
}

@media (min-width: 769px) {
  .mobile-search-btn {
    display: none;
  }
}
</style>
