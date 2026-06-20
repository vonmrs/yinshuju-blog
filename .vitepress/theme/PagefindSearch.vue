<template>
  <div class="pagefind-search-wrapper">
    <input
      v-model="query"
      type="text"
      class="nav-search-input"
      placeholder="搜索..."
      @keydown.enter="doSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')

function doSearch() {
  const q = query.value.trim()
  if (q) {
    window.location.href = `/search/?q=${encodeURIComponent(q)}`
  }
}
</script>

<style scoped>
.pagefind-search-wrapper {
  display: flex;
  align-items: center;
}

.nav-search-input {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  width: 160px;
  outline: none;
  transition: all 0.2s;
}

.nav-search-input::placeholder {
  color: var(--vp-c-text-3);
}

.nav-search-input:focus {
  border-color: var(--inzu-gold);
  width: 220px;
}

@media (max-width: 768px) {
  .pagefind-search-wrapper {
    display: none;
  }
}
</style>
