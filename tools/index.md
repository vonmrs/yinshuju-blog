---
layout: page
title: AI 工具集
---

<div class="page-container">

<PageBanner
  :slides="[
    { tag: '🎬 AI 内容创作', title: '剧能AI · 短剧剧本一键生成', desc: '输入题材与设定，AI 自动生成完整短剧剧本——人物小传、分集大纲、逐集正文，含悬念钩子，直达付费解锁点', cta: '立即体验', link: '/tools/duanju/' },
    { tag: '🔧 开发工具', title: 'MD 转 Word · 无损转换', desc: 'Markdown 一键转 Word 文档，完整保留标题层级、表格、代码块、列表格式，无需手动调整格式', cta: '立即使用', link: '/tools/md2word/' }
  ]"
  banner-id="tools"
  :interval="5000"
/>

# 🛠️ AI 工具集

> 让 AI 成为你的生产力杠杆。这里是银枢局出品的小工具，全部免费使用。

---

## 🎬 AI 内容创作

<div class="tools-grid">

<div class="tool-card tool-card-featured" onclick="location.href='/tools/duanju/'">
  <div class="tool-icon">🎬</div>
  <div class="tool-body">
    <h3 class="tool-name">剧能AI</h3>
    <p class="tool-desc">短剧剧本一键生成 · 人物小传 + 分集大纲 + 逐集正文，含悬念钩子，直达付费解锁点</p>
    <span class="tool-badge badge-new">NEW · 上线中</span>
  </div>
</div>

</div>

## 🔧 开发工具

<div class="tools-grid">

<div class="tool-card" onclick="location.href='/tools/md2word'">
  <div class="tool-icon">📄</div>
  <div class="tool-body">
    <h3 class="tool-name">MD 转 Word</h3>
    <p class="tool-desc">Markdown 一键转 Word 文档，支持标题/表格/代码块/列表</p>
    <span class="tool-badge badge-active">在线使用</span>
  </div>
</div>

<div class="tool-card">
  <div class="tool-icon">🖥️</div>
  <div class="tool-body">
    <h3 class="tool-name">JSON 格式化器</h3>
    <p class="tool-desc">美化、校验、压缩 JSON 数据</p>
    <span class="tool-badge badge-coming">即将上线</span>
  </div>
</div>

<div class="tool-card">
  <div class="tool-icon">🔤</div>
  <div class="tool-body">
    <h3 class="tool-name">正则表达式测试</h3>
    <p class="tool-desc">实时匹配，高亮捕获组</p>
    <span class="tool-badge badge-coming">即将上线</span>
  </div>
</div>

<div class="tool-card">
  <div class="tool-icon">🎨</div>
  <div class="tool-body">
    <h3 class="tool-name">颜色转换器</h3>
    <p class="tool-desc">HEX / RGB / HSL 互转</p>
    <span class="tool-badge badge-coming">即将上线</span>
  </div>
</div>

<div class="tool-card">
  <div class="tool-icon">🔑</div>
  <div class="tool-body">
    <h3 class="tool-name">UUID 生成器</h3>
    <p class="tool-desc">一键生成各种 UUID</p>
    <span class="tool-badge badge-coming">即将上线</span>
  </div>
</div>

</div>

## 🤖 AI 工具

<div class="tools-grid">

<div class="tool-card">
  <div class="tool-icon">💬</div>
  <div class="tool-body">
    <h3 class="tool-name">提示词库</h3>
    <p class="tool-desc">精选 AI 提示词模板</p>
    <span class="tool-badge badge-planning">规划中</span>
  </div>
</div>

<div class="tool-card">
  <div class="tool-icon">🎯</div>
  <div class="tool-body">
    <h3 class="tool-name">生图提示词生成器</h3>
    <p class="tool-desc">通义万相 / Midjourney 提示词</p>
    <span class="tool-badge badge-planning">规划中</span>
  </div>
</div>

<div class="tool-card">
  <div class="tool-icon">🔥</div>
  <div class="tool-body">
    <h3 class="tool-name">小红书爆款标题生成</h3>
    <p class="tool-desc">AI 辅助创作</p>
    <span class="tool-badge badge-planning">规划中</span>
  </div>
</div>

</div>

## 📊 效率工具

<div class="tools-grid">

<div class="tool-card">
  <div class="tool-icon">⏰</div>
  <div class="tool-body">
    <h3 class="tool-name">番茄钟</h3>
    <p class="tool-desc">专注计时 + 统计</p>
    <span class="tool-badge badge-planning">规划中</span>
  </div>
</div>

<div class="tool-card">
  <div class="tool-icon">🔗</div>
  <div class="tool-body">
    <h3 class="tool-name">短链生成器</h3>
    <p class="tool-desc">缩短链接 + 点击统计</p>
    <span class="tool-badge badge-planning">规划中</span>
  </div>
</div>

</div>

---

## 💡 想要什么工具？

如果你有想要的工具想法，[告诉我](/about/)，说不定下一个上线的就是你提的。

::: tip
所有工具均为银枢局自建，不依赖第三方数据，安全隐私。
:::

</div>

<style>
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.tool-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.25s;
}

.tool-card:hover {
  border-color: var(--inzu-gold);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.tool-card.tool-card-featured {
  background: rgba(201, 168, 76, 0.06);
  border-color: rgba(201, 168, 76, 0.35);
}

.tool-card.tool-card-featured:hover {
  border-color: var(--inzu-gold);
  background: rgba(201, 168, 76, 0.1);
  box-shadow: 0 4px 24px rgba(201, 168, 76, 0.15);
}

.tool-icon {
  font-size: 1.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.tool-body {
  flex: 1;
  min-width: 0;
}

.tool-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.3rem !important;
}

.tool-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.6rem !important;
}

.tool-badge {
  font-size: 0.72rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
}

.badge-coming {
  background: rgba(201, 168, 76, 0.15);
  color: var(--inzu-gold);
}

.badge-planning {
  background: rgba(132, 125, 110, 0.15);
  color: var(--vp-c-text-2);
}

.badge-active {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.badge-new {
  background: rgba(191, 59, 46, 0.15);
  color: var(--inzu-seal, #BF3B2E);
}

.tool-card[onclick] {
  cursor: pointer;
}
</style>
