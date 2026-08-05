---
layout: home

hero:
  name: 银枢局
  text: Design · Code · Think
  tagline: 全栈技术 · 产品思维 · AI工具 · 职场成长
  actions:
    - theme: brand
      text: 浏览文章
      link: /posts/
    - theme: alt
      text: AI工具集
      link: /tools/

features:
  - icon: 📐
    title: 棱镜 · 技术
    details: 前端架构、后端设计、AI 工程化。透过代码看本质。
    link: /posts/
    linkText: 阅读技术文章
  - icon: 🔭
    title: 朝鉴 · 趋势洞察
    details: 新闻背后的经济信号与机会窗口。每天一条，看懂趋势。
    link: /posts/
    linkText: 前往公众号
  - icon: 🛠️
    title: AI 工具集
    details: 银枢局出品的免费在线工具，让 AI 成为你的生产力杠杆。
    link: /tools/
    linkText: 使用工具
---

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const totalSlides = 2
let interval = null

function goTo(idx) {
  currentSlide.value = idx
}

function startAutoPlay() {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides
  }, 5000)
}

onMounted(() => { startAutoPlay() })
onUnmounted(() => { clearInterval(interval) })
</script>

## ✦ 精选工具

<div class="featured-tools">

<div class="tool-carousel">
  <!-- Slide 1: 剧能AI -->
  <div class="carousel-slide" :class="{ 'carousel-slide-active': currentSlide === 0 }">
    <div class="slide-inner">
      <div class="slide-text">
        <div class="slide-tag">🎬 AI 内容创作</div>
        <h2 class="slide-title">剧能AI</h2>
        <p class="slide-desc">输入题材与设定，AI 自动生成完整短剧剧本——人物小传、分集大纲、逐集正文，含悬念钩子，直达付费解锁点。</p>
        <div class="slide-meta">
          <span>📖 6种题材</span>
          <span>⚡ 3秒生成</span>
          <span>🎯 悬念钩子</span>
        </div>
        <a href="/tools/duanju/" class="slide-cta">立即体验 →</a>
      </div>
      <div class="slide-visual">
        <div class="preview-card">
          <div class="preview-label">📖 剧本预览</div>
          <div class="preview-snippet">
            <div class="snippet-ep">第1集：面试</div>
            <div class="snippet-text">苏晚推开会议室的门，迎面撞上一道冰冷的目光。陆景琛坐在长桌尽头，西装笔挺，手指轻叩桌面...</div>
            <div class="snippet-hook">🎣 悬念：陆景琛的眼神里，闪过一丝不易察觉的……欣赏？</div>
          </div>
          <div class="preview-meta">
            <span class="tag-b">霸总</span>
            <span class="tag-s">爽文风格</span>
            <span class="tag-e">20集</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Slide 2: MD转Word -->
  <div class="carousel-slide" :class="{ 'carousel-slide-active': currentSlide === 1 }">
    <div class="slide-inner">
      <div class="slide-text">
        <div class="slide-tag">🔧 开发工具</div>
        <h2 class="slide-title">MD 转 Word</h2>
        <p class="slide-desc">Markdown 一键转 Word 文档，完整保留标题层级、表格、代码块、列表格式，无需手动调整格式。</p>
        <div class="slide-meta">
          <span>📊 表格支持</span>
          <span>💻 代码高亮</span>
          <span>🔄 无损转换</span>
        </div>
        <a href="/tools/md2word/" class="slide-cta">立即使用 →</a>
      </div>
      <div class="slide-visual">
        <div class="preview-card">
          <div class="preview-label">📄 转换预览</div>
          <div class="preview-snippet">
            <div class="snippet-code"># 一级标题</div>
            <div class="snippet-code snippet-code-dim">## 二级标题</div>
            <div class="snippet-table">| 列1 | 列2 | 列3 |<br>|---|---|---|<br>| 内容 | 内容 | 内容 |</div>
            <div class="snippet-code snippet-code-dim">```js<br>console.log('Hello')```</div>
          </div>
          <div class="preview-meta">
            <span class="tag-b">在线使用</span>
            <span class="tag-e">免费</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 指示器 -->
<div class="carousel-dots">
  <button
    v-for="i in totalSlides"
    :key="i"
    class="dot"
    :class="{ 'dot-active': currentSlide === i - 1 }"
    @click="currentSlide = i - 1; clearInterval(interval); startAutoPlay()"
    :aria-label="'工具 ' + i"
  ></button>
</div>

</div>

---

## 🔔 订阅银枢局

不想错过每日高质量内容？

关注微信公众号「**银枢局**」，回复「订阅」加入每日推送，文章第一时间送达。

> 📱 微信内搜索：银枢局，或扫描下方二维码

---

## 📖 最新文章

<div class="posts-grid">
  <a href="/posts/" class="post-card">
    <span class="post-category">专栏</span>
    <h3>查看全部文章 →</h3>
    <p>棱镜 · 朝鉴 · 持续更新</p>
  </a>
</div>

<style>
/* ── 精选工具轮播 ── */
.featured-tools {
  margin: 3rem 0;
  position: relative;
}

.tool-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: var(--c-cr-bg);
  border: 1px solid var(--vp-c-divider);
  min-height: 380px;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.carousel-slide.carousel-slide-active {
  opacity: 1;
  pointer-events: auto;
  position: relative;
}

.slide-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2.5rem;
  align-items: center;
  min-height: 380px;
}

@media (max-width: 640px) {
  .slide-inner {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  .slide-visual { display: none; }
}

.slide-tag {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--inzu-gold);
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.slide-title {
  font-family: 'Noto Serif SC', serif !important;
  font-size: clamp(1.6rem, 3vw, 2.4rem) !important;
  font-weight: 900;
  color: var(--c-cr-title) !important;
  margin: 0 0 0.8rem !important;
  line-height: 1.15 !important;
  border: none !important;
}

.slide-desc {
  font-size: 0.9rem;
  color: var(--c-cr-desc);
  line-height: 1.75;
  margin-bottom: 1.2rem;
  max-width: 480px;
}

.slide-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.slide-meta span {
  font-size: 0.78rem;
  color: var(--c-cr-meta-text);
  padding: 0.2rem 0.6rem;
  background: var(--c-cr-meta-bg);
  border-radius: 4px;
  border: 1px solid var(--c-cr-meta-border);
}

.slide-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  background: var(--inzu-gold);
  color: var(--inzu-ink);
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s;
  border: 1px solid var(--inzu-gold);
}

.slide-cta:hover {
  background: var(--c-cr-cta-hover-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.3);
  color: var(--inzu-ink);
  border-color: var(--c-cr-cta-hover-border);
}

/* ── 右侧预览卡 ── */
.slide-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-card {
  background: var(--c-cr-preview-bg);
  border: 1px solid var(--c-cr-preview-border);
  border-radius: 14px;
  padding: 1.5rem;
  width: 100%;
  max-width: 340px;
  backdrop-filter: blur(8px);
}

.preview-label {
  font-size: 0.75rem;
  color: var(--c-cr-preview-label);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.preview-snippet {
  font-size: 0.82rem;
  line-height: 1.8;
  color: var(--c-cr-snippet);
}

.snippet-ep {
  font-family: 'Noto Serif SC', serif;
  color: var(--c-cr-ep);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.snippet-text {
  margin-bottom: 0.8rem;
  white-space: pre-wrap;
}

.snippet-hook {
  display: inline-block;
  padding: 4px 10px;
  background: var(--c-cr-hook-bg);
  border-left: 2px solid var(--c-cr-hook-border);
  font-size: 0.78rem;
  color: var(--c-cr-hook-text);
}

.snippet-code {
  font-family: 'JetBrains Mono', monospace;
  color: var(--c-cr-code);
  font-size: 0.82rem;
  margin-bottom: 0.3rem;
}

.snippet-code-dim {
  color: var(--c-cr-code-dim);
  font-size: 0.75rem;
}

.snippet-table {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--c-cr-table);
  background: var(--c-cr-table-bg);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  margin: 0.4rem 0;
  overflow: hidden;
}

.preview-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.tag-b {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background: var(--c-cr-tag-b-bg);
  color: var(--c-cr-tag-b);
  border-radius: 4px;
}

.tag-s {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background: var(--c-cr-tag-s-bg);
  color: var(--c-cr-tag-s);
  border-radius: 4px;
}

.tag-e {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background: var(--c-cr-tag-e-bg);
  color: var(--c-cr-tag-e);
  border-radius: 4px;
}

/* ── 轮播指示器 ── */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--c-cr-dot);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.dot.dot-active {
  background: var(--c-cr-dot-active);
  width: 24px;
  border-radius: 4px;
}

.dot:hover {
  background: var(--inzu-silver-500);
}
</style>

<style vars-provider>
/* ── 暗色模式变量（默认） ── */
:root {
  --c-cr-bg: var(--inzu-parchment-dark);
  --c-cr-title: var(--inzu-silver-100);
  --c-cr-desc: var(--inzu-silver-500);
  --c-cr-meta-bg: var(--inzu-parchment-mid);
  --c-cr-meta-text: var(--inzu-silver-500);
  --c-cr-meta-border: var(--vp-c-divider);
  --c-cr-preview-bg: rgba(0,0,0,0.5);
  --c-cr-preview-border: rgba(255,255,255,0.07);
  --c-cr-preview-label: #c9a020;
  --c-cr-snippet: rgba(240,236,226,0.6);
  --c-cr-ep: #f0c040;
  --c-cr-hook-bg: rgba(240,192,64,0.08);
  --c-cr-hook-border: #f0c040;
  --c-cr-hook-text: #c9a020;
  --c-cr-code: #f0ece2;
  --c-cr-code-dim: rgba(240,236,226,0.4);
  --c-cr-table: rgba(240,236,226,0.5);
  --c-cr-table-bg: rgba(255,255,255,0.03);
  --c-cr-tag-b-bg: rgba(240,192,64,0.12);
  --c-cr-tag-b: #c9a020;
  --c-cr-tag-s-bg: rgba(90,141,163,0.15);
  --c-cr-tag-s: var(--inzu-jade);
  --c-cr-tag-e-bg: rgba(76,175,80,0.12);
  --c-cr-tag-e: #4caf50;
  --c-cr-dot: rgba(255,255,255,0.18);
  --c-cr-dot-active: var(--inzu-gold);
  --c-cr-cta-hover-bg: #d4b357;
  --c-cr-cta-hover-border: #d4b357;
}

/* ── 亮色模式变量覆盖 ── */
:root:not(.dark) {
  --c-cr-bg: rgba(240, 236, 226, 0.6);
  --c-cr-title: #1a1a1a;
  --c-cr-desc: rgba(0, 0, 0, 0.6);
  --c-cr-meta-bg: rgba(201, 168, 76, 0.1);
  --c-cr-meta-text: #8a6914;
  --c-cr-meta-border: rgba(201, 168, 76, 0.2);
  --c-cr-preview-bg: rgba(255, 255, 255, 0.82);
  --c-cr-preview-border: rgba(201, 168, 76, 0.25);
  --c-cr-preview-label: #8a6914;
  --c-cr-snippet: rgba(0, 0, 0, 0.6);
  --c-cr-ep: #8a6914;
  --c-cr-hook-bg: rgba(201, 168, 76, 0.08);
  --c-cr-hook-border: #c9a020;
  --c-cr-hook-text: #7a5910;
  --c-cr-code: #333;
  --c-cr-code-dim: rgba(0, 0, 0, 0.4);
  --c-cr-table: rgba(0, 0, 0, 0.45);
  --c-cr-table-bg: rgba(0, 0, 0, 0.04);
  --c-cr-tag-b-bg: rgba(201, 168, 76, 0.12);
  --c-cr-tag-b: #7a5910;
  --c-cr-tag-s-bg: rgba(90, 141, 163, 0.12);
  --c-cr-tag-s: #1a5276;
  --c-cr-tag-e-bg: rgba(76, 175, 80, 0.1);
  --c-cr-tag-e: #1e8449;
  --c-cr-dot: rgba(0, 0, 0, 0.18);
  --c-cr-dot-active: #c9a848;
  --c-cr-cta-hover-bg: #b8942f;
  --c-cr-cta-hover-border: #b8942f;
}
</style>
