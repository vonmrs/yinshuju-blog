#!/usr/bin/env python3
# 棱镜文章同步 v3：以 news/tech-afternoon/*.md 为数据源，
# 生成纯 markdown 的 posts/prism/prism-YYYY-MM-DD.md（不再依赖 HtmlArticle）。
import os, re, glob

NEWS_DIR = "/Users/von/Desktop/QClaw_doc/news/tech-afternoon"
DST_DIR = "/Users/von/Desktop/QClaw_doc/yinshuju/blog/posts/prism"
SKIP_PREFIX = ('#', '>', '!', '|', '*', '-', '`', ' ')

os.makedirs(DST_DIR, exist_ok=True)


def parse(src_path):
    with open(src_path, encoding='utf-8') as f:
        text = f.read()
    if text.startswith('---'):  # 去掉可能存在的 frontmatter
        text = re.sub(r'^---.*?---\s*', '', text, count=1, flags=re.S)
    lines = text.splitlines()
    h1 = next((i for i, ln in enumerate(lines) if ln.startswith('# ')), None)
    if h1 is None:
        title = os.path.basename(src_path).rsplit('.', 1)[0]
        body = text.strip()
        rest = lines
    else:
        title = lines[h1][2:].strip()
        body = '\n'.join(lines[h1:]).strip()
        rest = lines[h1 + 1:]
    title = title.replace('"', "'")  # 防 YAML 双引号字符串断裂
    desc = title
    for ln in rest:
        s = ln.strip()
        if s and not s.startswith(SKIP_PREFIX):
            desc = s
            break
    return title, body, desc[:100].replace('"', "'")


n = 0
for src in sorted(glob.glob(os.path.join(NEWS_DIR, '*.md'))):
    m = re.search(r'(\d{4}-\d{2}-\d{2})', os.path.basename(src))
    if not m:
        continue
    date = m.group(1)
    title, body, desc = parse(src)
    out = f"""---
title: "棱镜 · {title}"
date: {date}
description: "{desc}"
categories:
  - prism
tags:
  - 棱镜
  - 技术
  - AI
author: 银枢局
---

{body}
"""
    with open(os.path.join(DST_DIR, f"prism-{date}.md"), 'w', encoding='utf-8') as f:
        f.write(out)
    n += 1
print(f"done: 生成 {n} 篇棱镜文章")
