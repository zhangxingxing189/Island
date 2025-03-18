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
            <div v-if="!followList.length" class="empty">
              暂无关注内容，快去关注你感兴趣的作者吧！
            </div>
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
import { useRoute } from "vue-router";
import { getArticleList } from "@/api/articleApi";
import { formatTime } from "@/utils/formatters";
import { getFollowList } from "@/api/focusApi";

// 内容数据
const followList = ref<ContentItem[]>([]);
const recommendList = ref<ContentItem[]>([]);
const hotList = ref<HotItem[]>([]);
const route = useRoute();
const loading = ref(false);
const islandId = ref(route.query.islandId?.toString() || "50005");
const followLoading = ref(false);

// 获取关注文章
/*
const loadFollowArticles = async () => {
  followLoading.value = true;
  const followData = await getFollowList({
    page: 1
  })
  console.log(followData)
  const res = await getArticleList({
    page: 1,
    pageSize: 20
  });
  console.log(res)
  res.data.list.forEach(item=>{
    console.log(item.user_id);
    followData.data.list.forEach(followItem=>{
      if(followItem.user_id === item.user_id){
        console.log(item);
        followList.value.push(item)
      }
    })
  })
  console.log(followList.value);
*/
const loadFollowArticles = async () => {
  followLoading.value = true;
  try {
    // 获取关注列表
    const { data: followData } = await getFollowList({ page: 1 });
    const { data: articleData } = await getArticleList({
      page: 1,
      pageSize: 20
    });

<<<<<<< HEAD
    // 使用Set优化匹配效率
    const followUserIds = new Set(followData.list.map(item => item.user_id));

    // 数据转换（保持与推荐列表一致）
    followList.value = articleData.list
        .filter(item => followUserIds.has(item.user_id))
        .map((item): ContentItem => ({
          id: item.id.toString(),
          title: item.title,
          abstract: item.abstract,
          cover: item.cover || 'https://api.yimian.xyz/img',
          likes: Number(item.digg_count),
          comments: Number(item.collect_count),
          author: item.username,
          timestamp: formatTime(new Date(item.created_at))
        }));

=======
    // 获取关注用户的文章
    const { data } = await getArticleList({
      page: 1,
      pageSize: 10,
      userIds: followData.list.map((u) => u.user_id),
    });

    followList.value = data.list.map((item) => ({
      id: item.id,
      title: item.title,
      brief: item.abstract,
      cover: item.cover || "https://api.yimian.xyz/img",
      likes: item.digg_count,
      comments: item.collect_count,
      author: item.username,
      timestamp: formatTime(new Date(item.created_at)),
    }));
>>>>>>> 2cafd9850585d3eb2e22583f251ed148b8f13140
  } catch (error) {
    console.error("加载关注文章失败:", error);
  } finally {
    followLoading.value = false;
  }
  // try {
  //   // 先获取关注列表
  //   const { data: followData } = await getFollowList({
  //     page: 1,
  //   });
  //   console.log(followData);
  //   // 获取关注用户的文章

  // //
  //   followList.value = data.list.map(item => ({
  //     id: item.id,
  //     title: item.title,
  //     brief: item.abstract,
  //     cover: item.cover || 'https://api.yimian.xyz/img',
  //     likes: item.digg_count,
  //     comments: item.collect_count,
  //     author: item.username,
  //     timestamp: formatTime(new Date(item.created_at))
  //   }));
  // }
  // catch (error) {
  //   console.error("加载关注文章失败:", error);
  // }finally {
  //   followLoading.value = false;
  // }
};

const loadRecommendArticles = async () => {
  loading.value = true;
  try {
    const { data } = await getArticleList({
      page: 1,
      pageSize: 10,
      order: "desc",
      islandId: islandId.value,
    });

    recommendList.value = data.list.map(
      (item): ContentItem => ({
        id: item.id.toString(),
        title: item.title,
        brief: item.abstract,
        cover: item.cover || "https://api.yimian.xyz/img",
        likes: Number(item.digg_count),
        comments: Number(item.collect_count),
        author: item.username,
        timestamp: formatTime(new Date(item.created_at)),
      })
    );
  } catch (error) {
    console.error("加载推荐文章失败:", error);
  } finally {
    loading.value = false;
  }
};
//热点
const loadHotArticles = async () => {
  try {
    const { data } = await getArticleList({
      page: 1,
      pageSize: 10,
      order: "digg_count desc",
    });

    hotList.value = data.list.map((item, index) => ({
      rank: index + 1,
      title: item.title,
      heat: item.digg_count,
      contentItemID: item.id,
      url: `/article/${item.id}`,
    }));
  } catch (error) {
    console.error("加载热榜数据失败:", error);
  }
};
onMounted(async () => {
  await Promise.all([
    loadRecommendArticles(), // 使用新的加载方法
    loadFollowArticles(),
    loadHotArticles(),
<<<<<<< HEAD
=======
    fetchData(),
>>>>>>> 2cafd9850585d3eb2e22583f251ed148b8f13140
  ]);
});

const tabs = [
  { id: "follow", title: "关注" },
  { id: "recommend", title: "推荐" },
  { id: "hot", title: "热榜" },
];
const activeTab = ref("recommend");

<<<<<<< HEAD




=======
// 模拟数据（使用用户提供的图片链接）
const mockFollowData: ContentItem[] = [
  {
    id: "2",
    title: "如何评价2023年人工智能发展趋势？",
    cover: "https://api.yimian.xyz/img",
    clickCount: 256,
    likes: 1500,
    author: "AI研究员",
    brief: "人工智能的未来将如何影响我们的生活？",
    authorID: 1,
    timestamp: "2小时前",
  },
];

const mockRecommendData: ContentItem[] = [
  {
    id: 12,
    title: "如何评价2023年人工智能发展趋势？",
    cover: "https://api.yimian.xyz/img",
    brief: "人工智能的未来将如何影响我们的生活22？",
    clickCount: 256,
    likes: 1500,
    author: "AI研究员",
    authorID: 2,
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
  followList.value.push(...mockFollowData);
  recommendList.value.push(...mockRecommendData);
  hotList.value.push(...mockHotData);
}
>>>>>>> 2cafd9850585d3eb2e22583f251ed148b8f13140
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
