<template>
  <Head></Head>
  <div class="quiz-container">
    <h2>选择挑战模式</h2>
    <div class="mode-select">
      <div class="mode-card" @click="selectMode('practice')">
        <i class="iconfont icon-shu"></i>
        <h3>普通刷题</h3>
        <p>海量题库随时练习</p>
      </div>

      <div class="mode-card" @click="selectMode('pk')">
        <i class="iconfont icon-shandian1"></i>
        <h3>实时PK</h3>
        <p>与其他用户实时对战</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Head from "@/pages/blogPages/index.vue";

const router = useRouter();

const selectMode = (modeType: "practice" | "pk") => {
  router.push({
    path: "/quiz",
    query: { mode: modeType },
  });
};
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.mode-select {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.mode-card {
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}

.iconfont {
  font-size: 3rem;
  color: #1890ff;
}
</style>
