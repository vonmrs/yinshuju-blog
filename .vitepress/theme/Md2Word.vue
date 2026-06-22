<template>
  <div class="md2word-container">
    <div class="editor-section">
      <div class="editor-header">
        <h3>📝 Markdown 输入</h3>
        <div class="editor-actions">
          <button class="btn btn-sm" @click="loadExample">加载示例</button>
          <button class="btn btn-sm btn-danger" @click="clearInput">清空</button>
        </div>
      </div>
      <textarea
        v-model="mdInput"
        class="md-textarea"
        placeholder="在此粘贴或输入 Markdown 内容..."
        spellcheck="false"
      ></textarea>
      <div class="word-count">{{ mdInput.length }} 字符 · {{ mdInput.split('\n').filter(l => l.trim()).length }} 行</div>
    </div>

    <div class="preview-section">
      <div class="editor-header">
        <h3>👁️ 预览</h3>
      </div>
      <div class="preview-content" v-html="renderedHtml"></div>
    </div>

    <div class="action-bar">
      <div class="convert-btn" @click="convertToWord" :class="{ loading: converting }">
        <span v-if="!converting">📄 转换为 Word 文档</span>
        <span v-else>⏳ 转换中...</span>
      </div>
      <p class="hint">纯前端处理，文件不上传服务器，隐私安全</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const mdInput = ref('')
const converting = ref(false)

const exampleMd = `# 银枢局 · 技术周报

## 本周摘要

本期涵盖了 **AI Agent**、开源大模型、以及前端工程化的最新进展。

### 🔥 热点：DeepSeek 完成 74 亿美元融资

> 梁文锋个人出资 200 亿，保持绝对控制权。

这是一个明确的信号：**AI 基础设施**正在成为新的公共品。

#### 关键数据

| 项目 | 数值 |
|------|------|
| 估值 | 500亿美元 |
| 个人出资 | 200亿 |
| 锁定期 | 5年 |

#### 技术要点

1. GLM-5.2 开源，MIT 协议
2. 代码基准 74.4 分
3. 成本仅为闭源零头

### 📌 任务清单

- [x] 完成 VitePress 部署
- [x] 集成 Pagefind 搜索
- [ ] 接入评论系统
- [ ] SEO 优化

### 💡 代码示例

\`\`\`javascript
const greeting = (name) => {
  console.log(\`Hello, \${name}!\`)
}
greeting('银枢局')
\`\`\`

---

*更多内容请关注银枢局博客*
`

const renderedHtml = computed(() => {
  if (!mdInput.value.trim()) return '<p style="color:var(--vp-c-text-3)">Markdown 内容将在此预览...</p>'
  return renderMarkdown(mdInput.value)
})

function renderMarkdown(md: string): string {
  let html = md
    // 标题
    .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // 引用
    .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    // 粗体/斜体/行内代码
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 无序列表
    .replace(/^- \[x\]\s+(.+)$/gm, '<div class="list-item checked">☑️ $1</div>')
    .replace(/^- \[\s\]\s+(.+)$/gm, '<div class="list-item unchecked">⬜ $1</div>')
    .replace(/^- (.+)$/gm, '<div class="list-item">• $1</div>')
    // 有序列表
    .replace(/^\d+\.\s+(.+)$/gm, '<div class="list-item">• $1</div>')
    // 分隔线
    .replace(/^---+$/gm, '<hr>')
    // 斜体（星号包裹，避免与列表冲突）
    .replace(/(?<![-\d])\*(?!\*)(.+?)(?<!\*)\*(?!\*[-\d])/g, '<em>$1</em>')
    // 段落（非空非标签行）
    .replace(/^(?!<[hubodlh]|<div|<hr|<code|<strong|<em)(.+)$/gm, (match) => {
      if (match.startsWith('|') || match.startsWith('-')) return match
      return `<p>${match}</p>`
    })
  // 清理连续 blockquote
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n')
  // 简易表格处理
  html = html.replace(/(?:<p>)?\|(.+)\|(?:<\/p>)?/g, (match) => {
    const cells = match.replace(/<\/?p>/g, '').split('|').filter(c => c.trim())
    const isSep = cells.every(c => /^[\s\-:]+$/.test(c))
    if (isSep) return ''
    const tag = 'td'
    return '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>'
  })
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table class="md-table">$1</table>')

  return html
}

async function convertToWord() {
  if (!mdInput.value.trim()) return
  converting.value = true

  try {
    const html = generateDocHtml(mdInput.value)

    // 构建 Word 兼容的 HTML Blob
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Export</title>
<style>
body { font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', sans-serif; font-size: 14px; line-height: 1.8; color: #333; padding: 40px; }
h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #1a1a1a; border-bottom: 2px solid #C9A84C; padding-bottom: 8px; }
h2 { font-size: 20px; font-weight: bold; margin: 24px 0 12px; color: #2a2a2a; }
h3 { font-size: 17px; font-weight: bold; margin: 20px 0 10px; color: #3a3a3a; }
h4 { font-size: 15px; font-weight: bold; margin: 16px 0 8px; color: #4a4a4a; }
p { margin: 8px 0; }
strong { font-weight: bold; color: #1a1a1a; }
em { font-style: italic; }
code { font-family: 'Consolas', 'Courier New', monospace; background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: 13px; color: #c7254e; }
pre { background: #f8f8f8; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; overflow-x: auto; }
pre code { background: none; padding: 0; color: #333; font-size: 13px; }
blockquote { border-left: 4px solid #C9A84C; padding: 8px 16px; margin: 12px 0; color: #666; background: #faf9f6; }
table { border-collapse: collapse; width: 100%; margin: 16px 0; }
th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
th { background: #f5f5f5; font-weight: bold; }
hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
ul, ol { margin: 8px 0; padding-left: 24px; }
li { margin: 4px 0; }
</style></head><body>`
    const postHtml = '</body></html>'

    const blob = new Blob([preHtml + html + postHtml], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.doc'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('转换失败:', e)
  } finally {
    converting.value = false
  }
}

function generateDocHtml(md: string): string {
  let html = md
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 标题
    .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // 引用
    .replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    // 粗体/斜体/行内代码
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 分隔线
    .replace(/^---+$/gm, '<hr>')
    // 表格
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim())
      const isSep = cells.every(c => /^[\s\-:]+$/.test(c))
      if (isSep) return ''
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
    })
    // 无序列表
    .replace(/^- \[x\]\s+(.+)$/gm, '<li>☑ $1</li>')
    .replace(/^- \[\s\]\s+(.+)$/gm, '<li>☐ $1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // 有序列表
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // 斜体
    .replace(/(?<![-\d])\*(?!\*)(.+?)(?<!\*)\*(?!\*[-\d])/g, '<em>$1</em>')
    // 段落
    .replace(/^(?!<[hubodlpr]|<tr|<hr|<li|<code|<strong|<em|<table)(.+)$/gm, '<p>$1</p>')

  // 合并连续 li 为 ul
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
  // 合并连续 blockquote
  html = html.replace(/<\/blockquote>\n<blockquote><p>/g, '\n')

  // 表格行包裹
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table>$1</table>')

  return html
}

function loadExample() {
  mdInput.value = exampleMd
}

function clearInput() {
  mdInput.value = ''
}
</script>

<style scoped>
.md2word-container {
  max-width: 900px;
  margin: 0 auto;
}

.editor-section,
.preview-section {
  margin-bottom: 1.5rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.editor-header h3 {
  margin: 0 !important;
  font-size: 1rem;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.md-textarea {
  width: 100%;
  min-height: 350px;
  padding: 1rem;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.md-textarea:focus {
  border-color: var(--inzu-gold);
}

.word-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-align: right;
  margin-top: 0.4rem;
}

.preview-content {
  min-height: 200px;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  line-height: 1.7;
  overflow-x: auto;
}

.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3),
.preview-content :deep(h4) {
  font-family: 'Noto Serif SC', serif;
  color: var(--vp-c-text-1);
  margin-top: 1.2em;
  margin-bottom: 0.6em;
}

.preview-content :deep(h1) {
  font-size: 1.6rem;
  border-bottom: 2px solid var(--inzu-gold);
  padding-bottom: 0.5rem;
}

.preview-content :deep(h2) { font-size: 1.35rem; }
.preview-content :deep(h3) { font-size: 1.15rem; }

.preview-content :deep(blockquote) {
  border-left: 4px solid var(--inzu-gold);
  padding: 0.6rem 1rem;
  margin: 0.8rem 0;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 0 6px 6px 0;
}

.preview-content :deep(code) {
  font-family: 'JetBrains Mono', Consolas, monospace;
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85em;
  color: var(--vp-c-brand);
}

.preview-content :deep(pre) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.preview-content :deep(pre code) {
  background: none;
  padding: 0;
}

.preview-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin: 1.5rem 0;
}

.preview-content :deep(.md-table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.preview-content :deep(.md-table td) {
  border: 1px solid var(--vp-c-divider);
  padding: 6px 12px;
}

.preview-content :deep(.list-item) {
  padding: 2px 0 2px 8px;
  border-left: 2px solid var(--vp-c-divider);
  margin-left: 4px;
}

.preview-content :deep(.list-item.checked) {
  border-left-color: #4caf50;
}

.action-bar {
  text-align: center;
  margin: 2rem 0;
}

.convert-btn {
  display: inline-block;
  padding: 0.85rem 2.5rem;
  background: linear-gradient(135deg, #C9A84C, #A68B3C);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.3);
}

.convert-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
}

.convert-btn.loading {
  opacity: 0.7;
  cursor: wait;
}

.hint {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-top: 0.75rem;
}

.btn {
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  border-color: var(--inzu-gold);
  color: var(--vp-c-text-1);
}

.btn-danger:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

@media (max-width: 640px) {
  .md-textarea {
    min-height: 250px;
    font-size: 0.8rem;
  }

  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
