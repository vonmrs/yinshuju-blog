<template>
  <div class="html-article">
    <div v-if="loading" class="html-article-loading">加载中...</div>
    <div v-else-if="error" class="html-article-error">{{ error }}</div>
    <div v-else class="html-article-content" v-html="content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  htmlFile: {
    type: String,
    required: true
  }
})

const content = ref('')
const loading = ref(true)
const error = ref('')

// 根据文件名自动判断目录
// zhaojian-2026-07-02.html -> /posts/zhaojian/zhaojian-2026-07-02.html
// prism-2026-07-02.html -> /posts/prism/prism-2026-07-02.html
function getPath(filename) {
  if (filename.startsWith('/')) return filename
  if (filename.startsWith('zhaojian-')) {
    return `/articles/zhaojian/${filename}`
  }
  if (filename.startsWith('prism-')) {
    return `/articles/prism/${filename}`
  }
  return `/articles/${filename}`
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

    // 去掉 <html>/<head>/<body>/<!DOCTYPE> 等外层标签
    html = html
      .replace(/<!DOCTYPE[^>]*>\s*/gi, '')
      .replace(/<html[^>]*>\s*/gi, '')
      .replace(/<\/html>\s*/gi, '')
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>\s*/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>\s*/gi, '')

    content.value = html.trim()
    loading.value = false
  } catch (e) {
    error.value = '加载失败: ' + e.message
    loading.value = false
  }
})
</script>

<style>
.html-article {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.8;
  color: #333;
  padding: 0;
}

.html-article-loading {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.html-article-error {
  color: #e74c3c;
  padding: 1rem;
  background: #fdf2f2;
  border-radius: 8px;
}

.html-article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
}

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

.html-article-content th,
.html-article-content td {
  padding: 10px 12px;
  text-align: left;
  white-space: nowrap;
}

.html-article-content h2 {
  font-size: 1.25em;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  padding-bottom: 0.3em;
  border-bottom: 2px solid #eee;
}

.html-article-content h3 {
  font-size: 1.1em;
  font-weight: 700;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
}

.html-article-content blockquote {
  border-left: 4px solid #1976d2;
  padding: 0.5em 1em;
  margin: 1em 0;
  background: #f5f9ff;
  border-radius: 0 8px 8px 0;
}

.html-article-content blockquote p {
  margin: 0;
}

.html-article-content code {
  background: #f0f0f0;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: 'Fira Code', monospace;
}

.html-article-content pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.9em;
}

.html-article-content a {
  color: #1976d2;
  text-decoration: none;
}

.html-article-content a:hover {
  text-decoration: underline;
}

/* 微信公众号风格的卡片效果 */
.html-article-content section {
  margin: 1.2em 0;
  padding: 1em;
  background: #fafafa;
  border-radius: 8px;
  border-left: 3px solid #1976d2;
}

/* 进度条样式 */
.html-article-content .progress-bar {
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  overflow: hidden;
}

/* 响应式 */
@media (max-width: 768px) {
  .html-article-content {
    font-size: 15px;
  }

  .html-article-content table {
    font-size: 13px;
  }
}
</style>
