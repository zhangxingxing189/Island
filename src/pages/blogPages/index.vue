<template>
  <div class="zhihu-container">
    <!-- 顶部导航栏 -->
    <header class="nav-bar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="知乎" @click="login()" />
      </div>
      <div class="search-box">
        <input
          type="text"
          placeholder="请输入搜索内容"
          v-model="searchText"
          @input="handleSearch"
        />
        <button class="search-btn">
          <i class="icon-search">搜索</i>
        </button>
      </div>
      <div class="user-info">
        <a-avatar
          :src="currentUser.avatar"
          :user="currentUser"
          @click="navigateToPersonalCenter"
        />
      </div>
    </header>

    <div class="main-content">
      <!-- 中间内容区 -->
      <div class="center-content">
        <!-- 选项卡导航 -->
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

        <!-- 内容切换区 -->
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

      <!-- 右侧创作中心 -->
      <div class="right-sidebar">
        <creation-center @create="handleCreate" />
        <salt-author-recommend :authors="saltAuthors" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useDebounceFn } from "@vueuse/core";
import ContentCard from "./ContentCard.vue";
import HotList from "./HotList.vue";
import CreationCenter from "./CreationCenter.vue";
import SaltAuthorRecommend from "./SaltAuthorRecommend.vue";
import { HotItem, ContentItem, CreateType } from "./blogInterface";
import { login } from "@/pages/home/UIFunction";
const router = useRouter();
const route = useRoute();

let islandName = route.query.islandName;
if (!islandName) {
  islandName = "island1";
  //默认值
}
// 内容数据
const followList = reactive<ContentItem[]>([]);
const recommendList = reactive<ContentItem[]>([]);
const hotList = reactive<HotItem[]>([]);
async function fetchData() {
  // 模拟异步数据获取,等后端写好调api获取数据
  followList.push(...mockFollowData);
  recommendList.push(...mockRecommendData);
  hotList.push(...mockHotData);
}

// 模拟数据（使用用户提供的图片链接）
const mockFollowData: ContentItem[] = [
  {
    id: 1,
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
    id: 2,
    title: "有哪些值得推荐的编程学习路线？",
    cover: "https://api.yimian.xyz/img",
    clickCount: 189,
    likes: 980,
    author: "技术大牛",
    authorID: 1,
    timestamp: "4小时前",
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

// 选项卡配置
const tabs = [
  { id: "follow", title: "关注" },
  { id: "recommend", title: "推荐" },
  { id: "hot", title: "热榜" },
];
const activeTab = ref("recommend");

// 搜索功能
const searchText = ref("");
const handleSearch = useDebounceFn((e: Event) => {
  console.log("Search:", searchText.value);
}, 300);

// 获取当前用户
let userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

// 互动操作
const handleLike = (item: ContentItem) => {
  console.log("Like item:", item.id);
};

// 创作中心操作
const handleCreate = (type: CreateType) => {
  router.push(`/creation/${type}`);
};

// 跳转到个人中心
const navigateToPersonalCenter = () => {
  router.push({
    name: "personalCenter",
  });
};
// // 添加路由配置
// router.addRoute({
//   path: "/article/:id",
//   component: ArticleDetail,
// });

// 初始化数据
onMounted(async () => {
  await fetchData();
});

// // 清理防抖计时器
// onUnmounted(() => {
//   handleSearch.cancel();
// });
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
  min-height: 100vh;
}

.nav-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  height: 64px;
  padding: 0 32px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-bar .logo img {
  height: 40px;
  transition: transform 0.3s ease;
}

.nav-bar .logo img:hover {
  transform: scale(1.05);
}

.search-box {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.search-box input {
  flex: 1;
  height: 40px;
  padding: 0 20px;
  border: none;
  background: #f6f6f6;
  border-radius: 24px 0 0 24px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  box-shadow: 0 0 0 1px var(--primary-color);
}

.search-box .search-btn {
  width: 48px;
  height: 40px;
  background: var(--primary-color);
  border: none;
  border-radius: 0 24px 24px 0;
  cursor: pointer;
  transition: background 0.3s;
}

.search-box .search-btn:hover {
  background: #006acc; /* 手动计算的较深蓝色 */
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

.right-sidebar {
  position: sticky;
  top: 96px;
  height: fit-content;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
    gap: 12px;
  }

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
