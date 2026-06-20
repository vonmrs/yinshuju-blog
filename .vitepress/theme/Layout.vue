<template>
  <Layout>
    <template #nav-bar-content-after>
      <PagefindSearch />
    </template>
    <template #nav-screen-content-after>
      <a href="#" @click.prevent="toggleSearch" class="mobile-search-btn">搜索</a>
    </template>
    <template #doc-after>
      <Giscus />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Giscus from './Giscus.vue'
import PagefindSearch from './PagefindSearch.vue'
import { ref } from 'vue'

const { Layout } = DefaultTheme

const showSearch = ref(false)

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    // 显示搜索框
    const searchEl = document.getElementById('pagefind-search')
    if (searchEl) {
      searchEl.style.display = 'block'
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
  } else {
    const searchEl = document.getElementById('pagefind-search')
    if (searchEl) {
      searchEl.style.display = 'none'
    }
  }
}
</script>

<style>
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
}

@media (min-width: 769px) {
  .mobile-search-btn {
    display: none;
  }
}
</style>
