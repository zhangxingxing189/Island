<template>
  <div class="main-container">
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
            <div v-if="followLoading" class="loading-container">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              正在加载关注内容...
            </div>
            <template v-else>
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
            <!--            <div v-if="activeTab === 'follow'" class="pagination-container">
              <a-pagination
                  v-model:current="pagination.page"
                  :pageSize="pagination.pageSize"
                  :total="pagination.total"
                  show-less-items
              />
            </div>-->
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
      <show-island></show-island>
    </div>
  </div>
  <chat />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import ContentCard from "./ContentCard.vue";
import HotList from "./HotList.vue";
import { HotItem, ContentItem } from "./blogInterface";
import { useRoute } from "vue-router";
import { getArticleList } from "@/api/articleApi";
import { formatTime } from "@/utils/formatters";
import { getFollowList } from "@/api/focusApi";
import ShowIsland from "@/pages/blogPages/showIsland.vue";
import { getIslands } from "@/api/islandApi";
import { get_island } from "@/api/questionApi";
import chat from "@/components/chat_xsg.vue";

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
    const { data: followData } = await getFollowList({ page: 1, limit: 2000 });
    let currentPage = 1;
    let allArticles = [];
    while (true) {
      const { data } = await getArticleList({
        pageSize: 10,
        page: currentPage,
      });
      if (!data.list.length) break;
      allArticles = [...allArticles, ...data.list];
      currentPage++;
      if (data.list.length < 10) break;
    }

    console.log(allArticles);
    // 使用Set优化匹配效率
    const followUserIds = new Set(followData.list.map((item) => item.user_id));

    // 数据转换（保持与推荐列表一致）
    followList.value = allArticles
      .filter((item) => followUserIds.has(item.user_id))
      .map(
        (item): ContentItem => ({
          id: item.id.toString(),
          title: item.title,
          content: item.content,
          abstract: item.abstract,
          cover:
            item.cover ||
            "http://118.31.119.216:8080/uploads/ba3f3138bb3d09039baffbd2dc8bab0c.jpeg",
          likes: Number(item.digg_count),
          comments: Number(item.collect_count),
          author: item.username,
          timestamp: formatTime(new Date(item.created_at)),
          collect_count: Number(item.collect_count),
        })
      );
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
const recommendPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  loading: false,
  finished: false,
});
const loadRecommendArticles = async () => {
  if (recommendPagination.loading || recommendPagination.finished) return;

  recommendPagination.loading = true;
  try {
    while (!recommendPagination.finished) {
      const { data } = await getArticleList({
        page: recommendPagination.page,
        pageSize: recommendPagination.pageSize,
        order: "",
        key: islandName.value,
      });

      if (data.list.length) {
        recommendList.value = [
          ...recommendList.value,
          ...data.list.map(
            (item): ContentItem => ({
              id: item.id.toString(),
              title: item.title,
              content: item.content,
              abstract: item.abstract,
              cover: item.cover || "https://api.yimian.xyz/img",
              likes: Number(item.digg_count),
              comments: Number(item.collect_count),
              author: item.username,
              timestamp: formatTime(new Date(item.created_at)),
              collect_count: Number(item.collect_count),
            })
          ),
        ];

        recommendPagination.total += data.list.length;
        recommendPagination.page++;

        // 判断是否加载完毕
        if (data.list.length < recommendPagination.pageSize) {
          recommendPagination.finished = true;
        }
      } else {
        recommendPagination.finished = true;
      }
    }
  } catch (error) {
    console.error("加载推荐文章失败:", error);
  } finally {
    recommendPagination.loading = false;
  }
};

// 添加滚动监听
const onScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollHeight - scrollTop - clientHeight < 100) {
    loadRecommendArticles();
  }
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

//热点
const loadHotArticles = async () => {
  try {
    const { data } = await getArticleList({
      page: 1,
      pageSize: 10,
      order: "digg_count desc",
      key: islandName.value,
    });

    // 添加二次排序保证顺序
    const sortedList = data.list.sort((a, b) => b.digg_count - a.digg_count);

    hotList.value = sortedList.map((item, index) => ({
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
const islandName = ref(route.query.islandId?.toString() || "");
const islandIds = ref("");

const getIslandName = async () => {
  try {
    if (!islandId.value) return;
    const { data } = await get_island({ island_id: islandId.value });
    islandName.value = data?.name || "";
    console.log("当前岛屿名称:", islandName.value);
  } catch (error) {
    console.error("获取岛屿名称失败:", error);
    islandName.value = "";
  }
};
onMounted(async () => {
  await getIslandName();
  await Promise.all([
    loadRecommendArticles(), // 使用新的加载方法
    loadFollowArticles(),
    loadHotArticles(),
  ]);
});

const tabs = [
  { id: "follow", title: "关注" },
  { id: "recommend", title: "推荐" },
  { id: "hot", title: "热榜" },
];
const activeTab = ref("hot");
watch(activeTab, (newVal) => {
  switch (newVal) {
    case "follow":
      followList.value = [];
      loadFollowArticles();
      break;
    case "recommend":
      recommendList.value = [];
      recommendPagination.page = 1;
      recommendPagination.finished = false;
      loadRecommendArticles();
      break;
    case "hot":
      hotList.value = [];
      loadHotArticles();
      break;
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.is-loading {
  margin-right: 8px;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.main-container {
  --primary-color: #0084ff;
  --text-primary: #1a1a1a;
  --text-secondary: #8590a6;
  --border-color: #ebebeb;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  display: flex;
  justify-content: center;
  margin: 0 auto;
  background: #f8f9fa;
  overflow: auto;
  .main-content {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 32px;
    padding: 32px;
    width: 1440px;
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
}
</style>
