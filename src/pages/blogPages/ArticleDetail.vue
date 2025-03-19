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
          </div>
          <time class="publish-time">{{ article.timestamp }}</time>
        </div>
      </header>

      <!-- 内容区域 --> 
      <section class="content-section">
        <mavon-editor
            v-model="article.content"
            :editable="false"
            :subfield="false"
            :toolbarsFlag="false"
            defaultOpen="preview"
            style="min-height: 500px; border: none;"
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
          <span class="count">{{ article.likes + (isLiked ? 1 : 0) }}</span>
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
import {ref, computed, onMounted, reactive, onBeforeMount} from "vue";
import type { ContentItem } from "./blogInterface";
import {ArticleListItem, getArticleDetail, getArticleList} from "@/api/articleApi";
import {formatTime} from "@/utils/formatters";
import { useRoute } from 'vue-router';
import {ElMessage} from "element-plus";

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
onMounted(async () => {
  console.log(111);
  try {
    loading.value = true;
    const { data } = await getArticleDetail(route.params.id.toString());
    console.log(data);
    article.value = {
      title: data.title,
      abstract: data.abstract,
      content: data.content,
      cover: data.cover,
      author: data.username,
      id: data.id.toString(),
      timestamp: formatTime(new Date(data.created_at)),
      likes: data.digg_count,
      comments: data.collect_count,
    };
    console.log(data);
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
// 响应式数据
const isLiked = ref(false);
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

// 点赞逻辑
const handleLike = () => {
  isLiked.value = !isLiked.value;
  // 这里可以添加API调用
};

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



</script>

<style scoped>
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
