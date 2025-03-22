<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <div class="search-header">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="请输入搜索关键词"
        enter-button="搜索"
        size="large"
        @search="handleSearch"
      />
    </div>

    <!-- 搜索结果主体 -->
    <div class="search-main">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="all" tab="全部"></a-tab-pane>
        <a-tab-pane key="articles" tab="文章"></a-tab-pane>
<!--        <a-tab-pane key="users" tab="用户"></a-tab-pane>-->
      </a-tabs>

      <!-- 加载状态 -->
      <a-spin :spinning="loading">
        <!-- 结果列表 -->
        <a-list
          :data-source="searchResults"
          :pagination="pagination"
          item-layout="vertical"
        >
          <template #renderItem="{ item }">
            <!-- 文章结果项 -->
            <a-list-item v-if="item.type === 'article'">
              <a-list-item-meta
                :description="item.description"
                class="result-item"
              >
                <template #title>
                  <router-link :to="`/articles/${item.id}`">
                    {{ item.title }}
                  </router-link>
                </template>
                <template #avatar>
                  <a-avatar :src="item.author.avatar" />
                </template>
              </a-list-item-meta>
              <div class="result-stats">
                <span>{{ item.likes }} 赞同</span>
                <span>{{ item.comments }} 评论</span>
                <span>{{ item.timestamp }}</span>
              </div>
            </a-list-item>

            <!-- 用户结果项 -->
            <a-list-item v-if="item.type === 'user'">
              <a-list-item-meta class="user-result">
                <template #title>
                  <router-link :to="`/users/${item.id}`">
                    {{ item.name }}
                  </router-link>
                </template>
                <template #avatar>
                  <a-avatar :src="item.avatar" size="large" />
                </template>
                <template #description>
                  <div class="user-info">
                    <span v-if="item.bio">{{ item.bio }}</span>
                    <div class="stats">
                      <span>{{ item.followers }} 关注者</span>
                      <span>{{ item.articles }} 文章</span>
                    </div>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>

          <!-- 空状态 -->
          <template #empty>
            <a-empty
              v-if="!loading"
              description="暂无搜索结果，请尝试其他关键词"
            />
          </template>
        </a-list>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import {getArticleList} from "@/api/articleApi";
import {formatTime} from "@/utils/formatters";
import {SearchResultItem} from "@/pages/blogPages/blogInterface";

interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
  showSizeChanger: boolean;
}

const route = useRoute();
const searchKeyword = ref("");
const activeTab = ref("all");
const loading = ref(false);
const searchResults = ref<SearchResultItem[]>([]);

// 分页配置
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
});

// 初始化搜索
onMounted(() => {
  const query = route.query.q?.toString();
  if (query) {
    searchKeyword.value = query;
    handleSearch();
  }
});

// 执行搜索
const handleSearch = async () => {
  try {
    loading.value = true;
    // 改用文章列表接口，添加搜索参数
    const { data } = await getArticleList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      key: searchKeyword.value
    });
    console.log(data);
    // 转换数据结构适配搜索结果
    searchResults.value = data.list.map(item => ({
      id: item.id,
      type: "article",
      title: item.title,
      description: item.abstract,
      likes: item.digg_count,
      comments: item.collect_count,
      timestamp: formatTime(new Date(item.created_at)),
      author: {
        id: item.userid,
        name: item.username,
        avatar: item.avatar || 'https://api.yimian.xyz/img'
      }
    }));
    pagination.total = data.count;
  } catch (error) {
    console.error("搜索失败:", error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

// 分页变化处理
const handlePaginationChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  handleSearch();
};

// 标签切换处理
const handleTabChange = (key: string) => {
  activeTab.value = key;
  pagination.current = 1;
  handleSearch();
};
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.search-header {
  margin-bottom: 32px;
}

.search-main {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.result-item {
  margin-bottom: 16px;
}

.result-stats {
  margin-top: 8px;
  color: #8590a6;
  font-size: 14px;
}

.result-stats > span {
  margin-right: 16px;
}

.user-result :deep(.ant-list-item-meta) {
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info .stats {
  margin-top: 8px;
}

.user-info .stats > span {
  margin-right: 16px;
}

@media (max-width: 768px) {
  .search-container {
    padding: 16px;
  }

  .search-main {
    padding: 16px;
  }
}
</style>
