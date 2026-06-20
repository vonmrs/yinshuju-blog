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
  
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) {
      i++
      continue
    }
    
    const key = line.substring(0, colonIndex).trim()
    let value = line.substring(colonIndex + 1).trim()
    
    // 检查是否是列表的开始
    if (value === '' && i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
      // 多行列表
      const list = []
      i++ // 跳到下一行
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        list.push(lines[i].trim().substring(2).trim().replace(/^["']|["']$/g, ''))
        i++
      }
      fm[key] = list
      continue
    }
    
    // 移除引号
    value = value.replace(/^["']|["']$/g, '')
    
    // 处理单行数组
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value)
      } catch (e) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
      }
    }
    
    fm[key] = value
    i++
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
    
    // 获取分类（取第一个）
    let category = ''
    if (Array.isArray(fm.categories)) {
      category = fm.categories[0] || ''
    } else if (fm.categories) {
      category = fm.categories.replace(/^["']|["']$/g, '')
    }
    
    // 提取摘要（前150字，清理格式）
    const body = content.replace(/^---\n[\s\S]*?\n---\n?/, '').trim()
    const cleanBody = body.replace(/[#*_`>]/g, '').replace(/\n+/g, ' ').trim()
    const excerpt = cleanBody.substring(0, 150).trim() + '...'
    
    // 提取标签
    let tags = []
    if (Array.isArray(fm.tags)) {
      tags = fm.tags
    } else if (fm.tags) {
      tags = fm.tags.replace(/^["']|["']$/g, '').split(',').map(t => t.trim()).filter(Boolean)
    }
    
    meta.push({
      title: fm.title,
      date: fm.date,
      category: category,
      url: url,
      tags: tags,
      excerpt: excerpt
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
  
  // 验证 category 字段
  const emptyCategory = meta.filter(p => !p.category)
  if (emptyCategory.length > 0) {
    console.warn(`[posts-meta] ⚠️ 警告: ${emptyCategory.length} 篇文章的 category 字段为空`)
  } else {
    console.log(`[posts-meta] ✅ 所有文章的 category 字段已正确提取`)
  }
}

main()
