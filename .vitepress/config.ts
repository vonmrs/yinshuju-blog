import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '银枢局',
  titleTemplate: ':pageTitle · 银枢局',
  description: '全栈技术 · 产品思维 · AI工具 · 职场成长',
  appearance: true,
  base: '/',

  head: [
    // 基础 Meta 标签
    ['link', { rel: 'icon', type: 'image/png', href: '/logo/inzu-logo.png' }],
    ['meta', { name: 'author', content: '银枢局' }],
    ['meta', { name: 'keywords', content: '技术博客, AI工具, 前端, 产品, 全栈, Vue, AI, 银枢局' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'theme-color', content: '#2C3E50' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    
    // 不蒜子阅读量统计
    ['script', { src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js', async: true, defer: true }],

    // Open Graph 标签
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '银枢局' }],
    ['meta', { property: 'og:title', content: ':title · 银枢局' }],
    ['meta', { property: 'og:description', content: ':description' }],
    ['meta', { property: 'og:url', content: 'https://inzu.com.cn' }],
    ['meta', { property: 'og:image', content: 'https://inzu.com.cn/logo/inzu-logo.png' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],

    // Twitter Card 标签
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: ':title · 银枢局' }],
    ['meta', { name: 'twitter:description', content: ':description' }],
    ['meta', { name: 'twitter:image', content: 'https://inzu.com.cn/logo/inzu-logo.png' }],

    // 结构化数据 (JSON-LD)
    ['script', { type: 'application/ld+json' }, `
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "银枢局",
        "url": "https://inzu.com.cn",
        "description": "全栈技术 · 产品思维 · AI工具 · 职场成长",
        "publisher": {
          "@type": "Organization",
          "name": "银枢局",
          "logo": "https://inzu.com.cn/logo/inzu-logo.png"
        }
      }
    `],
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
      { text: '搜索', link: '/search/' },
      { text: '关于', link: '/about/' },
    ],

    sidebar: 'auto',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vonmrs' },
    ],

    outline: {
      level: [2, 3],
      label: '目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },

  // Sitemap 配置
  sitemap: {
    hostname: 'https://blog.inzu.com.cn',
    outDir: '.vitepress/dist',
    exclude: ['/404.html'],
  },
})
