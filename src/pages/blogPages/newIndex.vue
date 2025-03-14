<script setup lang="ts">
import Header from "@/pages/blogPages/index.vue";
</script>

<template>
  <div class="blog">
    <Header></Header>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.main {
  height: calc(100vh - 64px);
}
</style>
