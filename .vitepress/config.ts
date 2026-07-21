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
          { text: '🔭 朝鉴 · 趋势洞察', link: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=YOUR_WECHAT_BIZ_ID&scene=126#wechat_redirect' },
        ],
      },
      { text: '🛠️ AI工具', link: '/tools/' },
      { text: '📱 订阅', link: '/subscribe/' },
      { text: '搜索', link: '/search/' },
      { text: '关于', link: '/about/' },
    ],

    sidebar: 'auto',


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
    transformItems(items) {
      return items.filter((item) => {
        const u = item.url || ''
        // 此时 item.url 为相对路径(如 login/ 或 404.html，无 hostname)
        return !/(?:^|\/)login\/?$/.test(u) && !/(?:^|\/)404\.html$/.test(u)
      })
    },
  },

  // SSR 级页面重定向（服务端直接返回含 meta refresh 的 HTML，浏览器立即跳转，无 flash）
  transformHtml(html, id) {
    const bizId = 'YOUR_WECHAT_BIZ_ID'
    const dest = `https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=${bizId}&scene=126#wechat_redirect`
    const refreshTag = `<meta http-equiv="refresh" content="0;url=${dest}">`
    // 匹配 /posts/zhaojian/ 列表页 和 /categories/zhaojian 分类页
    const isZhaojianList = /\/(posts\/zhaojian\/index|categories\/zhaojian)\.html$/.test(id)
    if (!isZhaojianList) return
    return html.replace('</head>', `${refreshTag}</head>`)
  },
})
