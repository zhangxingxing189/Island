<template>
  <div class="personal-homepage">
    <!-- 头部区域 -->
    <header class="header">
      <div class="cover">
        <div class="cover-upload">点击上传封面</div>
      </div>
      <div class="profile">
        <div class="avatar-container">
          <img :src="userInfo.avatar" class="avatar" alt="用户头像" />
          <div class="nickname-ip">
            <h1 class="nickname">{{ userInfo.nickname }}</h1>
            <span class="ip">属地：{{ userInfo.ipLocation }}</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn edit-btn">编辑资料</button>
          <a href="#" class="detail-link">查看详细资料</a>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="main-container">
      <!-- 左侧主内容 -->
      <main class="main-content">
        <!-- 导航栏 -->
        <nav class="navigation">
          <ul class="nav-list">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </li>
          </ul>
        </nav>

        <!-- 动态列表 -->
        <div class="dynamic-list">
          <div
            v-for="(item, index) in filteredDynamics"
            :key="index"
            class="dynamic-item"
          >
            <div class="dynamic-header">
              <span class="dynamic-type">{{ item.type }}</span>
              <time class="dynamic-time">{{ item.time }}</time>
            </div>
            <h3 class="dynamic-title">{{ item.title }}</h3>
            <p class="dynamic-content">
              {{ item.showMore ? item.content : item.content.slice(0, 100) }}
              <span
                v-if="item.content.length > 100"
                class="toggle-more"
                @click="item.showMore = !item.showMore"
              >
                {{ item.showMore ? "收起" : "展开全文" }}
              </span>
            </p>
          </div>
        </div>
      </main>

      <!-- 右侧侧边栏 -->
      <aside class="sidebar">
        <div class="stats-card">
          <h3 class="stats-title">创作中心</h3>
          <button class="btn create-btn">开始创作</button>
          <div class="follower-stats">
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.following }}</span>
              <span class="stat-label">关注</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.followers }}</span>
              <span class="stat-label">粉丝</span>
            </div>
          </div>
        </div>

        <div class="quick-links">
          <h3 class="links-title">我的关注</h3>
          <div class="link-item">
            <span class="link-name">话题</span>
            <span class="link-count">12</span>
          </div>
          <div class="link-item">
            <span class="link-name">专栏</span>
            <span class="link-count">3</span>
          </div>
          <div class="link-item">
            <span class="link-name">收藏夹</span>
            <span class="link-count">8</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";

// 类型定义
interface UserInfo {
  avatar: string;
  nickname: string;
  ipLocation: string;
  following: number;
  followers: number;
}

interface DynamicItem {
  id: number;
  type: string;
  title: string;
  content: string;
  time: string;
  showMore: boolean;
}

// 用户信息
const userInfo = reactive<UserInfo>({
  avatar: "https://api.yimian.xyz/img",
  nickname: "开发者",
  ipLocation: "东莞",
  following: 234,
  followers: 4567,
});

// 导航标签
const tabs = [
  { id: "dynamic", name: "动态" },
  // { id: "answer", name: "回答" },
  { id: "video", name: "视频" },
  // { id: "question", name: "提问" },
  { id: "article", name: "文章" },
  { id: "column", name: "专栏" },
  { id: "idea", name: "想法" },
  { id: "collection", name: "收藏" },
  { id: "subscription", name: "关注订阅" },
];

const activeTab = ref("dynamic");

// 动态数据
const dynamics = reactive<DynamicItem[]>([
  {
    id: 1,
    type: "关注了问题",
    title: "如何评价Vue3的Composition API？",
    content:
      "Vue3的Composition API为开发者提供了更灵活的逻辑组织方式，相比Options API有以下优势...（此处省略200字）",
    time: "2024-02-21 14:30",
    showMore: false,
  },
  // 更多动态数据...
]);

// 过滤后的动态列表
const filteredDynamics = computed(() => {
  return dynamics.filter((item) => item.type === activeTab.value);
});
</script>

<style>
:root {
  --primary-color: #0084ff;
  --text-primary: #1a1a1a;
  --text-secondary: #8590a6;
  --border-color: #f0f2f4;
  --bg-color: #ffffff;
  --hover-bg: #f5f5f5;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --radius: 4px;
}

.personal-homepage {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-color);
}

/* 头部样式 */
.header {
  position: relative;
  margin-bottom: 20px;
}

.cover {
  height: 200px;
  background: #f0f2f4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  cursor: pointer;
}

.profile {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 24px;
  transform: translateY(-40px);
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
}

.nickname {
  margin: 0;
  font-size: 24px;
}

.ip {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 导航栏 */
.navigation {
  border-bottom: 1px solid var(--border-color);
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  padding: 12px 20px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.nav-list li:hover,
.nav-list li.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

/* 主体布局 */
.main-container {
  display: flex;
  gap: 24px;
  padding: 0 24px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 300px;
}

/* 动态列表 */
.dynamic-item {
  padding: 16px;
  margin-bottom: 16px;
  background: var(--bg-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.dynamic-time {
  color: var(--text-secondary);
  font-size: 12px;
}

.toggle-more {
  color: var(--primary-color);
  cursor: pointer;
}

/* 侧边栏卡片 */
.stats-card {
  padding: 16px;
  background: var(--bg-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}

.follower-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 18px;
  font-weight: bold;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 12px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: var(--primary-color);
  color: white;
}

.create-btn {
  width: 100%;
  background: linear-gradient(90deg, #0084ff, #00a1ff);
  color: white;
  margin: 12px 0;
}

.btn:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    padding: 0 12px;
  }

  .sidebar {
    width: 100%;
  }

  .nav-list {
    overflow-x: auto;
  }
}
</style>
