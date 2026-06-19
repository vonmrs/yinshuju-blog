import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '银枢局',
  titleTemplate: '%s - 银枢局',
  description: '全栈技术 · 产品思维 · 职场成长',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo/inzu-logo.png' }],
    ['meta', { name: 'author', content: '银枢局' }],
    ['meta', { name: 'keywords', content: '技术博客, 前端, 后端, 产品, 全栈, Vue, AI' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '银枢局' }],
  ],
  themeConfig: {
    logo: '/logo/inzu-logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      {
        text: '专栏',
        items: [
          { text: '棱镜 · 技术', link: '/categories/prism' },
          { text: '朝鉴 · 趋势洞察', link: '/categories/chaojian' },
          { text: '毒舌晚报', link: '/categories/dushe' },
        ],
      },
      { text: '关于', link: '/about/' },
      { text: '友链', link: '/links/' },
    ],
    sidebar: 'auto',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vonmrs' },
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
  srcDir: '.',
})
