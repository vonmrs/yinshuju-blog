<template>
  <div class="html-article">
    <div v-if="loading" class="html-article-loading">加载中...</div>
    <div v-else-if="error" class="html-article-error">{{ error }}</div>
    <div v-else class="html-article-content" v-html="content" ref="articleRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  htmlFile: {
    type: String,
    required: true
  }
})

const content = ref('')
const loading = ref(true)
const error = ref('')
const articleRef = ref(null)

// 根据文件名自动判断目录
function getPath(filename) {
  if (filename.startsWith('/')) return filename
  if (filename.startsWith('zhaojian-')) return `/articles/zhaojian/${filename}`
  if (filename.startsWith('prism-')) return `/articles/prism/${filename}`
  return `/articles/${filename}`
}

// 注入主题变量覆盖内联样式
function applyThemeVars() {
  const el = articleRef.value
  if (!el) return
  const isDark = document.documentElement.classList.contains('dark')
  const vars = isDark ? {
    '--a-bg': 'var(--vp-c-bg)',
    '--a-bg-2': 'rgba(255,255,255,0.06)',
    '--a-bg-soft': 'rgba(255,255,255,0.04)',
    '--a-text': 'var(--vp-c-text)',
    '--a-text-dim': 'var(--vp-c-text-2)',
    '--a-border': 'rgba(255,255,255,0.1)',
    '--a-accent': '#00d4ff',
    '--a-accent-2': '#00a8cc',
    '--a-accent-dark': '#f0c040',
    '--a-red': '#e74c3c',
    '--a-dark-bg': '#0f0c29',
    '--a-dark-mid': '#302b63',
    '--a-dark-3': '#24243e',
    '--a-table-bg': 'rgba(255,255,255,0.03)',
    '--a-table-th': 'rgba(255,255,255,0.06)',
    '--a-section-bg': 'rgba(255,255,255,0.04)',
    '--a-pre-bg': '#1e1e1e',
  } : {
    '--a-bg': 'var(--vp-c-bg)',
    '--a-bg-2': 'rgba(0,0,0,0.04)',
    '--a-bg-soft': 'rgba(0,0,0,0.02)',
    '--a-text': 'var(--vp-c-text)',
    '--a-text-dim': 'var(--vp-c-text-2)',
    '--a-border': 'rgba(0,0,0,0.1)',
    '--a-accent': '#0077cc',
    '--a-accent-2': '#0055aa',
    '--a-accent-dark': '#c9a020',
    '--a-red': '#c0392b',
    '--a-dark-bg': '#0f1a2e',
    '--a-dark-mid': '#1a3a6e',
    '--a-dark-3': '#1e3a5f',
    '--a-table-bg': 'rgba(0,0,0,0.03)',
    '--a-table-th': 'rgba(0,0,0,0.06)',
    '--a-section-bg': 'rgba(0,0,0,0.03)',
    '--a-pre-bg': '#f5f5f5',
  }
  el.style.setProperty('--a-theme-is-dark', isDark ? '1' : '0')
}

onMounted(async () => {
  const url = getPath(props.htmlFile)
  try {
    const res = await fetch(url)
    if (!res.ok) {
      error.value = `加载失败 (${res.status}): ${url}`
      loading.value = false
      return
    }
    let html = await res.text()

    // 去掉外层标签
    html = html
      .replace(/<!DOCTYPE[^>]*>\s*/gi, '')
      .replace(/<html[^>]*>\s*/gi, '')
      .replace(/<\/html>\s*/gi, '')
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>\s*/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>\s*/gi, '')

    content.value = html.trim()
    loading.value = false

    await nextTick()
    applyThemeVars()

    // 监听 VitePress 主题切换
    const observer = new MutationObserver(() => applyThemeVars())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  } catch (e) {
    error.value = '加载失败: ' + e.message
    loading.value = false
  }
})
</script>

<style>
/* ============================================================
   亮 / 暗 双主题变量 — 用于覆盖文章内联样式
   ============================================================ */

/* 亮色模式默认值（默认是亮色） */
.html-article-content {
  --a-accent: #0077cc;
  --a-accent-2: #0055aa;
  --a-red: #c0392b;
  --a-accent-dark: #c9a020;
  --a-dark-bg: #0f1a2e;
  --a-dark-mid: #1a3a6e;
  --a-dark-3: #1e3a5f;
  --a-table-th-bg: rgba(0,0,0,0.06);
  --a-table-alt: rgba(0,0,0,0.025);
  --a-section-bg: rgba(0,0,0,0.03);
  --a-pre-bg: #f5f5f5;
  --a-pre-text: #333;
  --a-code-bg: #f0f0f0;
  --a-code-text: #c0392b;
  --a-blockquote-bg: #f0f7ff;
  --a-blockquote-border: #0077cc;
}

/* 暗色模式 */
.dark .html-article-content,
.html-article-content[data-dark="true"] {
  --a-accent: #00d4ff;
  --a-accent-2: #00a8cc;
  --a-red: #e74c3c;
  --a-accent-dark: #f0c040;
  --a-dark-bg: #0f0c29;
  --a-dark-mid: #302b63;
  --a-dark-3: #24243e;
  --a-table-th-bg: rgba(255,255,255,0.06);
  --a-table-alt: rgba(255,255,255,0.025);
  --a-section-bg: rgba(255,255,255,0.04);
  --a-pre-bg: #1e1e1e;
  --a-pre-text: #d4d4d4;
  --a-code-bg: rgba(255,255,255,0.08);
  --a-code-text: #f0c040;
  --a-blockquote-bg: rgba(0,212,255,0.06);
  --a-blockquote-border: #00d4ff;
}

/* ============================================================
   通用元素样式
   ============================================================ */
.html-article-content {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.8;
  color: var(--vp-c-text);
}

.html-article-loading {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 2rem;
}

.html-article-error {
  color: var(--a-red);
  padding: 1rem;
  background: rgba(231, 76, 60, 0.08);
  border-radius: 8px;
}

/* ============================================================
   封面 / 头部区域（覆盖内联 background: #161b22 / #0f0c29...）
   ============================================================ */
.html-article-content > section:first-child {
  background: var(--a-dark-bg) !important;
}
.html-article-content > section:first-child p,
.html-article-content > section:first-child h1,
.html-article-content > section:first-child h2 {
  color: #ffffff !important;
}

/* 暗色渐变背景（#0f0c29 / #302b63）-> 用 CSS var 保留一致性 */
.html-article-content [style*="0f0c29"] {
  background: var(--a-dark-bg) !important;
}
.html-article-content [style*="302b63"] {
  background: var(--a-dark-mid) !important;
}
.html-article-content [style*="24243e"] {
  background: var(--a-dark-3) !important;
}

/* 纯深色背景（#161b22 / #1a1a2e 等） */
.html-article-content [style*="161b22"],
.html-article-content [style*="1a1a2e"],
.html-article-content [style*="1e1e2e"] {
  background: var(--a-dark-bg) !important;
}

/* 纯深色文字 */
.html-article-content [style*="color: #ffffff"],
.html-article-content [style*="color:#ffffff"],
.html-article-content [style*="color: #fff"],
.html-article-content [style*="color:#fff"] {
  color: #ffffff !important;
}
.html-article-content [style*="color: #8b949e"],
.html-article-content [style*="color:#8b949e"],
.html-article-content [style*="color: #cccccc"],
.html-article-content [style*="color:#cccccc"] {
  color: var(--vp-c-text-2) !important;
}
.html-article-content [style*="color: #00d4ff"],
.html-article-content [style*="color:#00d4ff"] {
  color: var(--a-accent) !important;
}
.html-article-content [style*="color: #00a8cc"],
.html-article-content [style*="color:#00a8cc"] {
  color: var(--a-accent-2) !important;
}
.html-article-content [style*="color: #e74c3c"],
.html-article-content [style*="color:#e74c3c"],
.html-article-content [style*="color: #f44336"],
.html-article-content [style*="color:#f44336"] {
  color: var(--a-red) !important;
}
.html-article-content [style*="color: #f0c040"],
.html-article-content [style*="color:#f0c040"],
.html-article-content [style*="color: #c9a020"],
.html-article-content [style*="color:#c9a020"] {
  color: var(--a-accent-dark) !important;
}

/* 深色边框 */
.html-article-content [style*="border: 1px solid #30363d"],
.html-article-content [style*="border:1px solid #30363d"] {
  border-color: var(--a-border) !important;
}
.html-article-content [style*="border-left: 4px solid #00d4ff"],
.html-article-content [style*="border-left:4px solid #00d4ff"] {
  border-left-color: var(--a-accent) !important;
}

/* ============================================================
   图片
   ============================================================ */
.html-article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
}

/* ============================================================
   表格（覆盖内联 background）
   ============================================================ */
.html-article-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 14px;
  border-radius: 10px;
  overflow: hidden;
  display: block;
  overflow-x: auto;
}

.html-article-content table[style*="transparent"],
.html-article-content table[style*="#161b22"],
.html-article-content table[style*="1a1a2e"] {
  background: transparent !important;
}

.html-article-content th[style*="0f0c29"],
.html-article-content th[style*="302b63"],
.html-article-content th[style*="161b22"] {
  background: var(--a-table-th-bg) !important;
  color: #ffffff !important;
}
.html-article-content td[style*="e3f2fd"],
.html-article-content td[style*="bbdefb"],
.html-article-content td[style*="f0f8ff"] {
  background: var(--a-table-alt) !important;
}
.html-article-content td[style*="f5f9ff"] {
  background: var(--a-blockquote-bg) !important;
}
.html-article-content td[style*="f44336"],
.html-article-content td[style*="e74c3c"] {
  color: var(--a-red) !important;
}
.html-article-content td[style*="4caf50"],
.html-article-content td[style*="27ae60"] {
  color: #27ae60 !important;
}

.html-article-content th,
.html-article-content td {
  padding: 10px 12px;
  text-align: left;
  white-space: nowrap;
}

/* ============================================================
   标题
   ============================================================ */
.html-article-content h2 {
  font-size: 1.25em;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  padding-bottom: 0.3em;
  border-bottom: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text);
}

.html-article-content h3 {
  font-size: 1.1em;
  font-weight: 700;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
  color: var(--vp-c-text);
}

/* ============================================================
   分隔线
   ============================================================ */
.html-article-content [style*="height: 1px"] {
  opacity: 0.3;
}

/* ============================================================
   section 卡片
   ============================================================ */
.html-article-content section {
  margin: 1.2em 0;
  padding: 1em;
  background: var(--a-section-bg) !important;
  border-radius: 8px;
  border-left: 3px solid var(--a-accent) !important;
}
.html-article-content section p {
  color: var(--vp-c-text);
}

/* 渐变背景的 section 保留（封面等特殊区块）*/
.html-article-content section[style*="gradient"] {
  border-left: none !important;
}

/* ============================================================
   引用块
   ============================================================ */
.html-article-content blockquote {
  border-left: 4px solid var(--a-blockquote-border);
  padding: 0.5em 1em;
  margin: 1em 0;
  background: var(--a-blockquote-bg);
  border-radius: 0 8px 8px 0;
}
.html-article-content blockquote p {
  margin: 0;
  color: var(--vp-c-text);
}

/* ============================================================
   代码
   ============================================================ */
.html-article-content code {
  background: var(--a-code-bg);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  color: var(--a-code-text);
}

.html-article-content pre {
  background: var(--a-pre-bg);
  color: var(--a-pre-text);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.9em;
}
.html-article-content pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}

/* ============================================================
   超链接
   ============================================================ */
.html-article-content a {
  color: var(--a-accent);
  text-decoration: none;
}
.html-article-content a:hover {
  text-decoration: underline;
}

/* ============================================================
   列表
   ============================================================ */
.html-article-content ul,
.html-article-content ol {
  padding-left: 1.5em;
  color: var(--vp-c-text);
}
.html-article-content li {
  margin: 0.3em 0;
}

/* ============================================================
   进度条
   ============================================================ */
.html-article-content .progress-bar {
  height: 8px;
  border-radius: 4px;
  background: var(--vp-c-divider);
  overflow: hidden;
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 768px) {
  .html-article-content {
    font-size: 15px;
  }
  .html-article-content table {
    font-size: 13px;
  }
}
</style>
