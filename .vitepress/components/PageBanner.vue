<template>
  <div class="page-banner" :class="bannerId ? `banner-${bannerId}` : ''">
    <div class="banner-slides" :style="slidesStyle">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="banner-slide"
        :class="{ active: current === i }"
        :style="slideStyle(i)"
      >
        <a
          v-if="slide.link"
          :href="slide.link"
          class="banner-link"
          :target="slide.external ? '_blank' : '_self'"
          :rel="slide.external ? 'noopener noreferrer' : undefined"
          @click="handleClick(i, slide)"
        ></a>
        <div v-else class="banner-link" />
        <!-- 图片层 -->
        <div v-if="slide.image" class="banner-image-wrap">
          <img
            :src="slide.image"
            :alt="slide.title || ''"
            class="banner-image"
            loading="lazy"
          />
          <!-- 深色渐变遮罩 -->
          <div class="banner-overlay" />
        </div>
        <!-- 内容层 -->
        <div class="banner-body">
          <div v-if="slide.tag" class="banner-tag">{{ slide.tag }}</div>
          <h2 v-if="slide.title" class="banner-title">{{ slide.title }}</h2>
          <p v-if="slide.desc" class="banner-desc">{{ slide.desc }}</p>
          <a
            v-if="slide.cta && slide.link"
            :href="slide.link"
            class="banner-cta"
            :target="slide.external ? '_blank' : '_self'"
            :rel="slide.external ? 'noopener noreferrer' : undefined"
            @click="handleClick(i, slide)"
          >{{ slide.cta }}</a>
        </div>
      </div>
    </div>

    <!-- 指示器 -->
    <div v-if="slides.length > 1" class="banner-dots">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="banner-dot"
        :class="{ active: current === i }"
        @click="goTo(i)"
        :aria-label="`轮播图 ${i + 1}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export interface BannerSlide {
  image?: string
  tag?: string
  title?: string
  desc?: string
  cta?: string
  link?: string
  external?: boolean
}

const props = withDefaults(defineProps<{
  slides: BannerSlide[]
  interval?: number   // 自动轮播间隔(ms)，默认 4000
  bannerId?: string   // 可选：用于不同页的样式区分
}>(), {
  interval: 4000,
})

const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function goTo(i: number) {
  current.value = i
  resetTimer()
}

function resetTimer() {
  if (timer) clearInterval(timer)
  if (props.slides.length > 1) {
    timer = setInterval(() => {
      current.value = (current.value + 1) % props.slides.length
    }, props.interval)
  }
}

function handleClick(i: number, slide: BannerSlide) {
  if (slide.link) {
    resetTimer()
  }
}

const slidesStyle = computed(() => ({
  transform: `translateX(-${current.value * 100}%)`,
  transition: 'transform 0.4s ease',
  display: 'flex',
  width: `${props.slides.length * 100}%`,
}))

function slideStyle(i: number) {
  return {
    width: `${100 / props.slides.length}%`,
    flexShrink: '0',
  }
}

onMounted(resetTimer)
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.page-banner {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #0a0a0f;
  border-radius: 14px;
  margin-bottom: 1.5rem;
}

.banner-slides {
  display: flex;
  transition: transform 0.4s ease;
}

.banner-slide {
  position: relative;
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-image-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  min-height: 200px;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 15, 0.82) 0%,
    rgba(10, 10, 15, 0.55) 50%,
    rgba(10, 10, 15, 0.30) 100%
  );
}

.banner-body {
  position: relative;
  z-index: 1;
  padding: 2.5rem 3rem;
  max-width: 1100px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  text-align: left;
}

.banner-tag {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--inzu-gold, #f0c040);
  background: rgba(240, 192, 64, 0.12);
  border: 1px solid rgba(240, 192, 64, 0.3);
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  margin-bottom: 0.6rem;
  letter-spacing: 0.05em;
}

.banner-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.7rem;
  font-weight: 700;
  color: #f0ece2;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.banner-desc {
  font-size: 0.92rem;
  color: rgba(240, 236, 226, 0.75);
  margin: 0 0 1rem;
  line-height: 1.6;
  max-width: 600px;
}

.banner-cta {
  display: inline-block;
  padding: 0.55rem 1.4rem;
  background: var(--inzu-gold, #f0c040);
  color: #0a0a0f;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}

.banner-cta:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.banner-link {
  position: absolute;
  inset: 0;
  z-index: 2;
  cursor: pointer;
}

.banner-dots {
  position: absolute;
  bottom: 0.8rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.45rem;
  z-index: 3;
}

.banner-dot {
  width: 28px;
  height: 4px;
  border-radius: 2px;
  border: none;
  background: rgba(240, 236, 226, 0.35);
  cursor: pointer;
  transition: background 0.3s, width 0.3s;
  padding: 0;
}

.banner-dot.active {
  background: var(--inzu-gold, #f0c040);
  width: 40px;
}

:root:not(.dark) .page-banner {
  background: #f0ece2;
}

:root:not(.dark) .banner-title {
  color: #0a0a0f;
}

:root:not(.dark) .banner-desc {
  color: rgba(10, 10, 15, 0.7);
}

:root:not(.dark) .banner-overlay {
  background: linear-gradient(
    135deg,
    rgba(240, 236, 226, 0.88) 0%,
    rgba(240, 236, 226, 0.6) 50%,
    rgba(240, 236, 226, 0.25) 100%
  );
}

:root:not(.dark) .banner-dot {
  background: rgba(10, 10, 15, 0.3);
}

:root:not(.dark) .banner-dot.active {
  background: var(--inzu-gold, #c9a84c);
}

@media (max-width: 640px) {
  .banner-body {
    padding: 1.5rem 1.2rem;
  }
  .banner-title {
    font-size: 1.3rem;
  }
  .banner-desc {
    font-size: 0.85rem;
  }
}
</style>
