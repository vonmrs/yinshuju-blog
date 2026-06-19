<template>
  <div class="giscus-container">
    <div
      class="giscus"
      :data-repo="'vonmrs/blog-comments'"
      :data-repo-id="repoId"
      :data-category="category"
      :data-category-id="categoryId"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="dark_tritanopia"
      data-lang="zh-CN"
      data-loading="lazy"
      crossorigin="anonymous"
    />
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { watch, onMounted } from 'vue'

const repoId = 'R_kgDOS_IxtQ'
const category = 'Announcements'
const categoryId = 'DIC_kwDOS_Ixtc4C_dvl'

const { isDark } = useData()

function loadGiscus() {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'vonmrs/blog-comments')
    script.setAttribute('data-repo-id', 'R_kgDOS_IxtQ')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDOS_Ixtc4C_dvl')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', isDark.value ? 'dark_tritanopia' : 'light_tritanopia')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('data-loading', 'lazy')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    const container = document.querySelector('.giscus-container')
    if (container) {
      container.innerHTML = ''
      container.appendChild(script)
    }
  }
}

onMounted(() => {
  loadGiscus()
})

watch(isDark, () => {
  // 切换主题时更新 Giscus 主题
  const iframe = document.querySelector('iframe.giscus-frame')
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: isDark.value ? 'dark_tritanopia' : 'light_tritanopia' } } },
      'https://giscus.app'
    )
  }
})
</script>

<style>
.giscus-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
