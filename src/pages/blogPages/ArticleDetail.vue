<template>
  <div class="article-container">
    <!-- 封面图区域 -->
    <div class="cover-container">
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

        <div class="comment-info">
          <i class="icon-eye"></i>
          <span>{{ article.comments }}次浏览</span>
        </div>
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
import {ref, computed, onMounted, reactive} from "vue";
import type { ContentItem } from "./blogInterface";
import {ArticleListItem, getArticleList} from "@/api/articleApi";

const props = defineProps<{ id: string }>();
const articleData = ref<ContentItem>();

onMounted(async () => {
  // articleData.value = await fetchArticleById(props.id); // 根据 ID 请求接口,还没写好,暂时写个模拟数据
});
// 响应式数据
const isLiked = ref(false);
const article = ref<ContentItem>({
  id: 1,
  title: "如何评价2023年人工智能发展趋势？",
  cover: "https://api.yimian.xyz/img", // 简化后的图片地址
  clickCount: 256,
  likes: 1500,
  author: "AI研究员",
  authorID: 1,
  timestamp: "2小时前",
});

// 格式化内容
const formattedContent = computed(() =>
  content.split("\n").filter((p) => p.trim())
);

// 点赞逻辑
const handleLike = () => {
  isLiked.value = !isLiked.value;
  // 这里可以添加API调用
};

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

// 文章列表数据
const articles = ref<ArticleListItem[]>([]);

// 加载文章列表
const loadArticles = async () => {
  try {
    const { data } = await getArticleList({
      page: pagination.page,
      pageSize: pagination.pageSize
    });

    articles.value = data.list;
    pagination.total = data.count;
  } catch (error) {
    console.error("加载文章失败:", error);
  }
};

// 文章内容（保持原始内容，通过computed自动格式化）
const content =
  "2023年AI发展趋势评析：技术突破与生态重构之年\n" +
  "2023年被视为人工智能发展的历史性转折点，技术突破、应用落地与行业变革三重浪潮交织，推动人类社会加速迈入智能时代。以下从技术演进、行业应用和生态格局三个维度，深度解析年度核心发展趋势：\n" +
  "\n" +
  "一、技术突破：多模态大模型开启通用人工智能新纪元\n" +
  "生成式AI爆发增长\n" +
  "\n" +
  "GPT-4、PaLM-2等千亿级参数模型实现跨模态内容生成，文本生成质量逼近人类水平（GPT-4在BAR考试中超过90%考生）\n" +
  "Stable Diffusion 3、MidJourney V6等图像生成工具突破艺术创作边界，引发版权与创作伦理大讨论\n" +
  "视频生成技术跨越奇点，Runway Gen-2、Pika 1.0实现分钟级高质量视频生成\n" +
  "具身智能突破\n" +
  "\n" +
  "Tesla Optimus、Figure 01等人形机器人实现复杂环境下的自主操作能力\n" +
  "神经符号系统融合技术突破，DeepMind的AlphaDev自主发现优化算法\n" +
  "科学智能崛起\n" +
  "\n" +
  "DeepMind的GNoME发现220万种新材料，加速材料科学研发周期\n" +
  "蛋白质结构预测工具AlphaFold 3扩展至核酸、配体相互作用预测\n" +
  "二、行业应用：垂直领域渗透率突破临界点\n" +
  "领域\t典型应用场景\t商业价值\n" +
  "医疗\tAI辅助诊断准确率达95%+\t全球AI医疗市场规模突破200亿美元\n" +
  "制造\t工业质检效率提升300%\t预测性维护节省15%运维成本\n" +
  "金融\t智能投顾管理资产超5万亿美元\t反欺诈系统拦截损失120亿美元\n" +
  "教育\t个性化学习系统覆盖1.2亿学生\t教育科技融资额同比增长67%\n" +
  "典型案例：\n" +
  "\n" +
  "微软Copilot重构Office生产力套件，用户任务完成速度提升3倍\n" +
  "NVIDIA推出AI工厂解决方案，生物制药企业利用生成式AI缩短药物发现周期\n"; // 保持原有内容
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
  overflow: hidden;
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
