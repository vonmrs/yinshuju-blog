#!/bin/bash
# 银枢局博客文章自动同步脚本 v2
# 功能：同步 .html 带样式文件（和公众号一致的排版）到网站 posts 目录
# 用法: ./sync-posts.sh [zhaojian|prism|all]

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

  for src_file in "$src_dir"/*-wechat-styled.html; do
    [ -f "$src_file" ] || continue

    local fname=$(basename "$src_file")
    # 从文件名提取日期：2026-07-01-wechat-styled.html
    local date=$(echo "$fname" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    [ -z "$date" ] && continue

    local dst_html="$dst_dir/zhaojian-$date.html"
    local dst_md="$dst_dir/zhaojian-$date.md"

    # 1. 复制 HTML 文件
    cp "$src_file" "$dst_html"
    log "  ✓ HTML: zhaojian-$date.html"

    # 2. 读取源 md 提取标题和描述
    local src_md="${src_file%-wechat-styled.html}.md"
    if [ -f "$src_md" ]; then
      local content=$(cat "$src_md")

      # 提取标题（## 加粗行）
      local title=$(echo "$content" | grep -E '^\*\*(今日主题|一、二、三、四、五)[:：]' | head -1 | sed 's/^\*\*//;s/\*\*//' | cut -c1-100)
      [ -z "$title" ] && title="$date 朝鉴"
      title=$(echo "$title" | tr -d '"' | tr -d "'" | tr -d '`')

      # 提取日期中文
      local title_date=$(echo "$content" | grep -oE '[0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日' | head -1)
      [ -z "$title_date" ] && title_date="$date"

      # 提取描述（正文第一句）
      local desc=$(echo "$content" | sed -n '/^## /,$p' | grep -vE '^(#|##|\*\*|\!\[\[)' | grep -v '^$' | head -1 | cut -c1-150)
      desc=$(echo "$desc" | tr -d '*' | tr -d '"' | cut -c1-100)

      # 生成 .md 文件（使用 HtmlArticle 组件渲染 HTML）
      cat > "$dst_md" << EOF
---
title: "$title_date - 朝鉴"
date: $date
description: "$desc"
categories:
  - zhaojian
tags:
  - 朝鉴
  - 趋势洞察
  - 新闻
author: 银枢局
htmlFile: zhaojian-$date.html
---

<HtmlArticle html-file="zhaojian-$date.html" />
EOF
      log "  ✓ MD: zhaojian-$date.md"
    fi

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

  for src_file in "$src_dir"/*-wechat-styled.html; do
    [ -f "$src_file" ] || continue

    local fname=$(basename "$src_file")
    local date=$(echo "$fname" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    [ -z "$date" ] && continue

    local dst_html="$dst_dir/prism-$date.html"
    local dst_md="$dst_dir/prism-$date.md"

    # 1. 复制 HTML 文件
    cp "$src_file" "$dst_html"
    log "  ✓ HTML: prism-$date.html"

    # 2. 读取源 md 提取标题
    local src_md="${src_file%-wechat-styled.html}.md"
    if [ -f "$src_md" ]; then
      local content=$(cat "$src_md")

      # 提取标题（第一个 ## 或 #）
      local title=$(echo "$content" | grep -E '^#{1,2} ' | head -1 | sed 's/^#* //' | cut -c1-100)
      [ -z "$title" ] && title="$date 棱镜"
      title=$(echo "$title" | tr -d '"' | tr -d "'" | tr -d '`')

      # 提取描述
      local desc=$(echo "$content" | sed -n '/^## /,$p' | grep -vE '^(#|##|\!\[\[)' | grep -v '^$' | head -1 | cut -c1-150)
      desc=$(echo "$desc" | tr -d '*' | tr -d '"' | cut -c1-100)

      cat > "$dst_md" << EOF
---
title: "棱镜 · $title"
date: $date
description: "$desc"
categories:
  - prism
tags:
  - 棱镜
  - 技术
  - AI
author: 银枢局
htmlFile: prism-$date.html
---

<HtmlArticle html-file="prism-$date.html" />
EOF
      log "  ✓ MD: prism-$date.md"
    fi

    ((count++))
  done

  log "棱镜同步完成，新增 $count 篇"
  return $count
}

# 推送到 GitHub
push_to_github() {
  cd "$BLOG_DIR"

  # 检查是否有变更
  if git diff --quiet && git diff --cached --quiet && [ -z "$(git status --porcelain | grep -v '^??')" ]; then
    log "没有新内容需要推送"
    return 0
  fi

  # 检查环境变量
  if [ -z "$GITHUB_PAT" ]; then
    echo "[$(date '+%H:%M:%S')] ❌ 错误: 未设置 GITHUB_PAT 环境变量"
    echo "请在 ~/.zshrc 中添加: export GITHUB_PAT='your_token_here'"
    exit 1
  fi

  log "构建并推送..."
  npm run build > /dev/null 2>&1
  cp -r .vitepress/dist/* .

  git add .
  git commit -m "sync: $(date '+%Y-%m-%d %H:%M') 文章同步（HTML样式版）" > /dev/null 2>&1
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
