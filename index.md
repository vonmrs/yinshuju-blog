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
    link: /categories/prism
    linkText: 阅读技术文章
  - icon: 🔭
    title: 朝鉴 · 趋势洞察
    details: 新闻背后的经济信号与机会窗口。每天一条，看懂趋势。
    link: /categories/zhaojian
    linkText: 探索趋势
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
  background: var(--inzu-parchment-dark);
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
  color: var(--inzu-silver-100) !important;
  margin: 0 0 0.8rem !important;
  line-height: 1.15 !important;
  border: none !important;
}

.slide-desc {
  font-size: 0.9rem;
  color: var(--inzu-silver-500);
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
  color: var(--inzu-silver-500);
  padding: 0.2rem 0.6rem;
  background: var(--inzu-parchment-mid);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
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
  background: #d4b357;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.3);
  color: var(--inzu-ink);
  border-color: #d4b357;
}

/* ── 右侧预览卡 ── */
.slide-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-card {
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 1.5rem;
  width: 100%;
  max-width: 340px;
  backdrop-filter: blur(8px);
}

.preview-label {
  font-size: 0.75rem;
  color: #c9a020;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.preview-snippet {
  font-size: 0.82rem;
  line-height: 1.8;
  color: rgba(240,236,226,0.6);
}

.snippet-ep {
  font-family: 'Noto Serif SC', serif;
  color: #f0c040;
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
  background: rgba(240,192,64,0.08);
  border-left: 2px solid #f0c040;
  font-size: 0.78rem;
  color: #c9a020;
}

.snippet-code {
  font-family: 'JetBrains Mono', monospace;
  color: #f0ece2;
  font-size: 0.82rem;
  margin-bottom: 0.3rem;
}

.snippet-code-dim {
  color: rgba(240,236,226,0.4);
  font-size: 0.75rem;
}

.snippet-table {
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(240,236,226,0.5);
  background: rgba(255,255,255,0.03);
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
  background: rgba(240,192,64,0.12);
  color: #c9a020;
  border-radius: 4px;
}

.tag-s {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background: rgba(90,141,163,0.15);
  color: var(--inzu-jade);
  border-radius: 4px;
}

.tag-e {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background: rgba(76,175,80,0.12);
  color: #4caf50;
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
  background: var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.dot.dot-active {
  background: var(--inzu-gold);
  width: 24px;
  border-radius: 4px;
}

.dot:hover {
  background: var(--inzu-silver-500);
}
</style>

<style vars-provider>
/* 亮色模式下轮播组件配色适配 */
:root:not(.dark) {
  /* 轮播容器在亮色下用浅暖灰背景 */
  .tool-carousel {
    background: rgba(240, 236, 226, 0.55);
    border-color: rgba(201, 168, 76, 0.2);
  }

  /* 文字在亮色下用深色 */
  .slide-title {
    color: #1a1a1a !important;
  }
  .slide-desc {
    color: rgba(0, 0, 0, 0.6);
  }
  .slide-meta span {
    background: rgba(201, 168, 76, 0.1);
    color: #8a6914;
    border-color: rgba(201, 168, 76, 0.2);
  }

  /* 预览卡在亮色下用浅色背景 */
  .preview-card {
    background: rgba(255, 255, 255, 0.75);
    border-color: rgba(201, 168, 76, 0.2);
  }
  .preview-snippet {
    color: rgba(0, 0, 0, 0.6);
  }
  .snippet-ep {
    color: #8a6914;
  }

  /* CTA 按钮在亮色下保持金色 */
  .slide-cta {
    background: #c9a848;
    color: #fff;
    border-color: #c9a848;
  }
  .slide-cta:hover {
    background: #b8942f;
    border-color: #b8942f;
    color: #fff;
  }

  /* 指示器在亮色下用灰色点 */
  .dot {
    background: rgba(0, 0, 0, 0.18);
  }
  .dot.dot-active {
    background: #c9a848;
  }
  .dot:hover {
    background: rgba(0, 0, 0, 0.35);
  }
}
</style>
