<template>
  <div class="reading-progress">
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <Transition name="fade">
      <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
        ↑
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const showBackToTop = ref(false)

function updateProgress() {
  const article = document.querySelector('.VPContentDoc')
  if (!article) return
  
  const scrollTop = window.scrollY
  const docHeight = article.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  
  progress.value = Math.min(100, Math.max(0, progress))
  showBackToTop.value = scrollTop > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9998;
  pointer-events: none;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--inzu-gold), var(--inzu-jade));
  transition: width 0.1s ease-out;
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  z-index: 9999;
}

.back-to-top:hover {
  background: var(--inzu-gold);
  color: var(--inzu-ink);
  border-color: var(--inzu-gold);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
