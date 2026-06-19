<template>
  <Layout>
    <template #doc-after>
      <Giscus />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Giscus from './Giscus.vue'

const { Layout } = DefaultTheme
</script>
