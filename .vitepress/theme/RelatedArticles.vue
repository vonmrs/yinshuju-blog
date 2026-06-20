<template>
  <div class="related-articles" v-if="relatedPosts.length > 0">
    <div class="related-title">相关文章</div>
    <div class="related-list">
      <a v-for="post in relatedPosts" :href="post.url" class="related-item">
        <div class="related-meta">
          <span class="related-category">{{ post.category }}</span>
          <span class="related-date">{{ post.date }}</span>
        </div>
        <div class="related-post-title">{{ post.title }}</div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Post {
  title: string
  date: string
  category: string
  url: string
}

const relatedPosts = ref<Post[]>([])

function loadRelatedPosts() {
  if (typeof window === 'undefined') return

  // 从页面 frontmatter 获取当前文章信息
  const frontmatter = (window as any).__VITEPRESS__PAGE_FRONTMATTER__
  if (!frontmatter) return

  const currentCategory = frontmatter.categories?.[0] || ''
  const currentTitle = frontmatter.title || ''

  // 从 posts-meta.json 加载所有文章元数据
  fetch('/posts-meta.json')
    .then(res => res.json())
    .then((allPosts: Post[]) => {
      // 过滤出同分类的文章，排除当前文章
      const related = allPosts
        .filter(post => 
          post.category === currentCategory && 
          post.title !== currentTitle
        )
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3)
      
      relatedPosts.value = related
    })
    .catch(err => {
      console.warn('Failed to load related posts:', err)
    })
}

onMounted(() => {
  // 延迟加载，避免阻塞
  setTimeout(loadRelatedPosts, 500)
})
</script>

<style scoped>
.related-articles {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.related-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.related-item {
  display: block;
  padding: 0.8rem;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.2s;
}

.related-item:hover {
  border-color: var(--inzu-gold);
  background: var(--vp-c-bg-mute);
}

.related-meta {
  display: flex;
  gap: 0.8rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.3rem;
}

.related-category {
  background: rgba(201, 168, 76, 0.15);
  color: var(--inzu-gold);
  padding: 0.1rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

.related-date {
  color: var(--vp-c-text-3);
}

.related-post-title {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}
</style>
