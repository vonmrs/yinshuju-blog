<template>
  <div class="view-count" v-if="show">
    <span class="count-icon">👁️</span>
    <span class="count-label">阅读量：</span>
    <span class="busuanzi_container_page_pv">
      <span class="busuanzi_value_page_pv">-</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const show = ref(false)

onMounted(() => {
  // 加载不蒜子脚本
  if (typeof window !== 'undefined' && !(window as any)._busuanzi) {
    const script = document.createElement('script')
    script.src = 'https://busuanzi.ibruce.info/js'
    script.async = true
    script.onload = () => {
      show.value = true
    }
    document.head.appendChild(script)
  } else {
    show.value = true
  }
})
</script>

<style scoped>
.view-count {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  padding: 0.3rem 0.8rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.count-icon {
  font-size: 0.9rem;
}

.count-label {
  font-weight: 500;
}
</style>
