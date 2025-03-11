<template>
  <div class="zhihu-container">
    <div class="main-content">
      <div class="center-content">
        <div class="tab-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.title }}
          </button>
        </div>

        <section class="content-section">
          <!-- 关注内容 -->
          <template v-if="activeTab === 'follow'">
            <h3 class="section-title">关注动态</h3>
            <content-card
              v-for="item in followList"
              :key="item.id"
              :data="item"
              @like="handleLike"
            />
          </template>

          <!-- 推荐内容 -->
          <template v-if="activeTab === 'recommend'">
            <h3 class="section-title">热门推荐</h3>
            <content-card
              v-for="item in recommendList"
              :key="item.id"
              :data="item"
              @like="handleLike"
            />
          </template>

          <!-- 热榜内容 -->
          <template v-if="activeTab === 'hot'">
            <h3 class="section-title">实时热榜</h3>
            <hot-list :items="hotList" />
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import ContentCard from "./ContentCard.vue";
import HotList from "./HotList.vue";
import { HotItem, ContentItem } from "./blogInterface";

// 选项卡配置
const tabs = [
  { id: "follow", title: "关注" },
  { id: "recommend", title: "推荐" },
  { id: "hot", title: "热榜" },
];
const activeTab = ref("recommend");

// 内容数据
const followList = reactive<ContentItem[]>([]);
const recommendList = reactive<ContentItem[]>([]);
const hotList = reactive<HotItem[]>([]);

// 模拟数据（使用用户提供的图片链接）
const mockFollowData: ContentItem[] = [
  {
    id: 2,
    title: "如何评价2023年人工智能发展趋势？",
    cover: "https://api.yimian.xyz/img",
    clickCount: 256,
    likes: 1500,
    author: "AI研究员",
    authorID: 1,
    timestamp: "2小时前",
  },
];

const mockRecommendData: ContentItem[] = [
  {
    id: 12,
    title: "如何评价2023年人工智能发展趋势？",
    cover: "https://api.yimian.xyz/img",
    clickCount: 256,
    likes: 1500,
    author: "AI研究员",
    authorID: 1,
    timestamp: "2小时前",
  },
];

const mockHotData: HotItem[] = [
  {
    rank: 1,
    title: "如何理解量子计算的最新突破？",
    heat: 15000,
    url: "#",
    contentItemID: 1,
  },
];
async function fetchData() {
  followList.push(...mockFollowData);
  recommendList.push(...mockRecommendData);
  hotList.push(...mockHotData);
}

const handleLike = (item: ContentItem) => {
  console.log("Like item:", item.id);
};

onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
.zhihu-container {
  --primary-color: #0084ff;
  --text-primary: #1a1a1a;
  --text-secondary: #8590a6;
  --border-color: #ebebeb;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 1440px;
  margin: 0 auto;
  background: #f8f9fa;
  overflow: auto;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  padding: 32px;
}

.center-content {
  background: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
}

.tab-nav {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
}

.tab-nav .tab-item {
  padding: 12px 0;
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  border: none;
  background: none;
}

.tab-nav .tab-item::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.tab-nav .tab-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

.tab-nav .tab-item.active::after {
  width: 100%;
}

.tab-nav .tab-item:hover {
  color: var(--primary-color);
}

.content-section .section-title {
  font-size: 20px;
  margin-bottom: 24px;
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .tab-nav {
    gap: 16px;
  }

  .tab-nav .tab-item {
    font-size: 14px;
    padding: 8px 0;
  }
}
</style>
