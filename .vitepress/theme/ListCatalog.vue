<template>
  <aside class="list-catalog">
    <h2 class="catalog-title">📝 全部文章</h2>
    <div class="filter-group catalog-filters">
      <template v-for="filter in filters" :key="filter.key">
        <a
          v-if="filter.link"
          :href="filter.link"
          class="filter-btn filter-link"
          target="_blank"
          rel="noopener"
        >{{ filter.label }}</a>
        <button
          v-else
          class="filter-btn"
          :class="{ active: currentFilter === filter.key }"
          @click="applyFilter(filter.key)"
        >
          {{ filter.label }} ({{ filter.count }})
        </button>
      </template>
    </div>
    <div class="sort-group catalog-sort">
      <label class="sort-label">排序</label>
      <select v-model="currentSort" class="sort-select" @change="currentPage = 1; renderPosts()">
        <option value="date-desc">最新</option>
        <option value="date-asc">最早</option>
        <option value="title-asc">标题 A-Z</option>
      </select>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { usePostsData } from './usePostsData'

const {
  filters,
  currentFilter,
  currentSort,
  applyFilter,
  renderPosts,
  currentPage,
} = usePostsData()
</script>

<style scoped>
.list-catalog {
  position: sticky;
  top: calc(var(--vp-nav-height, 60px) + 16px);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
}

.catalog-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem;
}

.catalog-filters {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}

.catalog-filters .filter-btn {
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.catalog-sort {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

.catalog-sort .sort-select {
  width: 100%;
}

.filter-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}

.sort-select {
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.filter-link {
  text-decoration: none;
}

:root:not(.dark) .list-catalog {
  background: var(--vp-c-bg-elv);
}
</style>
