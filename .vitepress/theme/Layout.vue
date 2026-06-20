<template>
  <Layout>
    <template #nav-bar-content-after>
      <PagefindSearch />
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

const { Layout } = DefaultTheme
</script>

<style>
/* 调整搜索框在导航栏中的位置 */
@media (max-width: 768px) {
  .pagefind-search {
    display: none !important;
  }
}
</style>
