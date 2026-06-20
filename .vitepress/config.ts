import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '银枢局',
  titleTemplate: ':pageTitle · 银枢局',
  description: '全栈技术 · 产品思维 · AI工具 · 职场成长',

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo/inzu-logo.png' }],
    ['meta', { name: 'author', content: '银枢局' }],
    ['meta', { name: 'keywords', content: '技术博客, AI工具, 前端, 产品, 全栈, Vue, AI' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '银枢局' }],
    ['meta', { name: 'theme-color', content: '#2C3E50' }],
  ],

  themeConfig: {
    logo: '/logo/inzu-logo.png',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      {
        text: '内容',
        items: [
          { text: '📐 棱镜 · 技术', link: '/categories/prism' },
          { text: '🔭 朝鉴 · 趋势洞察', link: '/categories/zhaojian' },
        ],
      },
      { text: '🛠️ AI工具', link: '/tools/' },
      { text: '📱 订阅', link: '/subscribe/' },
      { text: '关于', link: '/about/' },
    ],

    sidebar: 'auto',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vonmrs' },
      { text: '公众号', link: 'https://mp.weixin.qq.com/', target: '_blank' },
    ],

    footer: {
      message: '© 2026 银枢局 · Design · Code · Think',
    },

    outline: {
      level: [2, 3],
      label: '目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
