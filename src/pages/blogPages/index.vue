<template>
  <div class="zhihu-container">
    <!-- 顶部导航栏 -->
    <header class="nav-bar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="知乎" @click="login" />
      </div>
      <div class="search-box">
        <input
          type="text"
          placeholder="请输入搜索内容"
          v-model="searchText"
          @input="handleSearch"
          class="search-input"
        />
        <button class="icon-search-btn iconfont icon-sousuo"></button>
      </div>
      <div class="action-buttons">
        <div class="publish-btn" @click="handlePublishClick" style="margin-right: 20px">
          <i class="iconfont icon-jurassic_edit-user"></i>
          <p>发布</p>
        </div>
        <div class="publish-btn" @click="handleQuizClick">
          <i class="iconfont"><img src="@/assets/images/题库.png" alt="题库" style="width: 22px"></i>
          <p>刷题</p>
        </div>
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
import { HotItem, ContentItem, CreateType } from "./blogInterface";
import { login } from "@/pages/home/UIFunction";
import "@/assets/font/iconfont.css";
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
//发布跳转
const handlePublishClick = () => {
  router.push("/publish");
};


// 跳转到个人中心
const navigateToPersonalCenter = () => {
  router.push({
    name: "personalCenter",
  });
};
//刷题选择界面跳转
const handleQuizClick = () => {
  router.push('/quiz');
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
  display: flex;
  grid-template-columns: auto minmax(100px, 1200px) repeat(3, auto);
  align-items: center;
  gap: 24px;
  height: 64px;
  padding: 0 32px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  justify-content: space-between;
}

.nav-bar .logo img {
  height: 40px;
  transition: transform 0.3s ease;
}

.nav-bar .logo img:hover {
  transform: scale(1.05);
}

.search-box {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 40px 0 20px;
  border: none;
  background: #f6f6f6;
  border-radius: 24px;
  font-size: 14px;
}
.icon-search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8590a6;
  font-size: 20px;
  padding: 0 12px;
  cursor: pointer;
  transition: color 0.3s;
}
.icon-search-btn:hover {
  color: var(--primary-color);
}

.search-box input:focus {
  box-shadow: 0 0 0 1px var(--primary-color);
}
.action-buttons {
  display: flex;
  align-items: center;
  gap: 15px; /* 控制按钮间距 */
}
.publish-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: var(--primary-color);

    i {
      transform: scale(1.1);
    }
  }

  i {
    font-size: 22px;
    margin-bottom: 1px;
    transition: transform 0.3s;
  }

  p {
    font-size: 10px;
    line-height: 1;
    transform: translateY(-1px);
    margin: 0;
  }
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
