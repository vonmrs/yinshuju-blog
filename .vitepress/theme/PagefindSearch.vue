<template>
  <div id="pagefind-search" class="pagefind-search"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window !== 'undefined') {
    // 动态加载 Pagefind UI
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = () => {
      const PagefindUI = (window as any).PagefindUI
      if (PagefindUI) {
        new PagefindUI({
          element: '#pagefind-search',
          showImages: false,
          showSubResults: true,
          translations: {
            placeholder: '搜索文章...',
            zero_results: '没有找到 [SEARCH_TERM] 相关内容',
            many_results: '找到 [COUNT] 个结果',
            one_result: '找到 1 个结果',
            alt_search: '查看 [SEARCH_TERM] 的结果',
            search_suggestion: '搜索 [SEARCH_TERM]',
            searching: '正在搜索 [SEARCH_TERM]...'
          }
        })
      }
    }
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/pagefind/pagefind-ui.css'
    document.head.appendChild(link)
  }
})
</script>

<style>
.pagefind-search {
  min-width: 180px;
  max-width: 280px;
}

@media (max-width: 768px) {
  .pagefind-search {
    max-width: 100%;
  }
}
</style>
