import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PostsList from './PostsList.vue'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('PostsList', PostsList)
  },
}
