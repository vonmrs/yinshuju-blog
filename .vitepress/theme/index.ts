import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PostsList from './PostsList.vue'
import SearchPage from './SearchPage.vue'
import Md2Word from './Md2Word.vue'
import SiteFooter from './SiteFooter.vue'
import GitHubIcon from './GitHubIcon.vue'
import DuanjuTool from '../components/DuanjuTool.vue'
import PageBanner from '../components/PageBanner.vue'
import LoginGate from './LoginGate.vue'
import ZhaojianGate from './ZhaojianGate.vue'
import { isAuthed } from './useAuth'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    // 注册全局组件
    app.component('PostsList', PostsList)
    app.component('SearchPage', SearchPage)
    app.component('Md2Word', Md2Word)
    app.component('SiteFooter', SiteFooter)
    app.component('GitHubIcon', GitHubIcon)
    app.component('DuanjuTool', DuanjuTool)
    app.component('PageBanner', PageBanner)
    app.component('LoginGate', LoginGate)
    app.component('ZhaojianGate', ZhaojianGate)

    // 文章详情页网关：未登录(未关注)则跳转登录页
    // VitePress Router 提供 onBeforeRouteChange(href) => boolean，返回 false 取消导航
    if (router && typeof router.onBeforeRouteChange === 'function') {
      router.onBeforeRouteChange((href: string) => {
        if (isAuthed()) return true
        // 仅拦截「文章详情页」：/posts/<prism|zhaojian>/<slug>/
        // 排除列表页 /posts/prism/ 与 /posts/prism/index.html
        if (/^\/posts\/(prism|zhaojian)\/[^/]+\/?$/.test(href) && !/\/index\.html$/.test(href)) {
          const loginUrl = '/login/?redirect=' + encodeURIComponent(href)
          router.go(loginUrl)
          return false
        }
        return true
      })
    }
  },
}
