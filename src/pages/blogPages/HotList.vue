<template>
  <div class="hot-list-container">
    <div class="hot-list">
      <div v-for="(item, index) in items" :key="index" class="hot-item">
        <div class="rank-wrapper">
          <span
            class="rank"
            :class="{
              top1: item.rank === 1,
              top2: item.rank === 2,
              top3: item.rank === 3,
            }"
          >
            {{ item.rank }}
          </span>
        </div>
        <a
          :href="item.url"
          class="title"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ item.title }}
        </a>
        <span class="heat">
          {{ formatHeat(item.heat) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HotItem } from "@/pages/blogPages/blogInterface";

const props = defineProps<{
  items: HotItem[];
}>();

// 热度值格式化
const formatHeat = (heat: number) => {
  if (heat >= 10000) {
    return `${(heat / 10000).toFixed(1)}万`;
  }
  return heat.toString();
};
</script>

<style scoped>
.hot-list-container {
  --primary-color: #0084ff;
  --top1-bg: #ffe6e6;
  --top2-bg: #fff3e6;
  --top3-bg: #e6f4ff;
  --text-primary: #1a1a1a;
  --text-secondary: #8590a6;
  --border-color: #f0f2f4;
  overflow-y: auto;
}

.hot-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-item:hover {
  background-color: #f8f9fa;
}

.rank-wrapper {
  width: 40px;
  text-align: center;
}

.rank {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: var(--text-secondary);
  font-size: 14px;
}

.rank.top1 {
  background-color: var(--top1-bg);
  color: #ff4d4f;
}

.rank.top2 {
  background-color: var(--top2-bg);
  color: #ff7a45;
}

.rank.top3 {
  background-color: var(--top3-bg);
  color: var(--primary-color);
}

.title {
  flex: 1;
  margin: 0 16px;
  color: var(--text-primary);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title:hover {
  color: var(--primary-color);
}

.heat {
  width: 80px;
  text-align: right;
  color: var(--text-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .hot-item {
    padding: 12px;
  }

  .rank-wrapper {
    width: 32px;
  }

  .title {
    margin: 0 12px;
    font-size: 14px;
  }

  .heat {
    width: 60px;
    font-size: 12px;
  }
}
</style>
