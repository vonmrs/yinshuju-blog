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

    <template #doc-before>
      <!-- Banner：自判断路由，在 /posts/、/tools/、/posts/zhaojian/ 显示 -->
      <BannerWrapper />
      <!-- 文章详情页面包屑 -->
      <nav v-if="isArticle" class="yzj-breadcrumb" aria-label="breadcrumb">
        <a href="/">首页</a>
        <span class="sep">/</span>
        <a :href="categoryUrl">{{ categoryLabel }}</a>
        <span class="sep">/</span>
        <span class="cur">{{ currentTitle }}</span>
      </nav>
    </template>

    <template #doc-after>
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
import BannerWrapper from '../components/BannerWrapper.vue'

const Layout = DefaultTheme.Layout
const route = useRoute()
const { frontmatter } = useData()

const isArticle = computed(() =>
  /^\/posts\/(prism|zhaojian)\/[^/]+\/?$/.test(route.path)
)

const category = computed(
  () => (frontmatter.value as any)?.categories?.[0] || (frontmatter.value as any)?.category
)
const categoryLabel = computed(() => (category.value === 'zhaojian' ? '朝鉴' : '棱镜'))
const categoryUrl = computed(() => `/posts/${category.value}/`)
const currentTitle = computed(() => stripPrefix((frontmatter.value as any)?.title || ''))

function stripPrefix(t: string) {
  return (t || '').replace(/^(棱镜|朝鉴)\s*[·｜|:|｜|-]\s*/, '')
}

const norm = (p: string) => (p || '').replace(/\/+$/, '') || '/'

const siblings = computed(() => {
  if (!category.value) return []
  return postsMeta.value
    .filter((p: any) => p.category === category.value)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const currentIdx = computed(() =>
  siblings.value.findIndex((p: any) => norm(p.url) === norm(route.path))
)

const prevPost = computed(() => {
  const i = currentIdx.value
  return i >= 0 && i < siblings.value.length - 1 ? siblings.value[i + 1] : null
})

const nextPost = computed(() => {
  const i = currentIdx.value
  return i > 0 ? siblings.value[i - 1] : null
})

const postsMeta = ref<any[]>([])
const pagerReady = computed(() => postsMeta.value.length > 0)

onMounted(async () => {
  try {
    const res = await fetch('/posts-meta.json')
    if (res.ok) postsMeta.value = await res.json()
  } catch { /* 静默 */ }
})

const showSearch = ref(false)
function toggleSearch() {
  showSearch.value = !showSearch.value
}
</script>
