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
  // 不蒜子已在 config.ts 中全局加载，这里只负责显示
  if (typeof window !== 'undefined') {
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
