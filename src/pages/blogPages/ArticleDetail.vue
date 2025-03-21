<template>
  <div v-if="loading" class="loading-overlay">
    <el-icon class="is-loading">
      <Loading />
    </el-icon>
    正在加载文章...
  </div>
  <div class="article-container">
    <!-- 封面图区域 -->
    <div class="cover-container" v-if="article?.cover">
      <img :src="article.cover" :alt="article.title" class="cover-image" />
    </div>

    <!-- 主体内容 -->
    <article class="article-content">
      <!-- 标题区 -->
      <header class="article-header">
        <h1 class="title">{{ article.title }}</h1>
        <div class="meta-info">
          <div class="author-info">
            <i class="icon-user"></i>
            <span>{{ article.author }}</span>
            <button
                class="follow-btn"
                :class="{ 'followed': isFollowing }"
                @click="handleFollow"
            >
              {{ isFollowing ? '已关注' : '+ 关注' }}
            </button>
          </div>
          <time class="publish-time">{{ article.timestamp }}</time>
        </div>
      </header>

      <!-- 内容区域 -->
      <section class="content-section">
<!--        <mavon-editor
            v-model="article.content"
            :key="article.content"
            :value="article.content"
            :editable="false"
            :subfield="false"
            :toolbarsFlag="false"
            defaultOpen="preview"
            style="min-height: 500px; border: none;"
        />-->
        <mavon-editor
            v-model="article.content"
            :editable="false"
            :subfield="false"
            :toolbarsFlag="false"
            :boxShadow="false"
            previewBackground="#ffffff"
            defaultOpen="preview"
            style="min-height: 10px; border: 0; padding: 0; margin: 0; margin-bottom: -12px"
        />
        <template v-for="(para, index) in formattedContent" :key="index">
          <p v-if="!para.startsWith('#')" class="content-para">{{ para }}</p>
          <h3 v-else class="content-subtitle">{{ para.slice(1) }}</h3>
        </template>
      </section>

      <!-- 互动区域 -->
      <footer class="action-footer">
        <button
          class="action-btn like-btn"
          :class="{ liked: isLiked }"
          @click="handleLike"
        >
          点赞
          <i class="icon-heart"></i>
          {{ localDiggCount }}
        </button>
        <button
            class="action-btn collect-btn"
            :class="{ collected: isCollected }"
            @click="handleCollect"
        >
          <i class="iconfont icon-shoucang"></i>
          {{ isCollected ? '已收藏' : '收藏' }}
          <span class="count">{{  localCollectCount }}</span>
        </button>
<!--        <div class="comment-info">-->
<!--          <i class="icon-eye"></i>-->
<!--          <span>{{ article.comments }}次浏览</span>-->
<!--        </div>-->
      </footer>

      <!-- 评论区 -->
      <!--      <div class="comment-section">-->
      <!--        <h3 class="comment-title">读者互动</h3>-->
      <!--        <div class="comment-input">-->
      <!--          <textarea placeholder="留下你的见解..."></textarea>-->
      <!--          <button class="submit-btn">发布评论</button>-->
      <!--        </div>-->
      <!--      </div>-->
    </article>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, reactive, onBeforeMount,watch} from "vue";
import type { ContentItem } from "./blogInterface";
import {
  ArticleListItem,
  collectArticle, diggArticle,
  getArticleDetail,
  getArticleList,
  getOwnerCollectArticles, getOwnerDiggArticles
} from "@/api/articleApi";
import {formatTime} from "@/utils/formatters";
import { useRoute } from 'vue-router';
import {followUser, getFollowList} from "@/api/focusApi";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores/user";
import router from "@/router";

/*const props = defineProps<{ id: string }>();
const articleData = ref<ContentItem>();*/
const route = useRoute();
const article = ref<ContentItem>({
  title: '111',
  abstract: '',
  content: '' +
      '',
  cover: require('@/assets/background.png'), // 添加默认封面图
  id: '',
  timestamp: '',
  likes: 0,
  comments: 0,
  author: ''
});
const loading = ref(true);
/*onMounted(async () => {
  try {
    loading.value = true;
    const { data } = await getArticleDetail(route.params.id.toString());
    console.log('接口响应数据:', data);
    // 添加数据校验
      article.value = {
        ...article.value, // 保留默认值
        title: data.data.title || '无标题',
        abstract: data.data.abstract || '暂无摘要',
        content: data.data.content,
        cover: data.data.cover || require('@/assets/background.png'),
        likes: Number(data.data.digg_count) || 0,
        comments: Number(data.data.collect_count) || 0,
        author: data.data.username || '匿名作者'
      console.log(132);
    }
  } catch (error) {
    console.error('加载文章失败:', error);
    ElMessage.error('文章加载失败');
  } finally {
    loading.value = false;
  }
});*/
const displayCollectCount = ref(0);
onMounted(async () => {
  try {
    loading.value = true;
    const { data } = await getArticleDetail(route.params.id.toString());
    console.log(data);
    article.value = {
      title: data.title,
      abstract: data.abstract,
      content: data.content,
      cover: data.cover  ,
      author: data.username,
      id: data.id.toString(),
      timestamp: formatTime(new Date(data.created_at)),
      likes: data.digg_count,
      comments: data.collect_count,
      authorId: data.user_id,
      collect_count: data.collect_count,
    };
    console.log(article.value);

    await checkCollectStatus();
  } catch (error) {
    console.error('加载文章失败:', error);
  } finally {
    loading.value = false;
  }
});
/*onMounted(async () => {
  try {
    const { data } = await getArticleList({
      page: 1,
      pageSize: 1,
      ids: [props.id]
    });

    if(data.list.length > 0) {
      article.value = {
        id: data.list[0].id,
        title: data.list[0].title,
        content: data.list[0].content,
        cover: data.list[0].cover,
        likes: data.list[0].digg_count,
        comments: data.list[0].collect_count,
        author: data.list[0].username,
        timestamp: formatTime(new Date(data.list[0].created_at))
      }
    }
  } catch (error) {
    console.error("加载文章详情失败:", error);
  }
});*/
/*// 响应式数据
const isLiked = ref(false);*/
/*const article = ref<ContentItem>({
  id: 1,
  title: "如何评价2023年人工智能发展趋势？",
  cover: "https://api.yimian.xyz/img", // 简化后的图片地址
  clickCount: 256,
  likes: 1500,
  author: "AI研究员",
  authorID: 1,
  timestamp: "2小时前",
});*/

/*// 格式化内容
const formattedContent = computed(() =>
  content.split("\n").filter((p) => p.trim())
);*/

/*
// 点赞逻辑
const handleLike = () => {
  isLiked.value = !isLiked.value;
  // 这里可以添加API调用
};
*/

/*
// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 文章列表数据
const articles = ref<ArticleListItem[]>([]);

// 加载文章列表
const loadArticles = async () => {
  try {
    const { data } = await getArticleList({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });

    articles.value = data.list;
    pagination.total = data.count;
  } catch (error) {
    console.error("加载文章失败:", error);
  }
};
*/

const isFollowing = ref(false);
const currentAuthorId = ref('');
const userStore = useUserStore();
watch(() => article.value, (newVal) => {
  console.log(111);
  console.log(newVal);
  if (newVal) {
    console.log(newVal);
    currentAuthorId.value = newVal.authorId; // 确保使用正确字段
    checkFollowingStatus(); // 这里已经调用
    console.log(currentAuthorId.value);
  }
});
// 修改后的检查关注状态逻辑
const checkFollowingStatus = async () => {
  try {
    // 获取当前用户的关注列表
    const { data } = await getFollowList({
      user_id: userStore.currentUser?.user_id
    });

    // 判断是否已关注当前作者
    isFollowing.value = data.list.some(
        item => item.user_id === currentAuthorId.value
    );
  } catch (error) {
    console.error('获取关注状态失败:', error);
  }
};

// 修改后的关注操作处理
const handleFollow = async () => {
  try {
    if (!userStore.currentUser) {
      console.log('请先登录');
      return router.push('/login');
    }

    await followUser({ focus_id: currentAuthorId.value });
    isFollowing.value = !isFollowing.value;

    console.log(isFollowing.value);
  } catch (error) {
    console.error('操作失败: ' + error.response?.data?.message || error.message);
  }
};

const collectedIds = ref<Set<string>>(new Set());
const localCollectCount = ref(0);
const isCollected = ref(false);

// 加载收藏状态（与ContentCard相同方法）
const loadCollectStatus = async () => {
  try {
    let page = 1;
    collectedIds.value.clear();

    while (true) {
      const { data } = await getOwnerCollectArticles({ page });
      data.list.forEach(item => collectedIds.value.add(item.id));
      if(data.list.length < 10) break;
      page++;
    }

    isCollected.value = collectedIds.value.has(article.value.id);
  } catch (error) {
    console.error('加载收藏状态失败:', error);
  }
};

// 修改后的收藏处理函数（与ContentCard一致）
const handleCollect = async () => {
  const originalStatus = isCollected.value;
  try {
    // 立即更新本地状态
    isCollected.value = !isCollected.value;

    // API调用
    const { data: res } = await collectArticle({ article_id: article.value.id });

    // 强制刷新收藏状态
    await loadCollectStatus();

    // 同步最新收藏数
    if (typeof res?.collect_count === 'number') {
      localCollectCount.value = res.collect_count;
    }
  } catch (error) {
    // 回滚状态
    isCollected.value = originalStatus;
    ElMessage.error('收藏操作失败');
  }
};

// 初始化时加载（添加collect_count初始化）
onMounted(async () => {
  try {
    loading.value = true;
    const { data } = await getArticleDetail(route.params.id.toString());

    // 保持与ContentCard相同的初始化逻辑
    localCollectCount.value = data.collect_count || 0;

    // 加载收藏状态
    await loadCollectStatus();
  } catch (error) {
    console.error('加载文章失败:', error);
  } finally {
    loading.value = false;
  }
});

const likedIds = ref<Set<string>>(new Set());
const localDiggCount = ref(article.value.likes);
const isLiked = ref(false);

// 分页加载所有点赞文章
const loadAllLikedArticles = async () => {
  try {
    let page = 1;
    while (true) {
      const { data } = await getOwnerDiggArticles({
        page,
      });
      data.list.forEach(item => likedIds.value.add(item.id));
      if (data.list.length < 10) break;
      page++;
    }
    isLiked.value = likedIds.value.has(article.value.id);
    localDiggCount.value = article.value.likes;
  } catch (error) {
    console.error('获取点赞数据失败:', error);
  }
};

onMounted(loadAllLikedArticles);

const handleLike = async () => {
  const originalCount = localDiggCount.value;
  try {
    const newLikeStatus = !isLiked.value;
    localDiggCount.value = newLikeStatus ? originalCount + 1 : originalCount - 1;
    isLiked.value = newLikeStatus;

    const { data: res } = await diggArticle({ article_id: article.value.id });

    if (typeof res?.digg_count === 'number' && res.digg_count >= 0) {
      localDiggCount.value = res.digg_count;
      article.value.likes = res.digg_count;
    }
  } catch (error) {
    isLiked.value = !isLiked.value;
    localDiggCount.value = originalCount;
    console.error('操作失败');
  }
};

</script>

<style scoped>

.action-btn {
  &.collect-btn {
    background: var(--primary-50);
    color: var(--primary);

    &.collected {
      background: var(--primary);
      color: white;
    }
  }
}
.follow-btn {
  margin-left: 12px;
  padding: 4px 12px;
  border-radius: 15px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &.followed {
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    color: #71717a;
    cursor: not-allowed;

    &:hover {
      background: #f4f4f5;
    }
  }
}
.article-container {
  --primary: #2563eb;
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --gray-100: #f3f4f6;

  max-width: 800px;
  margin: 2rem auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: auto;
}

.cover-container {
  position: relative;
  height: 360px;
  background: var(--gray-100);
}

.cover-container .cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cover-container .cover-image:hover {
  transform: scale(1.02);
}

.article-content {
  padding: 2rem 3rem;
}

.article-header {
  margin-bottom: 2rem;
}

.article-header .title {
  font-size: 2.2rem;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--text-secondary);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-info i {
  font-size: 1.2rem;
}

.content-section {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
}

.content-section .content-subtitle {
  font-size: 1.4rem;
  margin: 2rem 0 1rem;
  color: var(--primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-100);
}

.content-section .content-para {
  margin: 1rem 0;
  text-align: justify;
}

.action-footer {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--gray-100);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn.like-btn {
  background: var(--primary-50);
  color: var(--primary);
}

.action-btn.like-btn:hover {
  background: var(--primary-100);
}

.action-btn.like-btn.liked {
  background: var(--primary);
  color: white;
}

.comment-info {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .article-container {
    margin: 1rem;
    border-radius: 8px;
  }

  .cover-container {
    height: 240px;
  }

  .article-content {
    padding: 1.5rem;
  }

  .article-header .title {
    font-size: 1.8rem;
  }
}
</style>
