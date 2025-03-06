<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="showAnimation" key="animation" class="animation-container">
        加载动画...
      </div>
      <div v-else key="content">
        <h1>欢迎来到博客页面</h1>
        <p>这里是博客内容。</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const showAnimation = ref(false);

// 判断是否从根路径跳转
const isFromRoot = route.query.from === "/";

// 判断是否是直接访问或刷新页面
const isDirectAccess = !route.query.from;

if (isFromRoot && !isDirectAccess) {
  showAnimation.value = true;

  // 模拟动画结束后隐藏
  setTimeout(() => {
    showAnimation.value = false;
  }, 2000); // 动画持续 2 秒
}
</script>

<style scoped>
.animation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #333;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
