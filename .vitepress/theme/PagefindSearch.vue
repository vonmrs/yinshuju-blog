<template>
  <div class="pagefind-search-wrapper">
    <input
      ref="inputRef"
      type="text"
      class="nav-search-input"
      placeholder="搜索..."
      @keydown.enter="doSearch"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)
let timer: ReturnType<typeof setTimeout>

function onInput() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const q = inputRef.value?.value.trim()
    if (q) {
      window.location.href = `/search/?q=${encodeURIComponent(q)}`
    }
  }, 600)
}

function doSearch() {
  const q = inputRef.value?.value.trim()
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
