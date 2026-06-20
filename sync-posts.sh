#!/bin/bash
# 银枢局博客文章自动同步脚本
# 用法: ./sync-posts.sh [zhaojian|prism|dushe]

BLOG_DIR="/Users/von/Desktop/QClaw_doc/yinshuju/blog"
NEWS_DIR="/Users/von/Desktop/QClaw_doc/news"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[$(date '+%H:%M:%S')]${NC} $1"; }

# 处理朝鉴文章
sync_zhaojian() {
  local src_dir="$NEWS_DIR/jingzhou-morning"
  local dst_dir="$BLOG_DIR/posts/zhaojian"
  local count=0
  
  log "同步朝鉴文章..."
  
  for src_file in "$src_dir"/*.md; do
    [ -f "$src_file" ] || continue
    [ "$(basename "$src_file")" = "README.md" ] && continue
    
    # 提取日期
    local fname=$(basename "$src_file")
    local date=$(echo "$fname" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    [ -z "$date" ] && continue
    
    local dst_file="$dst_dir/zhaojian-$date.md"
    
    # 检查目标文件是否已存在
    if [ -f "$dst_file" ]; then
      warn "跳过已存在: zhaojian-$date.md"
      continue
    fi
    
    # 读取源文件
    local content=$(cat "$src_file")
    
    # 提取标题日期
    local title_date=$(echo "$content" | grep -oE '[0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日' | head -1)
    [ -z "$title_date" ] && title_date="$date"
    
    # 提取描述
    local desc=$(echo "$content" | grep -E '^### [0-9]+\.' | head -1 | sed 's/^### [0-9]*\. //')
    [ -z "$desc" ] && desc="朝闻天下，鉴往知来。"
    
    # 清理描述中的特殊字符
    desc=$(echo "$desc" | tr -d '"' | tr -d "'" | cut -c1-100)
    
    # 生成 frontmatter
    local frontmatter="---
title: \"$title_date\"
date: $date
categories:
  - zhaojian
tags:
  - 朝鉴
  - 趋势洞察
  - 新闻
author: 银枢局
---"
    
    # 清理正文（去掉 tagline）
    local body=$(echo "$content" | sed '/^> 朝闻天下/,/^$/d')
    
    # 写入目标文件
    echo "$frontmatter" > "$dst_file"
    echo "" >> "$dst_file"
    echo "$body" >> "$dst_file"
    
    log "已迁移: zhaojian-$date.md"
    ((count++))
  done
  
  log "朝鉴同步完成，新增 $count 篇"
  return $count
}

# 处理棱镜文章
sync_prism() {
  local src_dir="$NEWS_DIR/tech-afternoon"
  local dst_dir="$BLOG_DIR/posts/prism"
  local count=0
  
  log "同步棱镜文章..."
  
  for src_file in "$src_dir"/*.md; do
    [ -f "$src_file" ] || continue
    [ "$(basename "$src_file")" = "README.md" ] && continue
    
    local fname=$(basename "$src_file")
    local date=$(echo "$fname" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    [ -z "$date" ] && continue
    
    local dst_file="$dst_dir/prism-$date.md"
    
    if [ -f "$dst_file" ]; then
      warn "跳过已存在: prism-$date.md"
      continue
    fi
    
    local content=$(cat "$src_file")
    local title=$(echo "$content" | grep -E '^## ' | head -1 | sed 's/^## //' | cut -c1-80)
    [ -z "$title" ] && title="技术深度分析"
    
    # 清理标题中的特殊字符
    title=$(echo "$title" | tr -d '"' | tr -d "'" | tr -d '`')
    
    local frontmatter="---
title: \"$title\"
date: $date
categories:
  - prism
tags:
  - 棱镜
  - 技术
  - AI
author: 银枢局
---"
    
    echo "$frontmatter" > "$dst_file"
    echo "" >> "$dst_file"
    echo "$content" >> "$dst_file"
    
    log "已迁移: prism-$date.md"
    ((count++))
  done
  
  log "棱镜同步完成，新增 $count 篇"
  return $count
}

# 推送到 GitHub
push_to_github() {
  cd "$BLOG_DIR"
  
  # 检查是否有变更
  if git diff --quiet && git diff --cached --quiet; then
    log "没有新内容需要推送"
    return 0
  fi
  
  # 检查环境变量
  if [ -z "$GITHUB_PAT" ]; then
    echo "[$(date '+%H:%M:%S')] ❌ 错误: 未设置 GITHUB_PAT 环境变量"
    echo "请在 ~/.zshrc 或 ~/.bash_profile 中添加:\n    export GITHUB_PAT='your_token_here'"
    exit 1
  fi
  
  log "构建并推送..."
  npm run build > /dev/null 2>&1
  cp -r .vitepress/dist/* .
  
  git add .
  git commit -m "sync: $(date '+%Y-%m-%d %H:%M') 新文章同步" > /dev/null 2>&1
  git push https://$GITHUB_PAT@github.com/vonmrs/yinshuju-blog.git main > /dev/null 2>&1
  
  log "推送完成！网站将在 1-2 分钟内更新"
}

# 主逻辑
main() {
  local type=$1
  
  case "$type" in
    zhaojian)
      sync_zhaojian
      ;;
    prism)
      sync_prism
      ;;
    all)
      sync_zhaojian
      sync_prism
      ;;
    *)
      echo "用法: $0 [zhaojian|prism|all]"
      echo "  zhaojian - 同步朝鉴文章"
      echo "  prism    - 同步棱镜文章"
      echo "  all      - 同步全部"
      exit 1
      ;;
  esac
  
  push_to_github
}

main "$@"
