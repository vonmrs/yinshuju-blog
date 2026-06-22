import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PostsList from './PostsList.vue'
import SearchPage from './SearchPage.vue'
import Md2Word from './Md2Word.vue'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('PostsList', PostsList)
    app.component('SearchPage', SearchPage)
    app.component('Md2Word', Md2Word)
  },
}
