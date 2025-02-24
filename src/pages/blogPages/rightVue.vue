<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 定义功能项数据
const features = ref([
  {
    name: "竞技",
    image: "@/assets/image/compete.png", // 替换为实际图片路径
    link: "/computer/compete",
  },
  {
    name: "刷题闯关",
    image: "@/assets/image/quiz.png", // 替换为实际图片路径
    link: "/computer/quiz",
  },
  {
    name: "AI问答",
    image: "@/assets/image/ai-qa.png", // 替换为实际图片路径
    link: "/computer/ai-qa",
  },
  {
    name: "传送",
    image: "@/assets/image/transfer.png", // 替换为实际图片路径
    link: "/computer/transfer",
  },
]);

// 点击功能项跳转页面
const goToPage = (link) => {
  router.push(link);
};
</script>

<template>
  <div class="content-right">
    <!-- 原有的内容 -->
    <div class="sidebar-creator card">
      <div class="creator-hd">
        <span class="creator-title">功能</span>
      </div>
      <hr class="creator-divider" />
      <div class="creator-bd">
        <!-- 新增功能项 -->
        <div class="feature-box">
          <div
            v-for="feature in features"
            :key="feature.name"
            class="feature-item"
            @click="goToPage(feature.link)"
          >
            <span>{{ feature.name }}</span>
            <img :src="feature.image" alt="feature.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc; /* 添加分隔线 */
  margin-top: 10px;
}

.feature-item img {
  width: 30px;
  height: 30px;
  margin-top: 10px;
}

.creator-title {
  text-align: center;
  width: 100%;
  font-size: 30px;
}

.creator-divider {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin-top: 15px;
}
</style>
