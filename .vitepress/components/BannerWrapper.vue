<template>
  <PageBanner
    v-if="show && slides.length"
    :slides="slides"
    :interval="interval"
    banner-id="page-banner"
  />
</template>

<script setup lang="ts">
/**
 * 通铺 Banner 渲染组件。
 * 自判断当前路由是否为 banner 页，直接渲染，无需 provide/inject。
 * SSR 安全（v-if 基于 computed，运行时也有保障）。
 */
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import PageBanner from './PageBanner.vue'

const route = useRoute()

const isBannerPage = computed(() => {
  const p = route.path.replace(/\/+$/, '')
  return p === '/posts' || p === '/tools' || /^\/posts\/zhaojian$/.test(p)
})

const slides = computed(() => {
  const p = route.path.replace(/\/+$/, '')
  if (p === '/posts') {
    return [
      { tag: '📐 棱镜', title: '技术深度 · 认知升级', desc: '全栈技术 · 产品思维 · AI工具 · 职场成长', cta: '浏览全文', link: '/posts/' },
      { tag: '🔭 朝鉴', title: '荆州本地 · 经济洞察', desc: '荆州 news · 政策解读 · 项目机会 · 消费趋势', cta: '了解更多', link: '/posts/zhaojian/' },
    ]
  }
  if (p === '/tools') {
    return [
      { tag: '🎬 AI 内容创作', title: '剧能AI · 短剧剧本一键生成', desc: '输入题材与设定，AI 自动生成完整短剧剧本——人物小传、分集大纲、逐集正文，含悬念钩子，直达付费解锁点', cta: '立即体验', link: '/tools/duanju/' },
      { tag: '🔧 开发工具', title: 'MD 转 Word · 无损转换', desc: 'Markdown 一键转 Word 文档，完整保留标题层级、表格、代码块、列表格式，无需手动调整格式', cta: '立即使用', link: '/tools/md2word/' },
    ]
  }
  if (/^\/posts\/zhaojian$/.test(p)) {
    return [
      { tag: '🔭 朝鉴', title: '荆州本地 · 经济洞察', desc: '荆州 news · 政策解读 · 项目机会 · 消费趋势 —— 银枢局出品', cta: '了解更多', link: '/posts/' },
    ]
  }
  return []
})

const show = computed(() => isBannerPage.value && slides.value.length > 0)
const interval = computed(() => route.path.includes('/zhaojian') ? 0 : 4500)
</script>
