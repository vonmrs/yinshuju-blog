#!/usr/bin/env node

/**
 * 生成 posts-meta.json
 * 读取所有文章的 frontmatter，生成元数据 JSON 文件
 */

const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.join(__dirname, '..', 'posts')
const OUTPUT_FILE = path.join(__dirname, '..', '.vitepress', 'dist', 'posts-meta.json')

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/m)
  if (!match) return {}
  
  const fm = {}
  const lines = match[1].split('\n')
    
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const key = line.substring(0, colonIndex).trim()
    let value = line.substring(colonIndex + 1).trim()
    // 移除引号
    value = value.replace(/^["']|["']$/g, '')
    // 处理数组
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value)
      } catch (e) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
      }
    }
    fm[key] = value
  }
  return fm
}

function walkDir(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath))
    } else if (file.endsWith('.md')) {
      results.push(filePath)
    }
  }
  return results
}

function generateMeta() {
  const posts = walkDir(POSTS_DIR)
  const meta = []
  for (const postPath of posts) {
    const content = fs.readFileSync(postPath, 'utf-8')
    const fm = parseFrontmatter(content)
    if (!fm.title || !fm.date) continue
    // 计算 URL
    const relativePath = path.relative(POSTS_DIR, postPath)
    const url = '/' + relativePath.replace(/\.md$/, '/').replace(/\\/g, '/')
    // 获取分类
    const category = Array.isArray(fm.categories) ? fm.categories[0] : (fm.categories || '')
    meta.push({
      title: fm.title,
      date: fm.date,
      category: category,
      url: url
    })
  }
  // 按日期排序（新的在前）
  meta.sort((a, b) => b.date.localeCompare(a.date))
  return meta
}

function main() {
  console.log('[posts-meta] 开始生成文章元数据...')
  const meta = generateMeta()
  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(meta, null, 2))
  console.log(`[posts-meta] ✅ 已生成 ${meta.length} 篇文章的元数据`)
  console.log(`[posts-meta] 输出文件: ${OUTPUT_FILE}`)
}

main()
