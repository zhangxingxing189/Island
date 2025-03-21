<template>
  <div class="zhihu-container">
    <div class="main-content">
      <div class="center-content">
        <section class="content-section">
          <template>
            <div v-if="recommendPagination.loading" class="loading-text">
              加载中...
            </div>
            <div
              v-if="recommendPagination.finished && !recommendList.length"
              class="empty-tip"
            >
              未找到相关结果
            </div>
            <div v-else>
              <h3 class="section-title">
                {{
                  searchKeyword ? `搜索"${searchKeyword}"的结果` : "推荐内容"
                }}
              </h3>
              <content-card
                v-for="item in recommendList"
                :key="item.id"
                :data="item"
                @like="handleLike"
              />
            </div>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import ContentCard from "./ContentCard.vue";
import { ContentItem } from "./blogInterface";
import { useRoute } from "vue-router";
import { getArticleList } from "@/api/articleApi";
import { formatTime } from "@/utils/formatters";

// 内容数据
const recommendList = ref<ContentItem[]>([]);
const route = useRoute();
const loading = ref(false);
const searchKeyword = ref(route.query.key?.toString() || "");
console.log(searchKeyword.value);
// 监听搜索关键词变化
watch(
  () => route.query.key,
  (newVal) => {
    searchKeyword.value = newVal?.toString() || "";
    recommendPagination.keyword = searchKeyword.value;
    console.log(searchKeyword.value);
    recommendList.value = [];
    recommendPagination.page = 1;
    recommendPagination.finished = false;
    loadRecommendArticles();
    console.log(recommendPagination.keyword);
  }
);
const recommendPagination = reactive({
  page: 1,
  pageSize: 99,
  total: 0,
  loading: false,
  finished: false,
  keyword: "",
});
const loadRecommendArticles = async () => {
  if (recommendPagination.loading || recommendPagination.finished) return;

  recommendPagination.loading = true;
  try {
    console.log("请求参数:", {
      // 添加参数日志
      page: recommendPagination.page,
      pageSize: recommendPagination.pageSize,
      order: "digg_count desc",
      key: searchKeyword.value,
    });
    const { data } = await getArticleList({
      page: recommendPagination.page,
      pageSize: recommendPagination.pageSize,
      order: "digg_count desc",
      key: searchKeyword.value,
    });
    console.log(data);
    if (data.list.length) {
      recommendList.value = [
        ...recommendList.value,
        ...data.list.map(
          (item): ContentItem => ({
            id: item?.id?.toString() || "",
            title: item?.title || "无标题",
            content: item?.content || "",
            abstract: item?.abstract || "暂无摘要",
            cover: item?.cover || "https://api.yimian.xyz/img", // 改用本地默认图
            likes: Number(item?.digg_count) || 0,
            comments: Number(item?.collect_count) || 0,
            author: item?.username || "匿名用户",
            timestamp: item?.created_at
              ? formatTime(new Date(item.created_at))
              : "未知时间",
          })
        ),
      ];

      recommendPagination.total += data.list.length;
      recommendPagination.page++;

      if (data.list.length < recommendPagination.pageSize) {
        recommendPagination.finished = true;
      }
    } else {
      recommendPagination.finished = true;
    }
  } catch (error) {
    console.error("加载失败:", error);
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
onMounted(async () => {
  console.log(searchKeyword.value);

  await loadRecommendArticles(); // 使用新的加载方法
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
/* 新增样式 */
.loading-text {
  text-align: center;
  padding: 16px;
  color: var(--text-secondary);
}

.empty-tip {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
