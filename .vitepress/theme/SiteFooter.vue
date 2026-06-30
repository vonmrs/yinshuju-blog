<template>
  <footer class="site-footer">
    <div class="footer-content">
      <p class="footer-copy">{{ message }}</p>
      <p class="footer-filing">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">鄂ICP备2026031641号-1</a>
        <span class="separator">|</span>
        <span class="gab-text">公安网备 建设中...</span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 24px 24px;
  text-align: center;
  background: var(--vp-c-bg-soft);
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-copy {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0 0 6px;
}

.footer-filing {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

.footer-filing a {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-filing a:hover {
  color: var(--inzu-gold);
}

.separator {
  margin: 0 8px;
  opacity: 0.5;
}

.gab-text {
  font-style: italic;
  opacity: 0.6;
}
</style>
