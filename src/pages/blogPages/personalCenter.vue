<template>
  <div id="personalCenter">
    <div class="personal-homepage">
      <!-- 头部区域 -->
      <header class="header">
        <div class="banner-container">
          <!--        <div class="cover-upload">点击上传封面</div>-->
          <img
            class="adaptive-image"
            src="http://118.31.119.216:8080/uploads/ba3f3138bb3d09039baffbd2dc8bab0c.jpeg"
            alt="点击上传封面"
          />
        </div>
        <div class="profile">
          <div class="avatar-container">
            <img :src="userInfo.avatar" class="avatar" alt="用户头像" />
            <div class="nickname-ip">
              <h1 class="nickname">{{ userInfo.username }}</h1>
              <span class="ip">属地：{{ userInfo.ipLocation }}</span>
            </div>
          </div>
          <!--        <div class="actions">
          <button class="btn edit-btn">编辑资料</button>
          <a href="#" class="detail-link">查看详细资料</a>
        </div>-->
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
            <!-- 在此处添加关注列表模板 -->
            <template v-if="activeTab === 'focus'">
              <div v-if="isLoading" class="loading">加载中...</div>
              <div v-else-if="!followList?.length" class="empty">
                暂无关注用户
              </div>
              <div
                v-for="item in followList"
                :key="item.user_id"
                class="follow-item"
              >
                <img
                  :src="item.avatar || '/default-avatar.png'"
                  class="follow-avatar"
                  alt="用户头像"
                />
                <div class="follow-info">
                  <h4 class="follow-name">{{ item.username }}</h4>
                  <p v-if="item.latest_article" class="latest-article">
                    {{ item.latest_article.title }}
                  </p>
                </div>
              </div>
            </template>
            <template v-else-if="activeTab === 'article'">
              <div v-if="isLoading" class="loading">加载中...</div>
              <div v-else-if="articleList?.length === 0" class="empty">
                暂无发表文章
              </div>
              <div
                v-for="article in articleList"
                :key="article.id"
                class="article-item"
              >
                <div class="article-cover" v-if="article.cover">
                  <img :src="article.cover" alt="文章封面" />
                </div>
                <div class="article-content">
                  <router-link
                    :to="`/island/article/${article.id}`"
                    class="article-title"
                  >
                    {{ article.title }}
                  </router-link>
                  <p class="article-abstract">{{ article.abstract }}</p>

                  <div class="article-meta">
                    <el-button @click.stop="showDeleteDialog(article.id)"
                      >删除</el-button
                    >
                    <span class="digg-count">❤️ {{ article.digg_count }}</span>
                    <span class="collect-count"
                      >⭐ {{ article.collect_count }}</span
                    >
                    <time class="create-time">{{
                      formatDate(article.created_at)
                    }}</time>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="activeTab === 'collection'">
              <div v-if="isLoading" class="loading">加载中...</div>
              <div v-else-if="collectList?.length === 0" class="empty">
                暂无收藏内容
              </div>
              <div
                v-for="item in collectList"
                :key="item.id"
                class="article-item"
              >
                <div class="article-cover" v-if="item.cover">
                  <img :src="item.cover" alt="文章封面" />
                </div>
                <div class="article-content">
                  <router-link
                    :to="`/island/article/${item.id}`"
                    class="article-title"
                  >
                    {{ item.title }}
                  </router-link>
                  <p class="article-abstract">{{ item.abstract }}</p>
                  <div class="article-meta">
                    <el-button @click.stop="showUncollectDialog(item.id)"
                      >取消收藏</el-button
                    >
                    <span class="digg-count">❤️ {{ item.digg_count }}</span>
                    <span class="collect-count"
                      >⭐ {{ item.collect_count }}</span
                    >
                    <time class="create-time">{{
                      formatDate(item.created_at)
                    }}</time>
                  </div>
                </div>
              </div>
            </template>
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
            <button class="btn create-btn" @click="handlePublish">
              开始创作
            </button>
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

          <!--        <div class="quick-links">
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
        </div>-->
        </aside>
      </div>
    </div>
    <div v-if="isDeleteDialogVisible" class="custom-dialog-mask">
      <div class="custom-dialog">
        <h3>确认删除文章吗？</h3>
        <div class="dialog-buttons">
          <button @click="confirmDelete" class="confirm-btn">确认删除</button>
          <button @click="cancelDelete" class="cancel-btn">取消操作</button>
        </div>
      </div>
    </div>
    <!--  <div v-if="showCustomDialog" class="custom-dialog-mask">
    <div class="custom-dialog" :class="dialogType">
      <div class="dialog-header">
        <h3>{{ dialogTitle }}</h3>
      </div>
      <div class="dialog-body">
        <p>{{ dialogMessage }}</p>
      </div>
      <div class="dialog-footer">
        <template v-if="dialogTitle === '删除确认'">
          <button class="btn cancel-btn" @click="showCustomDialog = false">取消</button>
          <button class="btn confirm-btn" @click="confirmDelete">确认删除</button>
        </template>
        <button v-else class="btn confirm-btn" @click="showCustomDialog = false">确定</button>
      </div>
    </div>
  </div>-->
    <
    <div v-if="showCustomDialog" class="custom-dialog-mask">
      <div class="custom-dialog" :class="dialogType">
        <div class="dialog-body">
          <p>{{ dialogMessage }}</p>
        </div>
        <div class="dialog-footer">
          <template v-if="dialogType === 'error'">
            <button class="btn cancel-btn" @click="showCustomDialog = false">
              取消
            </button>
            <button class="btn confirm-btn" @click="handleUncollect">
              确认
            </button>
          </template>
          <button
            v-else
            class="btn confirm-btn"
            @click="showCustomDialog = false"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import {
  ArticleListItem,
  collectArticle,
  deleteArticle,
  getArticleList,
  getOwnerArticleList,
  getOwnerCollectArticles,
} from "@/api/articleApi";
import { ElNotification } from "element-plus";
import { FollowItem, getFansCount, getFollowList } from "@/api/focusApi";
import { ContentItem } from "@/pages/blogPages/blogInterface";
import { formatTime } from "@/utils/formatters";
const router = useRouter();
const userStore = useUserStore();
console.log(userStore.currentUser);

const user_id = ref(userStore.currentUser.user_id);
console.log(user_id.value);
const handlePublish = () => {
  router.push({ name: "publish" });
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
// 类型定义
interface UserInfo {
  avatar: string;
  username: string;
  atoken: string;
  rtoken: string;
  user_id: string;
  ipLocation: string;
}

interface DynamicItem {
  id: number;
  type: string;
  title: string;
  content: string;
  time: string;
  showMore: boolean;
}
const activeTab = ref("focus");
//const activeTab = ref("dynamic");
const followList = ref<FollowItem[]>([]);
const articleList = ref<ArticleListItem[]>([]);
const collectList = ref<ArticleListItem[]>([]);
const isLoading = ref(false);

// 加载关注列表
const loadFollows = async () => {
  try {
    isLoading.value = true;
    const res = await getFollowList({
      user_id: user_id.value,
      limit: 10,
    });
    console.log(res);
    followList.value = res.data?.list?.length ? res.data.list : [];
    userInfo.following = followList.value.length;
  } catch (error) {
    ElNotification.error({ title: "错误", message: "关注列表加载失败" });
    followList.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 加载我的文章
const loadArticles = async () => {
  try {
    isLoading.value = true;
    let page = 1;
    let allArticles = [];

    while (true) {
      const res = await getOwnerArticleList({
        user_id: user_id.value,
        page,
      });

      if (res.data.list.length === 0) break;

      allArticles = [...allArticles, ...res.data.list];
      page++;

      if (res.data.list.length < 10) break;
    }

    articleList.value = allArticles;
  } finally {
    isLoading.value = false;
  }
};

// 监听标签切换
watchEffect(() => {
  switch (activeTab.value) {
    case "focus":
      loadFollows();
      break;
    case "article":
      loadArticles();
      break;
    case "collection":
      loadCollections();
      break;
  }
});
// 用户信息
const user = useUserStore();
const userInfo = reactive<UserInfo>({
  avatar: user.currentUser?.avatar || require("@/assets/QQ.svg"),
  username: user.currentUser?.username || "未登录用户",
  ipLocation: "东莞",
  following: followList.value.length,
  followers: 0,
});

// 导航标签
const tabs = [
  // { id: "dynamic", name: "动态" },
  // { id: "answer", name: "回答" },
  //{ id: "video", name: "视频" },
  // { id: "question", name: "提问" },
  { id: "focus", name: "我的关注" },
  { id: "article", name: "我的文章" },
  //{ id: "column", name: "专栏" },
  //{ id: "idea", name: "想法" },
  { id: "collection", name: "收藏" },
  //{ id: "subscription", name: "关注订阅" },
];

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
const isDeleteDialogVisible = ref(false);
const deletingArticleId = ref<string | null>(null);

const showDeleteDialog = (id: string) => {
  isDeleteDialogVisible.value = true;
  deletingArticleId.value = id;
};

const showCustomDialog = ref(false);
const dialogTitle = ref("");
const dialogMessage = ref("");
const dialogType = ref<"success" | "error">("success");

const confirmDelete = async () => {
  if (!deletingArticleId.value) return;

  try {
    await deleteArticle([deletingArticleId.value]);
    articleList.value = articleList.value.filter(
      (a) => a.id !== deletingArticleId.value
    );
    dialogTitle.value = "操作成功";
    dialogMessage.value = "文章已删除";
    dialogType.value = "success";
    showCustomDialog.value = true;
  } catch (error) {
    dialogTitle.value = "操作失败";
    dialogMessage.value = "删除文章失败，请稍后重试";
    dialogType.value = "error";
    showCustomDialog.value = true;
  } finally {
    isDeleteDialogVisible.value = false;
  }
};

const cancelDelete = () => {
  isDeleteDialogVisible.value = false;
  deletingArticleId.value = null;
};

const collectedList = ref<ContentItem[]>([]);
const currentPage = ref(1);
const loadingCollect = ref(false);

// 加载收藏文章
const loadCollections = async () => {
  try {
    loadingCollect.value = true;
    let page = 1;
    let allCollects = [];

    while (true) {
      const { data } = await getOwnerCollectArticles({
        page,
      });
      const currentList = data?.list || [];
      if (currentList.length === 0) break;

      allCollects = [...allCollects, ...data.list];
      page++;

      if (currentList.length < 10) break;
    }

    collectList.value = allCollects.map((item) => ({
      id: item.id,
      title: item.title,
      abstract: item.abstract,
      cover: item.cover || require("@/assets/background.png"),
      digg_count: item.digg_count,
      collect_count: item.collect_count,
      created_at: item.created_at,
      username: item.username,
      userid: item.user_id,
      avatar: item.avatar,
      content: item.content,
    }));
    console.log("222", collectedList.value);
  } finally {
    loadingCollect.value = false;
  }
};

const deletingCollectId = ref<string | null>(null);

const showUncollectDialog = (id: string) => {
  dialogMessage.value = "确定要取消收藏该文章吗？";
  dialogType.value = "error";
  showCustomDialog.value = true;
  deletingCollectId.value = id;
};
// 取消收藏（仿照取消关注逻辑）
const handleUncollect = async () => {
  if (!deletingCollectId.value) return;

  try {
    await collectArticle({ article_id: deletingCollectId.value });
    collectList.value = collectList.value.filter(
      (a) => a.id !== deletingCollectId.value
    );

    dialogTitle.value = "操作成功";
    dialogMessage.value = "已取消收藏";
    dialogType.value = "success";
    showCustomDialog.value = true;
  } catch (error) {
    dialogTitle.value = "操作失败";
    dialogMessage.value = "取消收藏失败，请稍后重试";
    dialogType.value = "error";
    showCustomDialog.value = true;
  } finally {
    deletingCollectId.value = null;
  }
};

const loadFansCount = async () => {
  try {
    const res = await getFansCount({ user_id: user_id.value });
    console.log("111222", res.data);
    userInfo.followers = res.data;
  } catch (error) {
    ElNotification.error({ title: "错误", message: "粉丝数加载失败" });
  }
};
// 初始化加载
onMounted(() => {
  loadCollections();
  loadFansCount();
});
</script>

<style>
#personalCenter {
  height: 100%;
}
.collection-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--gray-100);
}

.uncollect-btn {
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: 15px;
  background: transparent;
  border: 1px solid var(--gray-100);
  transition: all 0.3s;

  &:hover {
    color: var(--primary);
    border-color: var(--primary);
  }
}

.icon-shoucang-filled {
  margin-right: 4px;
}
.custom-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.custom-dialog {
  background: white;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
}

.dialog-body {
  padding: 24px 16px;
  text-align: center;
}

.dialog-footer {
  padding: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.confirm-btn {
  background: #0084ff;
  color: white;
}

/* 成功/错误状态样式 */
.custom-dialog.success .dialog-header {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.custom-dialog.error .dialog-header {
  background: #fff2f0;
  border-color: #ffccc7;
}
.custom-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  width: 400px;
  text-align: center;
}

.dialog-buttons {
  margin-top: 20px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.confirm-btn {
  background: #f56c6c;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

.cancel-btn {
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
}
:root {
  --primary-color: #0084ff;
  --text-primary: #1a1a1a;
  --text-secondary: #8590a6;
  --border-color: #f0f2f4;
  --bg-color: #f4f6f9;
  --hover-bg: #f5f5f5;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --radius: 4px;
}

.personal-homepage {
  min-height: 100%;
  overflow-y: auto;
  max-width: 1200px;
  margin: 20px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
}

/* 头部样式 */
.header {
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px -3px rgba(0, 0, 0, 0.3);
}

/* CSS 实现 */
.banner-container {
  /* 容器尺寸示例 (根据实际需求修改) */
  width: 1200px;
  height: 200px;

  /* 关键定位属性 */
  position: relative;
  overflow: hidden; /* 隐藏溢出部分 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */

  /* 可选装饰 */
  background: #f0f0f0; /* 加载时的背景色 */
}

.adaptive-image {
  /* 自适应核心代码 */
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键属性 */
  object-position: center; /* 聚焦中心区域 */

  /* 兼容旧版浏览器的备选方案 */
  /* font-family: "object-fit: cover; object-position: center;";  针对 IE/Edge */
  /*  min-width: 100%;防止窄图留白 */
  /* min-height: 100%;  防止矮图留白 */
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
  color: white;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.nickname-ip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.ip {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 10px 0 0;
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

/* 关注列表项样式 */
.follow-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--bg-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.follow-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 16px;
  border: 1px solid var(--border-color);
}

.follow-name {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.latest-article {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.article-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 16px;
  background: var(--bg-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.article-cover {
  width: 120px;
  height: 80px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
}

.article-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--text-primary);
}
.article-title {
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
}

.delete-btn {
  margin-left: auto;
  padding: 4px 8px;
  font-size: 12px;
}
.article-abstract {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
